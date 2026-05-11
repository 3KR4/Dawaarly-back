const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // =========================
  // ALL TABLES
  // =========================

  await prisma.allTables.createMany({
    data: [
      {
        id: 1,
        slug: "vacation-sale",
        name_en: "Vacation Homes for Sale",
        name_ar: "بيوت مصايف للبيع",
      },
      {
        id: 2,
        slug: "vacation-rent",
        name_en: "Vacation Homes for Rent",
        name_ar: "بيوت مصايف للإيجار",
      },
    ],
    skipDuplicates: true,
  });

  // =========================
  // VACATION SALE CATEGORIES
  // table_id = 1
  // =========================

  await prisma.categories.createMany({
    data: [
      {
        id: 1,
        table_id: 1,
        name_en: "Villa",
        name_ar: "فيلا",
      },
      {
        id: 2,
        table_id: 1,
        name_en: "Chalet",
        name_ar: "شاليه",
      },
      {
        id: 3,
        table_id: 1,
        name_en: "Apartment",
        name_ar: "شقة",
      },
      {
        id: 4,
        table_id: 1,
        name_en: "Studio",
        name_ar: "استوديو",
      },
      {
        id: 5,
        table_id: 1,
        name_en: "Hotel Room",
        name_ar: "غرفة فندقية",
      },
      {
        id: 6,
        table_id: 1,
        name_en: "Duplex",
        name_ar: "دوبلكس",
      },
      {
        id: 7,
        table_id: 1,
        name_en: "Penthouse",
        name_ar: "بنتهاوس",
      },
      {
        id: 8,
        table_id: 1,
        name_en: "Cabin",
        name_ar: "كبينة",
      },
    ],
    skipDuplicates: true,
  });

  // =========================
  // VACATION RENT CATEGORIES
  // table_id = 2
  // =========================

  await prisma.categories.createMany({
    data: [
      {
        id: 9,
        table_id: 2,
        name_en: "Villa",
        name_ar: "فيلا",
      },
      {
        id: 10,
        table_id: 2,
        name_en: "Chalet",
        name_ar: "شاليه",
      },
      {
        id: 11,
        table_id: 2,
        name_en: "Apartment",
        name_ar: "شقة",
      },
      {
        id: 12,
        table_id: 2,
        name_en: "Studio",
        name_ar: "استوديو",
      },
      {
        id: 13,
        table_id: 2,
        name_en: "Hotel Room",
        name_ar: "غرفة فندقية",
      },
      {
        id: 14,
        table_id: 2,
        name_en: "Duplex",
        name_ar: "دوبلكس",
      },
      {
        id: 15,
        table_id: 2,
        name_en: "Penthouse",
        name_ar: "بنتهاوس",
      },
      {
        id: 16,
        table_id: 2,
        name_en: "Cabin",
        name_ar: "كبينة",
      },
    ],
    skipDuplicates: true,
  });

  // =========================
  // SALE SUB CATEGORIES
  // category_id = 5
  // =========================

  await prisma.subCategories.createMany({
    data: [
      {
        id: 1,
        category_id: 5,
        name_en: "Single Room",
        name_ar: "غرفة فردية",
      },
      {
        id: 2,
        category_id: 5,
        name_en: "Double Room",
        name_ar: "غرفة مزدوجة",
      },
      {
        id: 3,
        category_id: 5,
        name_en: "Suite",
        name_ar: "جناح",
      },
    ],
    skipDuplicates: true,
  });

  // =========================
  // RENT SUB CATEGORIES
  // category_id = 13
  // =========================

  await prisma.subCategories.createMany({
    data: [
      {
        id: 4,
        category_id: 13,
        name_en: "Single Room",
        name_ar: "غرفة فردية",
      },
      {
        id: 5,
        category_id: 13,
        name_en: "Double Room",
        name_ar: "غرفة مزدوجة",
      },
      {
        id: 6,
        category_id: 13,
        name_en: "Suite",
        name_ar: "جناح",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });