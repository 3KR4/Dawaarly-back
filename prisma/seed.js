const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.allTables.createMany({
    data: [
      {
        id: 1,
        name_en: "Vacation Homes for Rent",
        name_ar: "بيوت مصايف للإيجار",
      },
      {
        id: 2,
        name_en: "Vacation Homes for Sale",
        name_ar: "بيوت مصايف للبيع",
      },
      {
        id: 3,
        name_en: "Apartments for Sale",
        name_ar: "شقق للبيع",
      },
      {
        id: 4,
        name_en: "Apartments for Rent",
        name_ar: "شقق للإيجار",
      },
      {
        id: 5,
        name_en: "Villas For Sale",
        name_ar: "فلل للبيع",
      },
      {
        id: 6,
        name_en: "Villas For Rent",
        name_ar: "فلل للإيجار",
      },
      {
        id: 7,
        name_en: "Commercial for Sale",
        name_ar: "عقارات تجارية للبيع",
      },
      {
        id: 8,
        name_en: "Commercial for Rent",
        name_ar: "عقارات تجارية للإيجار",
      },
      {
        id: 9,
        name_en: "Buildings & Lands",
        name_ar: "مباني وأراضي",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.categories.createMany({
    data: [
      { id: 1, table_id: 1, name_en: "Villa", name_ar: "فيلا" },
      { id: 2, table_id: 1, name_en: "Chalet", name_ar: "شاليه" },
      { id: 3, table_id: 1, name_en: "Apartment", name_ar: "شقة" },
      { id: 4, table_id: 1, name_en: "Studio", name_ar: "استوديو" },
      { id: 5, table_id: 1, name_en: "Hotel Room", name_ar: "غرفة فندقية" },
      { id: 6, table_id: 1, name_en: "Duplex", name_ar: "دوبلكس" },
      { id: 7, table_id: 1, name_en: "Penthouse", name_ar: "بنتهاوس" },
      { id: 8, table_id: 1, name_en: "Cabin", name_ar: "كبينة" },
    ],
    skipDuplicates: true,
  });

  await prisma.subCategories.createMany({
    data: [
      {
        name_en: "Single Room",
        name_ar: "غرفة فردية",
        category_id: 5,
      },
      {
        name_en: "Double Room",
        name_ar: "غرفة مزدوجة",
        category_id: 5,
      },
      {
        name_en: "Suite",
        name_ar: "جناح",
        category_id: 5,
      },
    ],
    skipDuplicates: true,
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
