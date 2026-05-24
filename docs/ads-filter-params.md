# Ads filter params

This document covers the query params for the endpoints that return ads.

## Returned department

Every returned ad now includes:

```json
"department": {
  "id": 2,
  "name_ar": "بيوت مصايف للإيجار",
  "name_en": "Vacation Homes for Rent"
}
```

`department.id` is the old `table_id` value.

List responses also include:

```json
"meta": {
  "max_price": 5000000,
  "price_currency": "EGP"
}
```

`max_price` is calculated after non-price filters and normalized to EGP, so the frontend can use it as the price slider maximum.

## Departments

| id | slug | name_en | name_ar |
| --- | --- | --- | --- |
| 1 | vacation-sale | Vacation Homes for Sale | بيوت مصايف للبيع |
| 2 | vacation-rent | Vacation Homes for Rent | بيوت مصايف للإيجار |
| 3 | apartment-sale | Apartments for Sale | شقق للبيع |
| 4 | apartment-rent | Apartments for Rent | شقق للإيجار |
| 5 | villa-sale | Villas for Sale | فلل للبيع |
| 6 | villa-rent | Villas for Rent | فلل للإيجار |
| 7 | commercial-sale | Commercial for Sale | تجاري للبيع |
| 8 | commercial-rent | Commercial for Rent | تجاري للإيجار |
| 9 | buildings-lands-sale | Buildings & Lands for Sale | مباني وأراضي للبيع |
| 10 | buildings-lands-rent | Buildings & Lands for Rent | مباني وأراضي للإيجار |

## GET /ads/all

Returns ads from all departments. If `table_id` is sent, the endpoint filters one department and enables the dynamic filters for that department.

Common params:

| Param | Type | Notes |
| --- | --- | --- |
| page | number | Pagination page. |
| limit | number | Pagination size. |
| table_id | number | Department id. Required if you want dynamic filters like `bedrooms` or amenities. |
| search | string | Searches in `title` and `description`. |
| category or categoryId | number | Category id. |
| subCategory or subCategoryId | number | Sub-category id. |
| country_id | number | Country id. |
| governorate_id | number | Governorate id. |
| city_id | number | City id. |
| area_id | number | Area id. |
| compound_id | number | Compound id. |
| currency | enum | `USD`, `EUR`, `EGP`, `SAR`, `AED`. |
| min_price | number | Minimum price in normalized EGP value. |
| max_price | number | Maximum price in normalized EGP value. |
| is_verified or is_verified_only | boolean | Use `true` to return verified ads only. |
| sort or sort_by | string | `top_views`, `views`, `views_desc`, `favorites`, `favorites_desc`, `date`, `date_asc`, `price_asc`, `price_desc`. Default is newest. Price sort uses normalized EGP value. |
| order | string | `asc` works with `sort=date`. Otherwise default is `desc`. |
| status | enum | Admin only. `PENDING`, `ACTIVE`, `REJECTED`, `DISABLED`. Non-admin users always get `ACTIVE` only. |

Dynamic params when `table_id` is sent:

