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

const addBoolean = (filters, field, value) => {
  if (isFilled(value)) filters.push({ [field]: toBoolean(value) });
};

const getAllowedDynamicFields = (tableId) => {
  if (!tableId) return new Set();

  const rules = tableRules[tableId] || {};

  return new Set([...(rules.required || []), ...(rules.allowed || [])]);
};

const buildAdsWhere = (query, isAdmin, options = {}) => {
  const tableId = Number(query.table_id) || null;
  const includeDynamic = options.includeDynamic ?? Boolean(tableId);
  const dynamicFields = includeDynamic ? getAllowedDynamicFields(tableId) : new Set();
  const filters = [];

  if (!isAdmin) {
    filters.push({ status: "ACTIVE" });
  } else if (isFilled(query.status)) {
    filters.push({ status: String(query.status).trim() });
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
  addRange(filters, "price", query.min_price, query.max_price);

  if (includeDynamic) {
    if (dynamicFields.has("rent_frequency")) {
      addExactString(filters, "rent_frequency", query.rent_frequency);
    }

    ["bedrooms", "bathrooms", "level"].forEach((field) => {
      if (dynamicFields.has(field)) addExactNumber(filters, field, query[field]);
    });

    [
      "am_pool",
      "am_balcony",
      "am_private_garden",
      "am_kitchen",
      "am_ac",
      "am_heating",
      "am_elevator",
      "am_gym",
    ].forEach((field) => {
      if (dynamicFields.has(field)) addBoolean(filters, field, query[field]);
    });
  }

  return filters.length ? { AND: filters } : {};
};

module.exports = buildAdsWhere;
