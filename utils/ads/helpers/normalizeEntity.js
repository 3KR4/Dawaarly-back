module.exports = (ad) => {
  return {
    id: ad.id,
    table_id: ad.table_id,
    title: ad.title,
    description: ad.description,
    price: ad.price,
    currency: ad.currency,
    status: ad.status,
    views_count: ad.views_count,
    favorites_count: ad.favorites_count,
    reach_count: ad.reach_count,
    city_id: ad.city_id,
    country_id: ad.country_id,
    categoryId: ad.categoryId,
    created_at: ad.created_at,
  };
};