| Param | Type | Departments |
| --- | --- | --- |
| rent_frequency | enum | Rent departments: 2, 4, 6, 8, 10. Values: `DAY`, `WEEK`, `MONTH`. |
| min_area_m2 / max_area_m2 | number | Departments that have `area_m2`. |
| ready_to_move | boolean | Sale departments that have this field. |
| furnished | boolean | Sale departments that have this field. |
| payment_method | enum | Sale departments. |
| type | enum | Buildings & lands departments. Values include `BUILDING`, `LAND`. |
| land_type | enum | Buildings & lands departments when `type=LAND`. |
| building_type | enum | Buildings & lands departments when `type=BUILDING`. |
| building_condition | enum | Buildings & lands departments when `type=BUILDING`. |
| bedrooms | number | 1, 2, 3, 4, 5, 6. |
| bathrooms | number | 1, 2, 3, 4, 5, 6. |
| level | number | 1, 2, 3, 4, 5, 6. |
| am_balcony | boolean | 1, 2, 3, 4, 5, 6. |
| am_private_garden | boolean | 1, 2, 3, 4, 5, 6. |
| am_private_roof | boolean | 1, 2, 3, 4, 5, 6. |
| am_kitchen | boolean | 1, 2, 3, 4, 5, 6. |
| am_ac | boolean | 1, 2, 3, 4, 5, 6, 7, 8. |
| am_central_ac | boolean | 1, 2, 3, 4, 5, 6, 7, 8. |
| am_heating | boolean | 1, 2, 3, 4, 5, 6, 7, 8. |
| am_elevator | boolean | 1, 2, 3, 4, 7, 8, 9, 10. |
| am_security | boolean | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. |
| am_parking | boolean | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. |
| am_gas | boolean | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. |
| am_water | boolean | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. |
| am_electricity | boolean | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. |
| am_storage_room | boolean | 1, 2, 7, 8. |
| am_laundry_room | boolean | 1, 2. |
| am_furnished | boolean | 1, 2. |
| am_gym | boolean | 1, 2, 3, 4, 5, 6. |
| am_pool | boolean | 1, 2, 3, 4, 5, 6. |
| am_seeview | boolean | 1, 2. |
| am_lakeview | boolean | 1, 2. |
| am_beach_access | boolean | 1, 2. |
| am_clubhouse | boolean | 1, 2. |
| am_kids_area | boolean | 1, 2. |
| am_bbq_area | boolean | 1, 2, 5, 6. |
| am_private_parking | boolean | 5, 6. |
| am_driver_room | boolean | 5, 6. |
| am_maid_room | boolean | 5, 6. |
| am_jacuzzi | boolean | 5, 6. |
| am_meetings_room | boolean | 7, 8. |
| am_reception | boolean | 7, 8. |
| am_fire_system | boolean | 7, 8, 9, 10. |
| am_backup_generator | boolean | 7, 8, 9, 10. |
| am_loading_area | boolean | 7, 8. |
| am_corner_plot | boolean | 9, 10. |
| am_main_street | boolean | 9, 10. |
| am_fenced | boolean | 9, 10. |
| am_paved_road | boolean | 9, 10. |
| am_building_permit | boolean | 9, 10. |

Example:

```http
GET /ads/all?table_id=4&city_id=1&bedrooms=2&min_price=5000&max_price=15000&sort=date&order=desc&page=1&limit=20
```

## GET /ads/:table_id/:adId

Returns one ad by path params.

| Param | Where | Type | Notes |
| --- | --- | --- | --- |
| table_id | path | number | Department id. |
| adId | path | number | Ad id inside that department table. |

No filter query params are used here.

## GET /ads/profile/:userId

Returns ads for a user/admin profile across all departments. If `table_id` is sent, the endpoint filters one department and enables the dynamic filters for that department.

| Param | Type | Notes |
| --- | --- | --- |
| page | number | Pagination page. |
| limit | number | Pagination size. |
| table_id | number | Optional department id. Required if you want dynamic filters like `bedrooms` or amenities. |
| sort or sort_by | string | `top_views`, `views`, `views_desc`, `favorites`, `favorites_desc`, `date`, `date_asc`, `price_asc`, `price_desc`. Default is newest. Price sort uses normalized EGP value. |
| order | string | `asc` works with `sort=date`. Otherwise default is `desc`. |
| status | enum | Owner/admin only. `PENDING`, `ACTIVE`, `REJECTED`, `DISABLED`. Public profile visitors always get `ACTIVE` only. |

Common filters from `GET /ads/all` can also be used here, such as location, category, search, currency, and price range.

Path param:

| Param | Type | Notes |
| --- | --- | --- |
| userId | number | Returns ads where `user_id` or `admin_id` equals this id. |

## GET /ads/sections

Returns active ads for a section.

Location sections work over all departments by default:

- `governorate` / `gov`
- `city`
- `area`
- `compound` / `compounds`

Category sections are department-specific and require `table_id`:

- `category`
- `subCategory` / `sub_category` / `subcategory`

| Param | Type | Notes |
| --- | --- | --- |
| type | enum | One of `governorate`, `gov`, `city`, `area`, `compound`, `compounds`, `category`, `subCategory`, `sub_category`, `subcategory`. |
| value | number | The id used by `type`. |
| table_id | number | Optional for location sections to restrict one department. Required for category and subCategory sections. |
| page | number | Pagination page. |
| limit | number | Pagination size. |
| sort or sort_by | string | `top_views`, `views`, `views_desc`, `favorites`, `favorites_desc`, `date`, `date_asc`, `price_asc`, `price_desc`. Default is newest. Price sort uses normalized EGP value. |
| order | string | `asc` works with `sort=date`. Otherwise default is `desc`. |

Examples:

```http
GET /ads/sections?type=city&value=1&page=1&limit=10
GET /ads/sections?type=governorate&value=1
GET /ads/sections?type=compound&value=5&table_id=4
GET /ads/sections?type=category&value=12&table_id=4
GET /ads/sections?type=subCategory&value=2&table_id=1
```

## GET /favorites

Returns the authenticated user's favorite ads.

This endpoint does not currently support filter query params.
