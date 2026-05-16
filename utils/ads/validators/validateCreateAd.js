const tableRegistry = require("../config/tableRegistry");
const globalRules = require("../config/globalRules");
const tableRules = require("../config/tableRules");

module.exports = (data) => {
  const table_id = Number(data.table_id);

  const table = tableRegistry[table_id];

  if (!table) {
    return {
      error: "Invalid table_id",
    };
  }

  // 1. reject fields that do not belong to this ad table
  const allowedFields = [
    ...globalRules.required,
    ...globalRules.optional,
    ...(tableRules[table_id]?.required || []),
    ...(tableRules[table_id]?.allowed || []),
  ];

  const invalidFields = Object.keys(data).filter(
    (key) => !allowedFields.includes(key),
  );

  if (invalidFields.length) {
    return {
      error: "Unexpected fields",
      message: `Unexpected field${invalidFields.length > 1 ? "s" : ""}: ${invalidFields.join(
        ", ",
      )}`,
      invalidFields,
    };
  }

  // 2. global required fields
  const globalMissing = globalRules.required.filter(
    (f) => data[f] === undefined || data[f] === null,
  );

  // 3. table specific required fields
  const tableRequired = tableRules[table_id]?.required || [];
  const tableMissing = tableRequired.filter(
    (f) => data[f] === undefined || data[f] === null,
  );

  // 4. merge missing
  const missing = [...globalMissing, ...tableMissing];

  if (missing.length) {
    return {
      error: "Missing fields",
      missing,
    };
  }

  return {
    error: null,
    table,
  };
};
