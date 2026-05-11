module.exports = (images) => {
  if (!images?.length) return null;

  const cover = images.find((i) => i.is_cover);

  return cover || images[0];
};
