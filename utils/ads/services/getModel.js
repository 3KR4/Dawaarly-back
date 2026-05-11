const tableRegistry = require("../config/tableRegistry");

module.exports = (table_id) => {
  return tableRegistry[table_id]?.model || null;
};
