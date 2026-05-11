const registry = require("./tableRegistry");

module.exports = (tableId) => {
  return !!registry[tableId];
};
