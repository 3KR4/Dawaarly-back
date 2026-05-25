const { PrismaClient } = require("@prisma/client");
const tableRegistry = require("../utils/ads/config/tableRegistry");
const getModel = require("../utils/ads/services/getModel");

const prisma = new PrismaClient();

const clampLimit = (value) => {
  const limit = Number(value) || 4;
  return Math.min(Math.max(limit, 1), 10);
};

const jsonSearch = (text) => ({
  tags: {
    string_contains: text,
  },
});

const buildAdWhere = (text, withTags = true) => {
  const OR = [
    { title: { contains: text } },
    { description: { contains: text } },
  ];

  if (withTags) OR.push(jsonSearch(text));

  return {
    status: "ACTIVE",
    OR,
  };
};

const buildBlogWhere = (text, isAdmin = false, withTags = true) => {
  const OR = [
    { title_en: { contains: text } },
    { title_ar: { contains: text } },
    { description_en: { contains: text } },
    { description_ar: { contains: text } },
    { meta_title_en: { contains: text } },
    { meta_title_ar: { contains: text } },
    { meta_desc_en: { contains: text } },
    { meta_desc_ar: { contains: text } },
  ];

  if (withTags) OR.push(jsonSearch(text));

  return {
    ...(isAdmin ? {} : { is_published: true }),
    OR,
  };
};

const adSelect = (tableId) => {
  const isRent = tableRegistry[tableId]?.type === "rent";

  return {
    id: true,
    table_id: true,
    title: true,
    price: true,
    currency: true,
    created_at: true,
    ...(isRent ? { rent_frequency: true } : { payment_method: true }),
    table: {
      select: {
        id: true,
        name_ar: true,
        name_en: true,
      },
    },
    category: {
      select: {
        id: true,
        table_id: true,
        name_ar: true,
        name_en: true,
      },
    },
  };
};

const searchAdsInTable = async (tableId, text, limit, withTags = true) => {
  const model = getModel(tableId);
  if (!model) return { rows: [], total: 0 };

  const where = buildAdWhere(text, withTags);

  const [rows, total] = await Promise.all([
    model.findMany({
      where,
      take: limit,
      orderBy: [{ featured_priority: "desc" }, { created_at: "desc" }],
      select: adSelect(tableId),
    }),
    model.count({ where }),
  ]);

  return { rows, total };
};

const searchAds = async (text, limit) => {
  const tableIds = Object.keys(tableRegistry).map(Number);

  try {
    const results = await Promise.all(
      tableIds.map((tableId) => searchAdsInTable(tableId, text, limit, true)),
    );

    return results;
  } catch (err) {
    const results = await Promise.all(
      tableIds.map((tableId) => searchAdsInTable(tableId, text, limit, false)),
    );

    return results;
  }
};

const searchBlogs = async (text, limit, isAdmin = false, withTags = true) => {
  const where = buildBlogWhere(text, isAdmin, withTags);

  const [rows, total] = await Promise.all([
    prisma.Blogs.findMany({
      where,
      take: limit,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        slug: true,
        title_en: true,
        title_ar: true,
        description_en: true,
        description_ar: true,
        created_at: true,
      },
    }),
    prisma.Blogs.count({ where }),
  ]);

  return { rows, total };
};

exports.headerSearch = async (req, res) => {
  try {
    const text = String(req.query.text || "").trim();
    const limit = clampLimit(req.query.limit);

    if (text.length < 2) {
      return res.json({
        ads: [],
        blogs: [],
        totals: { ads: 0, blogs: 0 },
      });
    }

    const isAdmin = req.user?.user_type === "ADMIN";

    const [adGroups, blogResult] = await Promise.all([
      searchAds(text, limit),
      searchBlogs(text, limit, isAdmin, true).catch(() =>
        searchBlogs(text, limit, isAdmin, false),
      ),
    ]);

    const ads = adGroups
      .flatMap((group) => group.rows)
      .sort((a, b) => {
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();
        return bDate - aDate;
      })
      .slice(0, limit);

    return res.json({
      ads,
      blogs: blogResult.rows,
      totals: {
        ads: adGroups.reduce((sum, group) => sum + group.total, 0),
        blogs: blogResult.total,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
