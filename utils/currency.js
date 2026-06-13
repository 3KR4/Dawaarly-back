const DEFAULT_RATES_TO_EGP = {
  EGP: 1,
  USD: 50,
  EUR: 55,
  SAR: 13.3,
  AED: 13.6,
};

const getRateToEgp = (currency) => {
  const key = String(currency || "EGP").toUpperCase();
  const envKey = `RATE_${key}_TO_EGP`;
  const envRate = Number(process.env[envKey]);

  return Number.isFinite(envRate) && envRate > 0
    ? envRate
    : DEFAULT_RATES_TO_EGP[key] || 1;
};

const toEgp = (price, currency) => {
  const numericPrice = Number(price || 0);
  return numericPrice * getRateToEgp(currency);
};

module.exports = {
  getRateToEgp,
  toEgp,
};
