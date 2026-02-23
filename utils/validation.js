// utils/validation.js

/**
 * Validate available_from and available_to dates
 * @param {string | Date} from
 * @param {string | Date} to
 * @returns {boolean}
 */
function validateAdDates(from, to) {
  if (!from || !to) return false;
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return false;
  if (fromDate > toDate) return false; // from must be before to

  return true;
}

/**
 * Validate min rent period and unit
 * @param {number} period
 * @param {string} unit
 * @returns {boolean}
 */
function validateRentPeriod(period, unit) {
  if (!period || period <= 0) return false;

  const validUnits = ["DAY", "WEEK", "MONTH"];
  if (!unit || !validUnits.includes(unit.toUpperCase())) return false;

  return true;
}

/**
 * Validate booking dates (before admin approval)
 * @param {Date} from
 * @param {Date} to
 * @returns {boolean}
 */
function validateBookingDates(from, to) {
  return validateAdDates(from, to);
}

/**
 * Optional: Validate numeric fields like bedrooms, bathrooms
 */
function validateNumberField(value, min = 0, max = 100) {
  if (typeof value !== "number") return false;
  return value >= min && value <= max;
}

module.exports = {
  validateAdDates,
  validateRentPeriod,
  validateBookingDates,
  validateNumberField,
};
