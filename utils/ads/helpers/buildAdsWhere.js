module.exports = (query, isAdmin) => {
  const where = {};

  if (query.status) where.status = query.status;
  else if (!isAdmin) where.status = "ACTIVE";

  if (query.country_id) where.country_id = Number(query.country_id);
  if (query.city_id) where.city_id = Number(query.city_id);
  if (query.governorate_id) where.governorate_id = Number(query.governorate_id);
  if (query.area_id) where.area_id = Number(query.area_id);
  if (query.compound_id) where.compound_id = Number(query.compound_id);

  if (query.categoryId) where.categoryId = Number(query.categoryId);

  // price range
  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = Number(query.minPrice);
    if (query.maxPrice) where.price.lte = Number(query.maxPrice);
  }

  // table filter (IMPORTANT)
  if (query.table_id) {
    where.table_id = Number(query.table_id);
  }

  return where;
};
