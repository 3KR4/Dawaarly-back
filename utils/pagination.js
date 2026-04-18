function pagination(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}

function buildPagination(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = {
  pagination,
  buildPagination,
};