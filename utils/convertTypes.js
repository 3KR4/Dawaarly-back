function parseAdData(data) {
  const intFields = [
    "country_id", "governorate_id", "city_id", "area_id", "compound_id",
    "subcategory_star", "bedrooms", "bathrooms", "level",
    "adult_no_max", "child_no_max", "min_rent_period"
  ];
  const decimalFields = ["rent_amount", "deposit_amount"];

  const parsed = { ...data };

  intFields.forEach(f => {
    if (parsed[f] !== undefined) parsed[f] = parsed[f] === "" ? null : Number(parsed[f]);
  });

  decimalFields.forEach(f => {
    if (parsed[f] !== undefined) parsed[f] = parsed[f] === "" ? null : Number(parsed[f]);
  });

  return parsed;
}

module.exports = { parseAdData };