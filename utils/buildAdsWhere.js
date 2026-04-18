const buildAdsWhere = (query, isAdmin) => {
  const {
    search,
    category,
    subCategory,
    country_id,
    governorate_id,
    city_id,
    area_id,
    compound_id,
    min_rent_amount,
    max_rent_amount,
    rent_currency,
    rent_frequency,
    min_deposit_amount,
    max_deposit_amount,
    min_bedrooms,
    max_bedrooms,
    min_bathrooms,
    max_bathrooms,
    min_level,
    max_level,
    am_pool,
    am_balcony,
    am_private_garden,
    am_kitchen,
    am_ac,
    am_heating,
    am_elevator,
    am_gym,
    min_available_from,
    max_available_to,
    status,
  } = query;

  const filters = [];

  // status logic centralized
  if (!isAdmin) {
    filters.push({ status: "ACTIVE" });
  } else {
    if (status?.trim()) {
      filters.push({ status: status.trim() });
    } else {
      filters.push({ NOT: { status: "PENDING" } });
    }
  }

  // search
  if (search) {
    filters.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: search.split(" ") } },
      ],
    });
  }

  // numeric filters helper style
  const range = (field, min, max) => {
    if (min) filters.push({ [field]: { gte: Number(min) } });
    if (max) filters.push({ [field]: { lte: Number(max) } });
  };

  range("rent_amount", min_rent_amount, max_rent_amount);
  range("deposit_amount", min_deposit_amount, max_deposit_amount);
  range("bedrooms", min_bedrooms, max_bedrooms);
  range("bathrooms", min_bathrooms, max_bathrooms);
  range("level", min_level, max_level);

  // relations
  if (category) filters.push({ categoryId: Number(category) });
  if (subCategory) filters.push({ subCategoryId: Number(subCategory) });
  if (country_id) filters.push({ country_id: Number(country_id) });
  if (governorate_id) filters.push({ governorate_id: Number(governorate_id) });
  if (city_id) filters.push({ city_id: Number(city_id) });
  if (area_id) filters.push({ area_id: Number(area_id) });
  if (compound_id) filters.push({ compound_id: Number(compound_id) });

  // booleans helper
  const bool = (key, value) => {
    if (value !== undefined) {
      filters.push({ [key]: value === "true" });
    }
  };

  bool("am_pool", am_pool);
  bool("am_balcony", am_balcony);
  bool("am_private_garden", am_private_garden);
  bool("am_kitchen", am_kitchen);
  bool("am_ac", am_ac);
  bool("am_heating", am_heating);
  bool("am_elevator", am_elevator);
  bool("am_gym", am_gym);

  if (min_available_from) {
    filters.push({ available_from: { gte: new Date(min_available_from) } });
  }

  if (max_available_to) {
    filters.push({ available_to: { lte: new Date(max_available_to) } });
  }

  return { AND: filters };
};

module.exports = buildAdsWhere;