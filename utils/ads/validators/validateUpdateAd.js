const tableRegistry = require("../config/tableRegistry");
const globalRules = require("../config/globalRules");
const tableRules = require("../config/tableRules");

module.exports = (data, table_id) => {
  table_id = Number(table_id);

  const table = tableRegistry[table_id];

  if (!table) {
    return {
      error: "Invalid table_id",
    };
  }

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
      error: "Invalid fields",
      invalidFields,
    };
  }

  return {
    error: null,
    table,
  };
};
