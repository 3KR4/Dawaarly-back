const tableRules = require("./tableRules");

const CURRENCY_OPTIONS = [
  { value: "EGP", label: "EGP" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "SAR", label: "SAR" },
  { value: "AED", label: "AED" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "INSTALLMENTS", label: "Installments" },
  { value: "CASH_OR_INSTALLMENTS", label: "Cash or Installments" },
];

const RENT_FREQUENCY_OPTIONS = [
  { value: "DAY", label: "Daily" },
  { value: "WEEK", label: "Weekly" },
  { value: "MONTH", label: "Monthly" },
];

const ENTITY_TYPE_OPTIONS = [
  { value: "BUILDING", label: "Building" },
  { value: "LAND", label: "Land" },
];

const LAND_TYPE_OPTIONS = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "AGRICULTURAL", label: "Agricultural" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDUSTRIAL", label: "Industrial" },
];

const BUILDING_TYPE_OPTIONS = [
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "MIXED_USE", label: "Mixed Use" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "ADMINISTRATIVE", label: "Administrative" },
];

const BUILDING_CONDITION_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "OLD", label: "Old" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
];

const AMENITY_LABEL_OVERRIDES = {
  ac: "AC",
  central_ac: "Central AC",
  bbq_area: "BBQ Area",
  clubhouse: "Club House",
  fire_system: "Fire System",
  gym: "Gym",
  jacuzzi: "Jacuzzi",
  kids_area: "Kids Area",
  lakeview: "Lake View",
  seeview: "Sea View",
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const toTitleCase = (value) =>
  String(value || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getAmenityLabel = (field) => {
  const key = String(field || "").replace(/^am_/, "");
  return AMENITY_LABEL_OVERRIDES[key] || toTitleCase(key);
};

const BASIC_FILTERS = [
  {
    id: "location",
    label: "Location",
    type: "group",
    placement: "primary",
    children: [
      {
        id: "country_id",
        label: "Country",
        type: "select",
        query_key: "country_id",
        data_source: {
          endpoint: "/data/countries",
          method: "GET",
        },
      },
      {
        id: "governorate_id",
        label: "Governorate",
        type: "select",
        query_key: "governorate_id",
        depends_on: ["country_id"],
        data_source: {
          endpoint: "/data/governorates",
          method: "GET",
          params: ["country_id", "table_id"],
        },
      },
      {
        id: "city_id",
        label: "City",
        type: "select",
        query_key: "city_id",
        depends_on: ["governorate_id"],
        data_source: {
          endpoint: "/data/cities",
          method: "GET",
          params: ["governorate_id", "table_id"],
        },
      },
      {
        id: "area_id",
        label: "Area",
        type: "select",
        query_key: "area_id",
        depends_on: ["city_id"],
        data_source: {
          endpoint: "/data/areas",
          method: "GET",
          params: ["city_id", "table_id"],
        },
      },
      {
        id: "compound_id",
        label: "Compound",
        type: "select",
        query_key: "compound_id",
        depends_on: ["city_id", "area_id"],
        data_source: {
          endpoint: "/data/compounds",
          method: "GET",
          params: ["city_id", "area_id", "table_id"],
        },
      },
    ],
  },
  {
    id: "table_id",
    label: "Department",
    type: "select",
    query_key: "table_id",
    placement: "primary",
    data_source: {
      endpoint: "/data/tables",
      method: "GET",
    },
  },
  {
    id: "price",
    label: "Price",
    type: "range",
    placement: "primary",
    fields: [
      {
        id: "min_price",
        label: "Min Price",
        query_key: "min_price",
        input_type: "number",
      },
      {
        id: "max_price",
        label: "Max Price",
        query_key: "max_price",
        input_type: "number",
      },
    ],
  },
  {
    id: "is_verified",
    label: "Verified Ads",
    type: "boolean",
    query_key: "is_verified",
    placement: "primary",
  },
  {
    id: "currency",
    label: "Currency",
    type: "select",
    query_key: "currency",
    placement: "primary",
    options: CURRENCY_OPTIONS,
  },
];

const FIELD_DEFINITIONS = {
  categoryId: {
    id: "categoryId",
    label: "Category",
    type: "select",
    query_key: "categoryId",
    placement: "secondary",
    data_source: {
      endpoint: "/data/categories",
      method: "GET",
      params: ["table_id"],
    },
  },
  subCategoryId: {
    id: "subCategoryId",
    label: "Sub Category",
    type: "select",
    query_key: "subCategoryId",
    placement: "secondary",
    depends_on: ["categoryId"],
    data_source: {
      endpoint: "/data/subcategories",
      method: "GET",
      params: ["category_id"],
    },
  },
  bedrooms: {
    id: "bedrooms",
    label: "Bedrooms",
    type: "number",
    query_key: "bedrooms",
    placement: "secondary",
  },
  bathrooms: {
    id: "bathrooms",
    label: "Bathrooms",
    type: "number",
    query_key: "bathrooms",
    placement: "secondary",
  },
  level: {
    id: "level",
    label: "Level",
    type: "number",
    query_key: "level",
    placement: "advanced",
  },
  area_m2: {
    id: "area_m2",
    label: "Area",
    type: "range",
    placement: "secondary",
    fields: [
      {
        id: "min_area_m2",
        label: "Min Area",
        query_key: "min_area_m2",
        input_type: "number",
      },
      {
        id: "max_area_m2",
        label: "Max Area",
        query_key: "max_area_m2",
        input_type: "number",
      },
    ],
    unit: "m2",
  },
  payment_method: {
    id: "payment_method",
    label: "Payment Method",
    type: "select",
    query_key: "payment_method",
    placement: "secondary",
    options: PAYMENT_METHOD_OPTIONS,
  },
  down_payment: {
    id: "down_payment",
    label: "Down Payment",
    type: "range",
    placement: "advanced",
    fields: [
      {
        id: "min_down_payment",
        label: "Min Down Payment",
        query_key: "min_down_payment",
        input_type: "number",
      },
      {
        id: "max_down_payment",
        label: "Max Down Payment",
        query_key: "max_down_payment",
        input_type: "number",
      },
    ],
  },
  installment_years: {
    id: "installment_years",
    label: "Installment Years",
    type: "number",
    query_key: "installment_years",
    placement: "advanced",
  },
  ready_to_move: {
    id: "ready_to_move",
    label: "Ready To Move",
    type: "boolean",
    query_key: "ready_to_move",
    placement: "secondary",
  },
  furnished: {
    id: "furnished",
    label: "Furnished",
    type: "boolean",
    query_key: "furnished",
    placement: "secondary",
  },
  rent_frequency: {
    id: "rent_frequency",
    label: "Rent Frequency",
    type: "select",
    query_key: "rent_frequency",
    placement: "secondary",
    options: RENT_FREQUENCY_OPTIONS,
  },
  floors: {
    id: "floors",
    label: "Floors",
    type: "number",
    query_key: "floors",
    placement: "advanced",
  },
  type: {
    id: "type",
    label: "Type",
    type: "select",
    query_key: "type",
    placement: "secondary",
    options: ENTITY_TYPE_OPTIONS,
  },
  land_type: {
    id: "land_type",
    label: "Land Type",
    type: "select",
    query_key: "land_type",
    placement: "advanced",
    options: LAND_TYPE_OPTIONS,
  },
  building_type: {
    id: "building_type",
    label: "Building Type",
    type: "select",
    query_key: "building_type",
    placement: "advanced",
    options: BUILDING_TYPE_OPTIONS,
  },
  building_condition: {
    id: "building_condition",
    label: "Building Condition",
    type: "select",
    query_key: "building_condition",
    placement: "advanced",
    options: BUILDING_CONDITION_OPTIONS,
  },
};

const getAllowedDynamicFields = (tableId) => {
  const rules = tableRules[Number(tableId)] || {};

  return new Set([...(rules.required || []), ...(rules.allowed || [])]);
};

const buildAmenityDefinition = (field) => ({
  id: field,
  label: getAmenityLabel(field),
  type: "boolean",
  query_key: field,
  placement: "advanced",
  group: "amenities",
});

const getDynamicFilters = (tableId) => {
  if (!tableId) return [];

  const dynamicFields = getAllowedDynamicFields(tableId);
  const filters = [clone(FIELD_DEFINITIONS.categoryId), clone(FIELD_DEFINITIONS.subCategoryId)];

  dynamicFields.forEach((field) => {
    if (FIELD_DEFINITIONS[field]) {
      filters.push(clone(FIELD_DEFINITIONS[field]));
      return;
    }

    if (String(field).startsWith("am_")) {
      filters.push(buildAmenityDefinition(field));
    }
  });

  return filters;
};

const getHeroSearchFiltersMeta = (tableId = null) => {
  const numericTableId = Number(tableId) || null;
  const dynamicFilters = getDynamicFilters(numericTableId);
  const rules = numericTableId ? tableRules[numericTableId] || null : null;
  const requiredFields = new Set(rules?.required || []);

  const dynamicWithRequirement = dynamicFilters.map((filter) => ({
    ...filter,
    is_required: requiredFields.has(filter.id),
  }));

  return {
    basic_filters: clone(BASIC_FILTERS),
    dynamic_filters: dynamicWithRequirement,
    query_mode: numericTableId ? "table-scoped" : "global",
  };
};

module.exports = {
  getHeroSearchFiltersMeta,
};
