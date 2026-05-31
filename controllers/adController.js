const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const buildAdsWhere = require("../utils/buildAdsWhere");
const { pagination } = require("../utils/pagination");
const { getCache, setCache, deleteCachePattern } = require("../utils/redis");
const { validateAdDates } = require("../utils/validation");
const tableRegistry = require("../utils/ads/config/tableRegistry");
const { toEgp } = require("../utils/currency");
const {
  sendPendingAdReviewEmail,
  sendAdStatusDecisionEmail,
} = require("../utils/sendEmail");

const PENDING_AD_REVIEW_EMAIL =
  process.env.PENDING_AD_REVIEW_EMAIL || "mouhamedmahmoud820@gmail.com";

const adIncludeRelations = {
  subuser: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      tiktok_link: true,
      facebook_link: true,
      created_at: true,
      active_ads_count: true,
    },
  },

  anonymous: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      ip_address: true,
      created_at: true,
      approved_by_admin_id: true,
    },
  },

  admin: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
    },
  },

  table: {
    select: {
      id: true,
      name_ar: true,
      name_en: true,
    },
  },
  category: true,
  subCategory: true,

  country: true,
  governorate: true,
  city: true,
  area: true,
  compound: true,
};
const adIncludeListRelations = {
  city: true,
  governorate: true,
  area: true,
  compound: true,
  anonymous: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      ip_address: true,
    },
  },

  subuser: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      user_type: true,
      created_at: true,
      active_ads_count: true,
    },
  },

  admin: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      user_type: true,
    },
  },

  table: {
    select: {
      id: true,
      name_ar: true,
      name_en: true,
    },
  },
  category: true,
  subCategory: true,
};

const listDetailFields = [
  "furnished",
  "bedrooms",
  "bathrooms",
  "level",
  "area_m2",
  "floors",
  "building_condition",
];

function pickListDetails(ad) {
  return listDetailFields.reduce((details, field) => {
    if (Object.prototype.hasOwnProperty.call(ad, field)) {
      details[field] = ad[field];
    }

    return details;
  }, {});
}

