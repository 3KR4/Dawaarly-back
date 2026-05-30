const tableRules = require("./ads/config/tableRules");

const isFilled = (value) => value !== undefined && value !== null && value !== "";

const toNumber = (value) => Number(value);

const toBoolean = (value) => value === true || value === "true";

const addRange = (filters, field, min, max) => {
  if (!isFilled(min) && !isFilled(max)) return;

  const range = {};

  if (isFilled(min)) range.gte = toNumber(min);
  if (isFilled(max)) range.lte = toNumber(max);

  filters.push({ [field]: range });
};

const addExactNumber = (filters, field, value) => {
  if (isFilled(value)) filters.push({ [field]: toNumber(value) });
};

const addExactString = (filters, field, value) => {
  if (isFilled(value)) filters.push({ [field]: String(value).trim() });
};

const addNotString = (filters, field, value) => {
  if (isFilled(value)) filters.push({ [field]: { not: String(value).trim() } });
};

const addBoolean = (filters, field, value) => {
  if (isFilled(value)) filters.push({ [field]: toBoolean(value) });
};

const addOwnerFilter = (filters, query) => {
  if (query.owner === "dawaarly") {
    filters.push({ admin_id: { not: null } });
    return;
  }

  const ownerId = isFilled(query.owner_id)
    ? toNumber(query.owner_id)
    : isFilled(query.user)
      ? toNumber(query.user)
      : null;
  if (!ownerId) return;

  const ownerType = query.owner_type || query.user_type;

  if (ownerType === "subuser") {
    filters.push({ subuser_id: ownerId });
  } else if (ownerType === "user") {
    filters.push({ user_id: ownerId });
  } else if (ownerType === "admin") {
    filters.push({ admin_id: ownerId });
  } else if (ownerType === "anonymous") {
    filters.push({ anonymous_id: ownerId });
  } else {
    filters.push({
      OR: [
        { subuser_id: ownerId },
        { user_id: ownerId },
        { admin_id: ownerId },
        { anonymous_id: ownerId },
      ],
    });
  }
};

const getAllowedDynamicFields = (tableId) => {
  if (!tableId) return new Set();

  const rules = tableRules[tableId] || {};

  return new Set([...(rules.required || []), ...(rules.allowed || [])]);
};

const getAmenityFields = () => {
  const amenities = new Set();

  Object.values(tableRules).forEach((rules) => {
    [...(rules.required || []), ...(rules.allowed || [])].forEach((field) => {
      if (field.startsWith("am_")) amenities.add(field);
    });
  });

  return [...amenities];
};

const amenityFields = getAmenityFields();

const buildAdsWhere = (query, isAdmin, options = {}) => {
  const tableId = Number(query.table_id) || null;
  const includeDynamic = options.includeDynamic ?? Boolean(tableId);
  const dynamicFields = includeDynamic ? getAllowedDynamicFields(tableId) : new Set();
  const filters = [];

  if (!isAdmin) {
    filters.push({ status: "ACTIVE" });
  } else if (isFilled(query.status)) {
    filters.push({ status: String(query.status).trim() });
  } else {
    addNotString(filters, "status", query.exclude_status);
  }

  if (isFilled(query.search)) {
    const search = String(query.search).trim();

    filters.push({
      OR: [{ title: { contains: search } }, { description: { contains: search } }],
    });
  }

  addExactNumber(filters, "categoryId", query.category || query.categoryId);
  addExactNumber(filters, "subCategoryId", query.subCategory || query.subCategoryId);
  addExactNumber(filters, "country_id", query.country_id);
  addExactNumber(filters, "governorate_id", query.governorate_id);
  addExactNumber(filters, "city_id", query.city_id);
  addExactNumber(filters, "area_id", query.area_id);
  addExactNumber(filters, "compound_id", query.compound_id);
  addExactString(filters, "currency", query.currency);
  addOwnerFilter(filters, query);

  if (!options.skipPriceRange) {
    addRange(filters, "price", query.min_price, query.max_price);
  }
  addBoolean(filters, "is_verified", query.is_verified || query.is_verified_only);

  if (includeDynamic) {
    if (dynamicFields.has("area_m2") && !options.skipAreaRange) {
      addRange(filters, "area_m2", query.min_area_m2, query.max_area_m2);
    }

    if (dynamicFields.has("down_payment")) {
      addRange(filters, "down_payment", query.min_down_payment, query.max_down_payment);
    }

    if (dynamicFields.has("installment_years")) {
      addExactNumber(filters, "installment_years", query.installment_years);
    }

    if (dynamicFields.has("floors")) {
      addExactNumber(filters, "floors", query.floors);
    }

    if (dynamicFields.has("payment_method")) {
      addExactString(filters, "payment_method", query.payment_method);
    }

    if (dynamicFields.has("rent_frequency")) {
      addExactString(filters, "rent_frequency", query.rent_frequency);
    }

    ["type", "land_type", "building_type", "building_condition"].forEach((field) => {
      if (dynamicFields.has(field)) addExactString(filters, field, query[field]);
    });

    ["ready_to_move", "furnished"].forEach((field) => {
      if (dynamicFields.has(field)) addBoolean(filters, field, query[field]);
    });

    ["bedrooms", "bathrooms", "level"].forEach((field) => {
      if (dynamicFields.has(field)) addExactNumber(filters, field, query[field]);
    });

    amenityFields.forEach((field) => {
      if (dynamicFields.has(field)) addBoolean(filters, field, query[field]);
    });
  }

  return filters.length ? { AND: filters } : {};
};

module.exports = buildAdsWhere;
