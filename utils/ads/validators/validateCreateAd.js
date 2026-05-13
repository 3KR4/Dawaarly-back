const tableRegistry = require("../config/tableRegistry");
const globalRules = require("../config/globalRules");
const tableRules = require("../config/tableRules");

module.exports = (data) => {
  const table_id = Number(data.table_id);



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

  // 5. optional: validate allowed fields existence (not required)
  const allowedFields = tableRules[table_id]?.allowed || [];

  const invalidFields = Object.keys(data).filter((key) => {
    const isGlobal =
      globalRules.required.includes(key) || globalRules.optional.includes(key);
    const isTableAllowed = allowedFields.includes(key);
    const isSystemField = key === "table_id";

    return !isGlobal && !isTableAllowed && !isSystemField;
  });

  return {
    error: null,
    invalidFields: invalidFields.length ? invalidFields : undefined,
  };
};
