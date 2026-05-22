const prisma = require("../../prisma");

module.exports = async (items, userId) => {
  const idsByTable = {};

  items.forEach((item) => {
    if (!idsByTable[item.table_id]) {
      idsByTable[item.table_id] = [];
    }
    idsByTable[item.table_id].push(item.id);
  });

  const images = await prisma.Images.findMany({
    where: {
      OR: Object.entries(idsByTable).map(([table_id, ids]) => ({
        table_id: Number(table_id),
        entity_id: { in: ids },
      })),
    },
  });

  const imageMap = {};

  images.forEach((img) => {
    const key = `${img.table_id}-${img.entity_id}`;
    if (!imageMap[key]) imageMap[key] = [];
    imageMap[key].push(img);
  });

  return items.map((item) => ({
    ...item,
    images: imageMap[`${item.table_id}-${item.id}`] || [],
  }));
};