function formatListAd(ad) {
  const firstImage =
    ad.images?.find((i) => i.is_cover) || ad.images?.[0] || null;

  return {
    id: ad.id,
    title: ad.title,
    price: ad.price,
    deposit_amount: ad.deposit_amount,
    currency: ad.currency,
    rent_frequency: ad.rent_frequency,
    status: ad.status,
    is_verified: ad.is_verified,
    created_at: ad.created_at,
    table: ad.table,
    city: ad.city,
    governorate: ad.governorate,
    area: ad.area,
    compound: ad.compound,
    category: ad.category,
    subCategory: ad.subCategory,
    featured_priority: ad.featured_priority,
    views_count: ad.views_count,
    reach_count: ad.reach_count,
    favorites_count: ad.favorites_count,
    admin: ad.admin || null,
    subuser: ad.subuser || null,
    user: ad.user || null,
    anonymous: ad.anonymous || null,
    anonymous_id: ad.anonymous_id || null,
    user_id: ad.user_id || null,
    image: firstImage,
    details: pickListDetails(ad),
  };
}
function formatDetailAd(ad) {
  const amenities = {};
  const details = {};
  const relationIdFields = [
    "admin_id",
    "user_id",
    "subuser_id",
    "anonymous_id",
    "country_id",
    "governorate_id",
    "city_id",
    "area_id",
    "compound_id",
    "categoryId",
    "subCategoryId",
  ];

  const cleaned = { ...ad };

  Object.keys(cleaned).forEach((k) => {
    if (k.startsWith("am_")) {
      amenities[k.replace("am_", "")] = cleaned[k];
      delete cleaned[k];
    }

    if (["bedrooms", "bathrooms", "level"].includes(k)) {
      details[k] = cleaned[k];
      delete cleaned[k];
    }
  });

  relationIdFields.forEach((field) => {
    delete cleaned[field];
  });

  return {
    ...cleaned,
    amenities,
    details,
  };
}
async function enrichAds(ads, userId = null, mode = "list") {
  if (!ads) return null;

  if (!Array.isArray(ads)) {
    ads = [ads];
  }

  const groupedByTable = {};

  for (const ad of ads) {
    if (!groupedByTable[ad.table_id]) {
      groupedByTable[ad.table_id] = [];
    }

    groupedByTable[ad.table_id].push(ad.id);
  }

  let images = [];
  let favorites = [];
  const regularUserIds = [
    ...new Set(ads.map((ad) => ad.user_id).filter(Boolean)),
  ];
  let regularUsersById = {};

  if (regularUserIds.length) {
    const regularUsers = await prisma.Users.findMany({
      where: { id: { in: regularUserIds } },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        user_type: true,
        created_at: true,
      },
    });

    regularUsersById = regularUsers.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
  }

  // =========================
  // LOAD DATA
  // =========================
  for (const table_id in groupedByTable) {
    const ids = groupedByTable[table_id];

    // =========================
    // DETAIL => ALL IMAGES
    // LIST => COVER ONLY
    // =========================
    const tableImages = await prisma.images.findMany({
      where: {
        table_id: Number(table_id),

        entity_id: {
          in: ids,
        },

        ...(mode === "list" && {
          is_cover: true,
        }),
      },

      orderBy: {
        order: "asc",
      },
    });

    images.push(...tableImages);

    // =========================
    // FAVORITES
    // =========================
    if (userId) {
      const tableFavorites = await prisma.adFavorite.findMany({
        where: {
          user_id: userId,

          table_id: Number(table_id),

          entity_id: {
            in: ids,
          },
        },
      });

      favorites.push(...tableFavorites);
    }
  }

  // =========================
  // IMAGE MAP
  // =========================
  const imageMap = images.reduce((acc, img) => {
    const key = `${img.table_id}_${img.entity_id}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(img);

    return acc;
  }, {});

  // =========================
  // FAVORITES SET
  // =========================
  const favoriteSet = new Set(
    favorites.map((f) => `${f.table_id}_${f.entity_id}`),
  );

  // =========================
  // BUILD RESPONSE
  // =========================
  return ads.map((ad) => {
    const key = `${ad.table_id}_${ad.id}`;

    const adImages = imageMap[key] || [];

    const isFav = favoriteSet.has(key);

    const formatted =
      mode === "detail"
        ? formatDetailAd({
            ...ad,
            user: regularUsersById[ad.user_id] || ad.user || null,
            images: adImages,
          })
        : formatListAd({
            ...ad,
            user: regularUsersById[ad.user_id] || ad.user || null,
            image: adImages[0] || null,
          });

    const { table_id, table, ...responseAd } = formatted;

    return {
      ...responseAd,

      department: table || {
        id: ad.table_id,
        name_ar: null,
        name_en: null,
      },

      ...(mode === "detail" && {
        images: adImages,
      }),

      ...(mode === "list" && {
        image: adImages[0] || null,
      }),

      isFavorite: isFav,
    };
  });
}
const validateCreateAd = require("../utils/ads/validators/validateCreateAd");
const getModel = require("../utils/ads/services/getModel");
const validateUpdateAd = require("../utils/ads/validators/validateUpdateAd");

const getAdsOrderBy = (query) => {
  const sort = query.sort || query.sort_by;
  const order = query.order === "asc" ? "asc" : "desc";

  const orderBy = [{ featured_priority: "desc" }];

  if (sort === "top_views" || sort === "views" || sort === "views_desc") {
    orderBy.push({ views_count: "desc" }, { created_at: "desc" });
  } else if (sort === "favorites" || sort === "favorites_desc") {
    orderBy.push({ favorites_count: "desc" }, { created_at: "desc" });
  } else if (sort === "title_asc" || sort === "title") {
    orderBy.push({ title: "asc" }, { created_at: "desc" });
  } else if (sort === "title_desc") {
    orderBy.push({ title: "desc" }, { created_at: "desc" });
  } else if (sort === "date_asc" || (sort === "date" && order === "asc")) {
    orderBy.push({ created_at: "asc" });
  } else {
    orderBy.push({ created_at: "desc" });
  }

  return orderBy;
};

const compareAds = (query) => {
  const sort = query.sort || query.sort_by;
  const order = query.order === "asc" ? "asc" : "desc";

  return (a, b) => {
    const priorityDiff = Number(b.featured_priority || 0) - Number(a.featured_priority || 0);
    if (priorityDiff !== 0) return priorityDiff;

    if (sort === "top_views" || sort === "views" || sort === "views_desc") {
      const viewsDiff = Number(b.views_count || 0) - Number(a.views_count || 0);
      if (viewsDiff !== 0) return viewsDiff;
    }

    if (sort === "favorites" || sort === "favorites_desc") {
      const favoritesDiff =
        Number(b.favorites_count || 0) - Number(a.favorites_count || 0);
      if (favoritesDiff !== 0) return favoritesDiff;
    }

    if (sort === "price_asc" || sort === "price") {
      const priceDiff = toEgp(a.price, a.currency) - toEgp(b.price, b.currency);
      if (priceDiff !== 0) return priceDiff;
    }

    if (sort === "price_desc") {
      const priceDiff = toEgp(b.price, b.currency) - toEgp(a.price, a.currency);
      if (priceDiff !== 0) return priceDiff;
    }

    if (sort === "title_asc" || sort === "title") {
      const titleDiff = String(a.title || "").localeCompare(String(b.title || ""));
      if (titleDiff !== 0) return titleDiff;
    }

    if (sort === "title_desc") {
      const titleDiff = String(b.title || "").localeCompare(String(a.title || ""));
      if (titleDiff !== 0) return titleDiff;
    }

    const aDate = new Date(a.created_at).getTime();
    const bDate = new Date(b.created_at).getTime();

    if (sort === "date_asc" || (sort === "date" && order === "asc")) {
      return aDate - bDate;
    }

    return bDate - aDate;
  };
};

const isPriceSort = (query) => {
  const sort = query.sort || query.sort_by;
  return sort === "price_asc" || sort === "price_desc" || sort === "price";
};

const isFilled = (value) => value !== undefined && value !== null && value !== "";

const isWithinNormalizedPriceRange = (ad, query) => {
  const min = isFilled(query.min_price) ? Number(query.min_price) : null;
  const max = isFilled(query.max_price) ? Number(query.max_price) : null;
  const normalizedPrice = toEgp(ad.price, ad.currency);

  if (min !== null && normalizedPrice < min) return false;
  if (max !== null && normalizedPrice > max) return false;
  return true;
};

const getMaxNormalizedPrice = (ads) =>
  Math.ceil(
    ads.reduce((max, ad) => Math.max(max, toEgp(ad.price, ad.currency)), 0),
  );

const getMaxAreaM2 = (ads) =>
  Math.ceil(
    ads.reduce((max, ad) => Math.max(max, Number(ad.area_m2) || 0), 0),
  );

const buildAdsMeta = ({ priceAds, areaAds }) => ({
  max_price: getMaxNormalizedPrice(priceAds),
  max_area_m2: getMaxAreaM2(areaAds),
  price_currency: "EGP",
});

const getSectionOrderBy = (type, query) => {
  if (type === "views" || type === "top_views") {
    return [{ views_count: "desc" }, { created_at: "desc" }];
  }

  if (type === "featured" || type === "futured") {
    return [{ featured_priority: "desc" }, { created_at: "desc" }];
  }

  return getAdsOrderBy(query);
};

const compareSectionAds = (type, query) => {
  if (type === "views" || type === "top_views") {
    return (a, b) => {
      const viewsDiff = Number(b.views_count || 0) - Number(a.views_count || 0);
      if (viewsDiff !== 0) return viewsDiff;

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    };
  }

  return compareAds(query);
};

const trackAdView = async ({ prismaModel, entityId, tableId, userId, ip }) => {
  const updatedAd = await prismaModel.update({
    where: { id: entityId },
    data: {
      views_count: { increment: 1 },
    },
    select: {
      views_count: true,
      reach_count: true,
    },
  });

  let reach_count = updatedAd.reach_count;

  try {
    await prisma.AdReach.create({
      data: {
        entity_id: entityId,
        table_id: tableId,
        user_id: userId || null,
        ip_address: userId ? null : ip,
      },
    });

    const reachedAd = await prismaModel.update({
      where: { id: entityId },
      data: {
        reach_count: { increment: 1 },
      },
      select: {
        reach_count: true,
      },
    });

    reach_count = reachedAd.reach_count;
  } catch (err) {
    if (err.code !== "P2002") {
      throw err;
    }
  }

  return {
    views_count: updatedAd.views_count,
    reach_count,
  };
};

const getAvailableAdTables = () =>
  Object.keys(tableRegistry)
    .map(Number)
    .map((table_id) => ({ table_id, prismaModel: getModel(table_id) }))
    .filter((entry) => entry.prismaModel);

const getActiveAdsCount = async (subuserId) => {
  const counts = await Promise.all(
    getAvailableAdTables().map(({ prismaModel }) =>
      prismaModel.count({
        where: {
          status: "ACTIVE",
          subuser_id: subuserId,
        },
      }),
    ),
  );

  return counts.reduce((total, count) => total + count, 0);
};

const sectionFieldByType = {
  gov: "governorate_id",
  governorate: "governorate_id",
  city: "city_id",
  area: "area_id",
  compound: "compound_id",
  compounds: "compound_id",
  category: "categoryId",
  subCategory: "subCategoryId",
  sub_category: "subCategoryId",
  subcategory: "subCategoryId",
};

const globalSectionTypes = new Set([
  "views",
  "top_views",
  "featured",
  "futured",
  "favorites",
  "favourites",
  "favoriets",
  "table",
]);

const specificTableSectionTypes = new Set([
  "category",
  "subCategory",
  "sub_category",
  "subcategory",
]);

const normalizeBoolean = (value) =>
  value === true || value === "true" || value === 1 || value === "1";

const normalizePermissions = (permissions) => {
  if (!permissions) return [];
  if (Array.isArray(permissions)) return permissions.filter(Boolean);

  if (typeof permissions === "string") {
    const trimmed = permissions.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return trimmed
        .split(",")
        .map((permission) => permission.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const normalizeTagsForStorage = (tags) => {
  if (tags === undefined) return undefined;
  if (tags === null) return null;

  if (Array.isArray(tags)) {
    const values = tags.map((tag) => String(tag).trim()).filter(Boolean);
    return values.length ? JSON.stringify(values) : null;
  }

  if (typeof tags === "string") {
    const trimmedTags = tags.trim();
    if (!trimmedTags) return null;

    try {
      JSON.parse(trimmedTags);
      return trimmedTags;
    } catch {
      const values = trimmedTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      return values.length ? JSON.stringify(values) : null;
    }
  }

  return JSON.stringify(tags);
};

const getRequestIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.ip ||
  req.socket?.remoteAddress ||
  null;

const normalizeAnonymousContact = (anonymous = {}) => ({
  full_name: String(anonymous.full_name || anonymous.name || "").trim(),
  email: anonymous.email ? String(anonymous.email).trim() : null,
  phone: anonymous.phone ? String(anonymous.phone).trim() : null,
});

const normalizeComparableText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const normalizeComparablePhone = (value) =>
  String(value || "").replace(/[^\d+]/g, "");

const getEditDistance = (left, right) => {
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;

  const previous = Array.from({ length: right.length + 1 }, (_, i) => i);

  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;

    for (let j = 1; j <= right.length; j += 1) {
      const temp = previous[j];
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
      diagonal = temp;
    }
  }

  return previous[right.length];
};

const getSimilarity = (left, right) => {
  if (!left || !right) return 0;
  const maxLength = Math.max(left.length, right.length);
  if (!maxLength) return 1;

  return 1 - getEditDistance(left, right) / maxLength;
};

const areSimilarTexts = (left, right, threshold = 0.86) =>
  left === right || getSimilarity(left, right) >= threshold;

const areSimilarPhones = (left, right) => {
  if (!left || !right) return false;
  if (left === right) return true;

  const leftTail = left.slice(-8);
  const rightTail = right.slice(-8);

  return leftTail.length >= 8 && leftTail === rightTail;
};

const isSameAnonymousContact = (candidate, contact) => {
  const candidateName = normalizeComparableText(candidate.full_name);
  const contactName = normalizeComparableText(contact.full_name);
  const candidateEmail = normalizeComparableText(candidate.email);
  const contactEmail = normalizeComparableText(contact.email);
  const candidatePhone = normalizeComparablePhone(candidate.phone);
  const contactPhone = normalizeComparablePhone(contact.phone);

  if (contactEmail && areSimilarTexts(candidateEmail, contactEmail, 0.92)) {
    return true;
  }

  if (contactPhone && areSimilarPhones(candidatePhone, contactPhone)) {
    return true;
  }

  if (!candidateName || !contactName) return false;

  return areSimilarTexts(candidateName, contactName);
};

const createAnonymousOwner = async (anonymous, req) => {
  const contact = normalizeAnonymousContact(anonymous);
  const ipAddress = getRequestIp(req);

  if (!contact.full_name) {
    const error = new Error("Anonymous full_name is required");
    error.statusCode = 400;
    throw error;
  }

  if (!contact.email && !contact.phone) {
    const error = new Error("Anonymous email or phone is required");
    error.statusCode = 400;
    throw error;
  }

  if (ipAddress) {
    const candidates = await prisma.Anonymous.findMany({
      where: { ip_address: ipAddress },
      orderBy: { updated_at: "desc" },
      take: 25,
    });
    const existingAnonymous = candidates.find((candidate) =>
      isSameAnonymousContact(candidate, contact),
    );

    if (existingAnonymous) {
      return prisma.Anonymous.update({
        where: { id: existingAnonymous.id },
        data: {
          full_name: contact.full_name || existingAnonymous.full_name,
          email: contact.email || existingAnonymous.email,
          phone: contact.phone || existingAnonymous.phone,
        },
      });
    }
  }

  return prisma.Anonymous.create({
    data: {
      ...contact,
      ip_address: ipAddress,
    },
  });
};

const getAdOwnerContact = async (ad) => {
  if (ad.subuser_id) {
    return prisma.Users.findUnique({
      where: { id: ad.subuser_id },
      select: { email: true, full_name: true },
    });
  }

  if (ad.user_id) {
    return prisma.Users.findUnique({
      where: { id: ad.user_id },
      select: { email: true, full_name: true },
    });
  }

  if (ad.anonymous_id) {
    return prisma.Anonymous.findUnique({
      where: { id: ad.anonymous_id },
      select: { email: true, full_name: true },
    });
  }

  return null;
};

exports.createAd = async (req, res) => {
  try {
    const data = { ...req.body };
    const anonymousPayload = data.anonymous;
    delete data.anonymous;

    // =========================
    // TABLE ID
    // =========================
    const table_id = Number(req.params.table_id);

    // inject table_id
    data.table_id = table_id;

    // =========================
    // VALIDATION
    // =========================
    const validation = validateCreateAd(data);

    if (validation.error) {
      return res.status(400).json(validation);
    }

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${prismaModel} not found`,
      });
    }

    const authUser = req.user;
    const user = authUser
      ? await prisma.Users.findUnique({
          where: { id: authUser.id },
        })
      : null;

    if (authUser && !user) {
      return res.status(401).json({
        message: "Authenticated user not found",
      });
    }

    if (user) {
      user.permissions = normalizePermissions(user.permissions);
    }

    // =========================
    // OWNER LOGIC
    // =========================
    let subuser_id = null;
    let user_id = null;
    let anonymous_id = null;
    let admin_id = null;
    let status = "PENDING";
    let is_verified = false;
    let status_changed_at = null;

    if (!user) {
      const anonymous = await createAnonymousOwner(anonymousPayload, req);
      anonymous_id = anonymous.id;
      data.display_dawaarly_contact = true;
      data.display_phone = false;
      data.display_whatsapp = false;
    } else if (user.is_super_admin) {
      admin_id = user.id;
      status = "ACTIVE";
      is_verified = true;
      status_changed_at = new Date();
    } else if (user.user_type === "ADMIN") {
      if (!user.permissions?.includes("CREATE_AD")) {
        return res.status(403).json({
          message: "Access denied: You need CREATE_AD permission",
        });
      }

      admin_id = user.id;
      status = "ACTIVE";
      is_verified = true;
      status_changed_at = new Date();
    } else if (user.user_type === "SUBUSER") {
      const activeAdsCount = await getActiveAdsCount(user.id);
      const activeAdsLimit = Number(user.subscription_ads_limit || 0);

      if (activeAdsCount >= activeAdsLimit) {
        return res.status(403).json({
          message: "Active ads limit reached",
        });
      }

      subuser_id = user.id;
    } else if (user.user_type === "USER") {
      user_id = user.id;
      data.display_dawaarly_contact = true;
      data.display_phone = false;
      data.display_whatsapp = false;
    } else {
      return res.status(403).json({
        message: "This user type cannot create ads",
      });
    }

    // =========================
    // BUILD CREATE DATA
    // =========================
    const createData = {
      ...data,

      table_id,
      subuser_id,
      user_id,
      anonymous_id,
      admin_id,
      status,
      is_verified,

      status_changed_at,
    };

    createData.tags = normalizeTagsForStorage(createData.tags);

    // =========================
    // DATE CASTING
    // =========================
    if (data.available_from) {
      createData.available_from = new Date(data.available_from);
    }

    if (data.available_to) {
      createData.available_to = new Date(data.available_to);
    }

    // =========================
    // CREATE AD
    // =========================
    const ad = await prismaModel.create({
      data: createData,
    });

    if (ad.status === "PENDING") {
      sendPendingAdReviewEmail({
        to: PENDING_AD_REVIEW_EMAIL,
        adTitle: ad.title,
        adId: ad.id,
        tableId: table_id,
      }).catch((error) => {
        console.error("Failed to send pending ad review email:", error.message);
      });
    }

    // =========================
    // RESPONSE
    // =========================
    return res.status(201).json({
      success: true,
      message: "Ad created successfully",
      data: {
        id: ad.id,
        table_id,
        status: ad.status,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.updateAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);
    const table_id = Number(req.params.table_id);

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // GET AD
    // =========================

    const ad = await prismaModel.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({
        message: `Ad ${adId} not found`,
      });
    }

    // =========================
    // AUTH
    // =========================
    const user = req.user;

    const isAdmin =
      user?.permissions?.includes("UPDATE_AD") || user?.is_super_admin;

    const isOwner =
      ad.subuser_id === user.id ||
      ad.user_id === user.id ||
      ad.admin_id === user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // =========================
    // VALIDATION
    // =========================
    const validation = validateUpdateAd(req.body, table_id);

    if (validation.error) {
      return res.status(400).json(validation);
    }

    // =========================
    // BUILD UPDATE DATA
    // =========================
    const dataToUpdate = {
      ...req.body,
    };

    if (Object.prototype.hasOwnProperty.call(dataToUpdate, "tags")) {
      dataToUpdate.tags = normalizeTagsForStorage(dataToUpdate.tags);
    }

    // date casting
    if (req.body.available_from) {
      dataToUpdate.available_from = new Date(req.body.available_from);
    }

    if (req.body.available_to) {
      dataToUpdate.available_to = new Date(req.body.available_to);
    }

    if (isAdmin && req.body.is_verified !== undefined) {
      dataToUpdate.is_verified = normalizeBoolean(req.body.is_verified);
    }

    // pending after edit
    if (!isAdmin) {
      dataToUpdate.status = "PENDING";
      dataToUpdate.was_previously_approved = true;
    }

    // prevent changing protected fields
    delete dataToUpdate.id;
    delete dataToUpdate.table_id;
    delete dataToUpdate.subuser_id;
    delete dataToUpdate.user_id;
    delete dataToUpdate.admin_id;
    delete dataToUpdate.anonymous_id;

    if (!isAdmin) {
      delete dataToUpdate.is_verified;
    }

    // =========================
    // UPDATE
    // =========================
    const updatedAd = await prismaModel.update({
      where: { id: adId },
      data: dataToUpdate,
    });

    // =========================
    // CACHE
    // =========================
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("userAds:*");
    await deleteCachePattern("sections:*");

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      success: true,
      message: "Ad updated successfully",
      data: updatedAd,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deleteAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);
    const table_id = Number(req.params.table_id);

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // FIND AD
    // =========================
    const ad = await prismaModel.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({
        message: "Ad not found",
      });
    }

    // =========================
    // AUTH
    // =========================
    const user = req.user;

    const isOwner =
      ad.subuser_id === user.id ||
      ad.user_id === user.id ||
      ad.admin_id === user.id;

    const canDelete =
      user?.is_super_admin || user?.permissions?.includes("DELETE_AD");

    if (!isOwner && !canDelete) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // =========================
    // IMAGES
    // =========================
    const images = await prisma.Images.findMany({
      where: {
        entity_type: "AD",
        table_id,
        entity_id: adId,
      },
    });

    await Promise.allSettled(
      images.map((img) => cloudinary.uploader.destroy(img.public_id)),
    );

    // =========================
    // DELETE
    // =========================
    await prismaModel.delete({
      where: { id: adId },
    });

    // =========================
    // CACHE
    // =========================
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("userAds:*");
    await deleteCachePattern("sections:*");

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.changeAdStatus = async (req, res) => {
  try {
    const table_id = Number(req.params.table_id);
    const adId = Number(req.params.adId);

    const { status, reason } = req.body;

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // GET AD
    // =========================
    const ad = await prismaModel.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // =========================
    // AUTH
    // =========================
    const isAdmin =
      req.user?.is_super_admin ||
      req.user?.permissions?.includes("CHANGE_ADS_STATUS");

    const isOwner =
      ad.subuser_id === req.user.id ||
      ad.user_id === req.user.id ||
      ad.admin_id === req.user.id;

    // =========================
    // VALID STATUS
    // =========================
    const allowedStatuses = ["ACTIVE", "REJECTED", "DISABLED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // =========================
    // AUTH RULES
    // =========================
    if (!isAdmin) {
      if (!isOwner) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (status !== "DISABLED") {
        return res.status(403).json({
          message: "You can only disable your own ad",
        });
      }
    }

    // =========================
    // REJECT LOGIC
    // =========================
    let reject_reason;

    if (status === "REJECTED") {
      if (!isAdmin) {
        return res.status(403).json({
          message: "Only admin can reject ads",
        });
      }

      if (!reason) {
        return res.status(400).json({
          message: "Reason required for rejection",
        });
      }

      reject_reason = reason;
    }

    // =========================
    // UPDATE
    // =========================
    const statusChangedAt = new Date();
    const updatedAd = await prismaModel.update({
      where: { id: adId },
      data: {
        status,
        status_changed_at: statusChangedAt,
        ...(status === "ACTIVE" &&
          isAdmin &&
          !ad.admin_id && {
            admin_id: req.user.id,
          }),

        ...(reject_reason && {
          reject_reason,
        }),
      },
    });

    if (status === "ACTIVE" && ad.anonymous_id && isAdmin) {
      await prisma.Anonymous.update({
        where: { id: ad.anonymous_id },
        data: { approved_by_admin_id: req.user.id },
      });
    }

    if (isAdmin && ["ACTIVE", "REJECTED"].includes(status)) {
      const ownerContact = await getAdOwnerContact(ad);

      if (ownerContact?.email) {
        sendAdStatusDecisionEmail({
          to: ownerContact.email,
          adTitle: ad.title,
          status,
          reason: reject_reason,
          changedAt: statusChangedAt,
        }).catch((error) => {
          console.error("Failed to send ad status decision email:", error.message);
        });
      }
    }

    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("userAds:*");
    await deleteCachePattern("sections:*");

    return res.json({
      success: true,
      message: `Ad status updated to ${status}`,
      data: updatedAd,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
exports.assignAdmin = async (req, res) => {
  try {
    const table_id = Number(req.params.table_id);
    const adId = Number(req.params.adId);

    const user = req.user;

    // =========================
    // AUTH
    // =========================
    if (
      !user?.is_super_admin &&
      !user?.permissions?.includes("ASSIGN_RESPONSIBILITY")
    ) {
      return res.status(403).json({
        message: "Access denied: You need ASSIGN_RESPONSIBILITY permission",
      });
    }

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    const { admin_id } = req.body;

    if (admin_id === undefined) {
      return res.status(400).json({ message: "admin_id is required" });
    }

    // =========================
    // VALIDATE ADMIN
    // =========================
    if (admin_id !== null) {
      if (isNaN(admin_id)) {
        return res.status(400).json({
          message: "admin_id must be number or null",
        });
      }

      const adminUser = await prisma.Users.findUnique({
        where: { id: admin_id },
      });

      if (!adminUser || adminUser.user_type !== "ADMIN") {
        return res.status(400).json({ message: "Invalid admin ID" });
      }
    }

    // =========================
    // GET AD
    // =========================
    const ad = await prismaModel.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // =========================
    // UPDATE
    // =========================
    await prismaModel.update({
      where: { id: adId },
      data: {
        admin_id,
      },
    });

    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("userAds:*");
    await deleteCachePattern("sections:*");

    return res.json({
      success: true,
      message:
        admin_id === null
          ? "Admin removed successfully"
          : "Admin assigned successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
exports.getAllAds = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const { page, limit, skip } = pagination(req.query);
    const isAdmin = req.user?.is_super_admin || req.user?.user_type === "ADMIN";
    const isDashboardRequest = req.query.scope === "dashboard";
    const canViewAllStatuses = isAdmin && isDashboardRequest;
    const table_id = req.query.table_id ? Number(req.query.table_id) : null;

    if (req.query.table_id && !table_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid table_id",
      });
    }

    const where = buildAdsWhere(req.query, canViewAllStatuses, {
      includeDynamic: Boolean(table_id),
      skipPriceRange: true,
    });
    const areaMetaWhere = buildAdsWhere(req.query, canViewAllStatuses, {
      includeDynamic: Boolean(table_id),
      skipPriceRange: true,
      skipAreaRange: true,
    });
    const orderBy = getAdsOrderBy(req.query);

    const crypto = require("crypto");

    const hash = crypto
      .createHash("md5")
      .update(JSON.stringify({ query: req.query, where, orderBy }))
      .digest("hex");

    const cacheKey = `ads:list:${userId || "guest"}:${page}:${limit}:${hash}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    if (table_id) {
      const prismaModel = getModel(table_id);

      if (!prismaModel) {
        return res.status(400).json({
          success: false,
          message: "Invalid table_id",
        });
      }

      const [records, areaMetaRecords] = await Promise.all([
        prismaModel.findMany({
          where,
          orderBy,
          include: adIncludeListRelations,
        }),
        prismaModel.findMany({
          where: areaMetaWhere,
          orderBy,
          include: adIncludeListRelations,
        }),
      ]);

      const matchingAds = records.filter((ad) =>
        isWithinNormalizedPriceRange(ad, req.query),
      );
      const areaMetaAds = areaMetaRecords.filter((ad) =>
        isWithinNormalizedPriceRange(ad, req.query),
      );
      const total = matchingAds.length;
      const ads = matchingAds.sort(compareAds(req.query)).slice(skip, skip + limit);
      const data = await enrichAds(ads, userId, "list");

      const response = {
        success: true,
        data,
        meta: buildAdsMeta({
          priceAds: records,
          areaAds: areaMetaAds,
        }),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      await setCache(cacheKey, response, 60);

      return res.json(response);
    }

    const tables = getAvailableAdTables();
    const tableResults = await Promise.all(
      tables.map(async ({ prismaModel }) => {
        const [records, areaMetaRecords, count] = await Promise.all([
          prismaModel.findMany({
            where,
            orderBy,
            include: adIncludeListRelations,
          }),
          prismaModel.findMany({
            where: areaMetaWhere,
            orderBy,
            include: adIncludeListRelations,
          }),
          prismaModel.count({ where }),
        ]);

        return { records, areaMetaRecords, count };
      }),
    );

    const allRecords = tableResults.flatMap((result) => result.records);
    const allAreaMetaRecords = tableResults.flatMap(
      (result) => result.areaMetaRecords,
    );
    const matchingAds = allRecords
      .filter((ad) => isWithinNormalizedPriceRange(ad, req.query));
    const areaMetaAds = allAreaMetaRecords.filter((ad) =>
      isWithinNormalizedPriceRange(ad, req.query),
    );
    const total = matchingAds.length;
    const ads = matchingAds
      .sort(compareAds(req.query))
      .slice(skip, skip + limit);

    const data = await enrichAds(ads, userId, "list");

    const response = {
      success: true,
      data,
      meta: buildAdsMeta({
        priceAds: allRecords,
        areaAds: areaMetaAds,
      }),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, 60);

    return res.json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getAd = async (req, res) => {
  try {
    const table_id = Number(req.params.table_id);
    const adId = Number(req.params.adId);
    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        success: false,
        message: "Invalid table_id",
      });
    }

    const ad = await prismaModel.findUnique({
      where: { id: adId },
      include: adIncludeRelations,
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    const userId = req.user?.id || null;
    const isAdmin = req.user?.is_super_admin || req.user?.user_type === "ADMIN";
    const isDashboardRequest = req.query.scope === "dashboard";
    const isOwner =
      userId &&
      [ad.user_id, ad.subuser_id, ad.admin_id].filter(Boolean).includes(userId);
    const canViewInactiveAd = isOwner || (isAdmin && isDashboardRequest);

    if (ad.status !== "ACTIVE" && !canViewInactiveAd) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    const stats = await trackAdView({
      prismaModel,
      entityId: adId,
      tableId: table_id,
      userId,
      ip: req.ip,
    });

    const enriched = await enrichAds({ ...ad, ...stats }, userId, "detail");

    return res.json(enriched[0]);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getUserAds = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { page, limit, skip } = pagination(req.query);
    const viewerId = req.user?.id || null;
    const isAdmin = req.user?.is_super_admin || req.user?.user_type === "ADMIN";
    const isDashboardRequest = req.query.scope === "dashboard";
    const canViewAllStatuses = viewerId === userId || (isAdmin && isDashboardRequest);
    const table_id = req.query.table_id ? Number(req.query.table_id) : null;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    if (req.query.table_id && !table_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid table_id",
      });
    }

    const profileWhere = {
      OR: [{ subuser_id: userId }, { user_id: userId }, { admin_id: userId }],
    };

    const filtersWhere = buildAdsWhere(req.query, canViewAllStatuses, {
      includeDynamic: Boolean(table_id),
    });

    const where = {
      AND: [
        profileWhere,
        ...(filtersWhere.AND ? filtersWhere.AND : [filtersWhere]).filter(
          (filter) => Object.keys(filter).length,
        ),
      ],
    };

    const orderBy = getAdsOrderBy(req.query);

    const crypto = require("crypto");

    const hash = crypto
      .createHash("md5")
      .update(
        JSON.stringify({
          query: req.query,
          where,
          orderBy,
          canViewAllStatuses,
        }),
      )
      .digest("hex");

    const cacheKey = `userAds:${userId}:${viewerId || "guest"}:${page}:${limit}:${hash}`;

    const cached = await getCache(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    if (table_id) {
      const prismaModel = getModel(table_id);

      if (!prismaModel) {
        return res.status(400).json({
          success: false,
          message: "Invalid table_id",
        });
      }

      const [ads, total] = await Promise.all([
        prismaModel.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: adIncludeListRelations,
        }),
        prismaModel.count({ where }),
      ]);

      const data = await enrichAds(ads, viewerId, "list");

      const response = {
        success: true,
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      await setCache(cacheKey, response, 60);

      return res.json(response);
    }

    const tables = getAvailableAdTables();
    const takePerTable = skip + limit;

    const tableResults = await Promise.all(
      tables.map(async ({ prismaModel }) => {
        const [records, count] = await Promise.all([
          prismaModel.findMany({
            where,
            take: takePerTable,
            orderBy,
            include: adIncludeListRelations,
          }),
          prismaModel.count({ where }),
        ]);

        return { records, count };
      }),
    );

    const total = tableResults.reduce((sum, result) => sum + result.count, 0);
    const ads = tableResults
      .flatMap((result) => result.records)
      .sort(compareAds(req.query))
      .slice(skip, skip + limit);

    const data = await enrichAds(ads, viewerId, "list");

    const response = {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, 60);

    return res.json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getSectionsAds = async (req, res) => {
  try {
    const { type, value } = req.query;
    const typeKey = String(type || "").trim();
    const normalizedType = typeKey.toLowerCase();
    const { page, limit, skip } = pagination(req.query);
    const userId = req.user?.id || null;
    const valueNumber = Number(value);
    const requestedTableId = req.query.table_id ? Number(req.query.table_id) : null;
    const table_id =
      normalizedType === "table" && !requestedTableId
        ? valueNumber
        : requestedTableId;
    const sectionField = sectionFieldByType[typeKey] || sectionFieldByType[normalizedType];
    const sectionValue = Number(value);
    const isGlobalSection = globalSectionTypes.has(normalizedType);
    const needsSpecificTable =
      specificTableSectionTypes.has(typeKey) ||
      specificTableSectionTypes.has(normalizedType);

    if (!typeKey || (!isGlobalSection && (!sectionField || !sectionValue))) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid section params. Allowed types: governorate, gov, city, area, compound, category, subCategory, table, views, featured, favorites",
      });
    }

    if ((req.query.table_id || normalizedType === "table") && !table_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid table_id",
      });
    }

    if (needsSpecificTable && !table_id) {
      return res.status(400).json({
        success: false,
        message: "table_id is required for category and subCategory sections",
      });
    }

    if (
      ["favorites", "favourites", "favoriets"].includes(normalizedType) &&
      !userId
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required for favorites section",
      });
    }

    const cacheKey = `sections:${userId || "guest"}:${JSON.stringify(req.query)}:${page}:${limit}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const where = {
      status: "ACTIVE",
    };

    if (sectionField) {
      where[sectionField] = sectionValue;
    }

    if (normalizedType === "featured" || normalizedType === "futured") {
      where.featured_priority = { gt: 0 };
    }

    const orderBy = getSectionOrderBy(normalizedType, req.query);

    if (["favorites", "favourites", "favoriets"].includes(normalizedType)) {
      const favorites = await prisma.AdFavorite.findMany({
        where: {
          user_id: userId,
          ...(table_id && { table_id }),
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const grouped = favorites.reduce((acc, fav) => {
        if (!acc[fav.table_id]) acc[fav.table_id] = [];
        acc[fav.table_id].push(fav.entity_id);
        return acc;
      }, {});

      let ads = [];

      for (const favTableId in grouped) {
        const prismaModel = getModel(favTableId);
        if (!prismaModel) continue;

        const records = await prismaModel.findMany({
          where: {
            status: "ACTIVE",
            id: {
              in: grouped[favTableId],
            },
          },
          include: adIncludeListRelations,
        });

        ads.push(...records);
      }

      const favoriteOrder = new Map(
        favorites.map((fav, index) => [`${fav.table_id}_${fav.entity_id}`, index]),
      );

      ads = ads
        .sort((a, b) => {
          const aIndex = favoriteOrder.get(`${a.table_id}_${a.id}`) ?? 0;
          const bIndex = favoriteOrder.get(`${b.table_id}_${b.id}`) ?? 0;
          return aIndex - bIndex;
        });

      const total = ads.length;
      const data = await enrichAds(ads.slice(skip, skip + limit), userId, "list");

      const response = {
        success: true,
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      await setCache(cacheKey, response, 60);

      return res.json(response);
    }

    if (table_id) {
      const prismaModel = getModel(table_id);

      if (!prismaModel) {
        return res.status(400).json({
          success: false,
          message: "Invalid table_id",
        });
      }

      const [ads, total] = await Promise.all([
        prismaModel.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: adIncludeListRelations,
        }),
        prismaModel.count({ where }),
      ]);

      const data = await enrichAds(ads, userId, "list");

      const response = {
        success: true,
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      await setCache(cacheKey, response, 60);

      return res.json(response);
    }

    const tables = getAvailableAdTables();
    const takePerTable = skip + limit;

    const tableResults = await Promise.all(
      tables.map(async ({ prismaModel }) => {
        const [records, count] = await Promise.all([
          prismaModel.findMany({
            where,
            take: takePerTable,
            orderBy,
            include: adIncludeListRelations,
          }),
          prismaModel.count({ where }),
        ]);

        return { records, count };
      }),
    );

    const total = tableResults.reduce((sum, result) => sum + result.count, 0);
    const ads = tableResults
      .flatMap((result) => result.records)
      .sort(compareSectionAds(normalizedType, req.query))
      .slice(skip, skip + limit);

    const data = await enrichAds(ads, userId, "list");

    const response = {
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, 60);

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;

    const entity_id = Number(req.params.entity_id);
    const table_id = Number(req.params.table_id);

    // =========================
    // TABLE
    // =========================
    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // CHECK AD EXISTS
    // =========================
    const ad = await prismaModel.findUnique({
      where: { id: entity_id },
    });

    if (!ad) {
      return res.status(404).json({
        message: "Ad not found",
      });
    }

    // =========================
    // CHECK EXISTING FAVORITE
    // =========================
    const existing = await prisma.AdFavorite.findUnique({
      where: {
        entity_id_table_id_user_id: {
          entity_id,
          table_id,
          user_id: userId,
        },
      },
    });

    // =========================
    // TOGGLE
    // =========================
    let updatedAd;

    if (existing) {
      const [, adAfterFavorite] = await prisma.$transaction([
        prisma.AdFavorite.delete({
          where: {
            entity_id_table_id_user_id: {
              entity_id,
              table_id,
              user_id: userId,
            },
          },
        }),

        prismaModel.update({
          where: { id: entity_id },

          data: {
            favorites_count: {
              decrement: 1,
            },
          },
        }),
      ]);

      updatedAd = adAfterFavorite;
    } else {
      const [, adAfterFavorite] = await prisma.$transaction([
        prisma.AdFavorite.create({
          data: {
            entity_id,
            table_id,
            user_id: userId,
          },
        }),

        prismaModel.update({
          where: { id: entity_id },

          data: {
            favorites_count: {
              increment: 1,
            },
          },
        }),
      ]);

      updatedAd = adAfterFavorite;
    }

    // =========================
    // CACHE
    // =========================
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("sections:*");
    await deleteCachePattern(`userAds:${userId}:*`);
    await deleteCachePattern(`favorites:${userId}:*`);

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      success: true,
      isFavorite: !existing,
      favorites_count: updatedAd.favorites_count,
      message: existing ? "Removed from favorites" : "Added to favorites",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.AdFavorite.findMany({
      where: {
        user_id: userId,
      },

      orderBy: {
        created_at: "desc",
      },
    });

    const grouped = {};

    // =========================
    // GROUP BY TABLE
    // =========================
    for (const fav of favorites) {
      if (!grouped[fav.table_id]) {
        grouped[fav.table_id] = [];
      }

      grouped[fav.table_id].push(fav.entity_id);
    }

    let ads = [];

    // =========================
    // FETCH ADS
    // =========================
    for (const table_id in grouped) {
      const prismaModel = getModel(table_id);

      if (!prismaModel) continue;

      const records = await prismaModel.findMany({
        where: {
          id: {
            in: grouped[table_id],
          },
        },

        include: adIncludeListRelations,
      });

      ads.push(...records);
    }

    // =========================
    // ENRICH
    // =========================
    const data = await enrichAds(ads, userId, "list");

    return res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
