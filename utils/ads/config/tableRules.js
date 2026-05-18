//! Common Rules
const commonRentRequired = ["deposit_amount", "rent_frequency", "adult_no_max"];

const commonRentOptional = [
  "min_rent_period",
  "min_rent_period_unit",
  "available_from",
  "available_to",
  "child_no_max",
];

const commonSaleRequired = ["payment_method", "ready_to_move", "furnished"];

const commonSaleOptional = ["down_payment", "installment_years"];

//! Details
const propertyDetails = ["bedrooms", "bathrooms", "level", "area_m2"];


//! Amenities
const propertyAmenities = [
  "am_balcony",
  "am_private_garden",
  "am_kitchen",
  "am_ac",
  "am_heating",
  "am_elevator",
  "am_gym",
];
const vacationAmenities = ["am_seeview", "am_pool"];

const buildingsLandsRequired = ["area_m2", "land_type", "usage_type"];
const buildingsLandsOptional = ["floors", "*"];

module.exports = {
  // ================= VACATION =================
  // 1 - Vacation Sale
  1: {
    required: [...propertyDetails, ...commonSaleRequired],

    allowed: [
      ...commonSaleOptional,
      ...propertyAmenities,
      ...vacationAmenities,
    ],
  },

  // 2 - Vacation Rent
  2: {
    required: [...commonRentRequired, ...propertyDetails],

    allowed: [
      ...commonRentOptional,
      ...propertyAmenities,
      ...vacationAmenities,
    ],
  },

  // ================= APARTMENT =================

  // 3 - Apartment Sale
  3: {
    required: [...propertyDetails, ...commonSaleRequired],

    allowed: [...commonSaleOptional, ...propertyAmenities],
  },

  // 4 - Apartment Rent
  4: {
    required: [...commonRentRequired, ...propertyDetails],

    allowed: [...commonRentOptional, ...propertyAmenities],
  },

  // ================= VILLA =================

  // 5 - Villa Sale
  5: {
    required: [...propertyDetails, ...commonSaleRequired],

    allowed: [...commonSaleOptional, ...propertyAmenities],
  },

  // 6 - Villa Rent
  6: {
    required: [...commonRentRequired, ...propertyDetails],

    allowed: [...commonRentOptional, ...propertyAmenities],
  },

  // ================= COMMERCIAL =================

  // 7 - Commercial Sale
  7: {
    required: [...commonSaleRequired.filter((item) => item !== "furnished")],

    allowed: [...commonSaleOptional, "area_m2", ...propertyAmenities],
  },

  // 8 - Commercial Rent
  8: {
    required: [...commonRentRequired],

    allowed: [...commonRentOptional, "area_m2", ...propertyAmenities],
  },

  // ================= BUILDINGS & LANDS =================

  // 9 - Buildings & Lands Sale
  9: {
    required: [...buildingsLandsRequired, "payment_method"],

    allowed: [...commonSaleOptional, ...buildingsLandsOptional],
  },

  // 10 - Buildings & Lands Rent
  10: {
    required: [
      ...commonRentRequired.filter((item) => item !== "adult_no_max"),
      ...buildingsLandsRequired,
    ],

    allowed: [...commonRentOptional, "adult_no_max", ...buildingsLandsOptional],
  },
};