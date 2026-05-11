const tableRegistry = require("../config/tableRegistry");
const globalRules = require("../config/globalRules");
const tableRules = require("../config/tableRules");

module.exports = (data) => {
  const table_id = Number(data.table_id);

  // 1. check table exists
  const table = tableRegistry[table_id];
  if (!table) {
    return {
      error: "Invalid table_id",
    };
  }

  // 2. base required fields
  let missing = baseRequired(data);

  // 3. dynamic fields from tableConfig
  const extraFields = tableConfig[table_id] || [];

  const missingExtra = extraFields.filter(
    (f) => data[f] === undefined || data[f] === null,
  );

  // 4. merge
  missing = [...missing, ...missingExtra];

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
