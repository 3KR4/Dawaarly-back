const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const tableRegistry = require("../config/tableRegistry");

module.exports = (table_id) => {
  const table = tableRegistry[table_id];

  if (!table?.model) return null;

  return prisma[table.model] || null;
};