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


const apartmentAmenities = [
  "am_balcony",
  "am_private_garden",
  "am_private_roof",
  "am_kitchen",
  "am_ac",
  "am_central_ac",
  "am_heating",
  "am_elevator",
  "am_security",
  "am_parking",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_gym",
  "am_pool",
];

const vacationAmenities = [
  "am_balcony",
  "am_private_garden",
  "am_private_roof",
  "am_kitchen",
  "am_ac",
  "am_central_ac",
  "am_heating",
  "am_elevator",
  "am_security",
  "am_parking",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_storage_room",
  "am_laundry_room",
  "am_furnished",
  "am_gym",
  "am_pool",
  "am_seeview",
  "am_lakeview",
  "am_beach_access",
  "am_clubhouse",
  "am_kids_area",
  "am_bbq_area",
];

const villaAmenities = [
  "am_balcony",
  "am_private_garden",
  "am_private_roof",
  "am_kitchen",
  "am_ac",
  "am_central_ac",
  "am_heating",
  "am_security",
  "am_parking",
  "am_private_parking",
  "am_driver_room",
  "am_maid_room",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_gym",
  "am_pool",
  "am_jacuzzi",
  "am_bbq_area",
];

const commercialAmenities = [
  "am_ac",
  "am_central_ac",
  "am_heating",
  "am_elevator",
  "am_security",
  "am_parking",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_meetings_room",
  "am_reception",
  "am_fire_system",
  "am_backup_generator",
  "am_loading_area",
  "am_storage_room",
];

const landBuildingAmenities = [
  "am_security",
  "am_parking",
  "am_gas",
  "am_water",
  "am_electricity",
  "am_corner_plot",
  "am_main_street",
  "am_fenced",
  "am_paved_road",
  "am_building_permit",
  "am_elevator",
  "am_fire_system",
  "am_backup_generator",
];

const buildingsLandsRequired = ["area_m2", "type"];
const buildingsLandsOptional = ["floors", "land_type", "building_type", "building_condition"];

module.exports = {
  // ================= VACATION =================
  // 1 - Vacation Sale
  1: {
    required: [...propertyDetails, ...commonSaleRequired],

    allowed: [
      ...commonSaleOptional,
      ...vacationAmenities,
    ],
  },

  // 2 - Vacation Rent
  2: {
    required: [...commonRentRequired, ...propertyDetails],

    allowed: [
      ...commonRentOptional,
      ...vacationAmenities,
    ],
  },

  // ================= APARTMENT =================

  // 3 - Apartment Sale
  3: {
    required: [...propertyDetails, ...commonSaleRequired],

    allowed: [...commonSaleOptional, ...apartmentAmenities],
  },

  // 4 - Apartment Rent
  4: {
    required: [...commonRentRequired, ...propertyDetails],

    allowed: [...commonRentOptional, ...apartmentAmenities],
  },

  // ================= VILLA =================

  // 5 - Villa Sale
  5: {
    required: [...propertyDetails, ...commonSaleRequired],

    allowed: [...commonSaleOptional, ...villaAmenities],
  },

  // 6 - Villa Rent
  6: {
    required: [...commonRentRequired, ...propertyDetails],

    allowed: [...commonRentOptional, ...villaAmenities],
  },

  // ================= COMMERCIAL =================

  // 7 - Commercial Sale
  7: {
    required: [...commonSaleRequired.filter((item) => item !== "furnished")],

    allowed: [...commonSaleOptional, "area_m2", ...commercialAmenities],
  },

  // 8 - Commercial Rent
  8: {
    required: [...commonRentRequired.filter((item) => item !== "adult_no_max")],

    allowed: [...commonRentOptional, "area_m2", ...commercialAmenities],
  },

  // ================= BUILDINGS & LANDS =================

  // 9 - Buildings & Lands Sale
  9: {
    required: [...buildingsLandsRequired, "payment_method"],

    allowed: [...commonSaleOptional, ...landBuildingAmenities, ...buildingsLandsOptional],
  },

  // 10 - Buildings & Lands Rent
  10: {
    required: [
      ...commonRentRequired.filter((item) => item !== "adult_no_max"),
      ...buildingsLandsRequired,
    ],

    allowed: [
      ...commonRentOptional,
      ...landBuildingAmenities,
      ...buildingsLandsOptional,
    ],
  },
};
