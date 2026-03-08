const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.countries.createMany({
    data: [{ id: 1, name_ar: "مصر", name_en: "Egypt" }],
    skipDuplicates: true,
  });
  await prisma.governorates.createMany({
    data: [
      { id: 1, name_ar: "القاهرة", name_en: "Cairo", country_id: 1 },
      { id: 2, name_ar: "الجيزة", name_en: "Giza", country_id: 1 },
      { id: 3, name_ar: "الإسكندرية", name_en: "Alexandria", country_id: 1 },
      { id: 4, name_ar: "الدقهلية", name_en: "Dakahlia", country_id: 1 },
      { id: 5, name_ar: "البحر الأحمر", name_en: "Red Sea", country_id: 1 },
      { id: 6, name_ar: "البحيرة", name_en: "Beheira", country_id: 1 },
      { id: 7, name_ar: "الفيوم", name_en: "Fayoum", country_id: 1 },
      { id: 8, name_ar: "الغربية", name_en: "Gharbiya", country_id: 1 },
      { id: 9, name_ar: "الإسماعيلية", name_en: "Ismailia", country_id: 1 },
      { id: 10, name_ar: "المنوفية", name_en: "Menofia", country_id: 1 },
      { id: 11, name_ar: "المنيا", name_en: "Minya", country_id: 1 },
      { id: 12, name_ar: "القليوبية", name_en: "Qaliubiya", country_id: 1 },
      {
        id: 13,
        name_ar: "الوادي الجديد",
        name_en: "New Valley",
        country_id: 1,
      },
      { id: 14, name_ar: "السويس", name_en: "Suez", country_id: 1 },
      { id: 15, name_ar: "أسوان", name_en: "Aswan", country_id: 1 },
      { id: 16, name_ar: "أسيوط", name_en: "Assiut", country_id: 1 },
      { id: 17, name_ar: "بني سويف", name_en: "Beni Suef", country_id: 1 },
      { id: 18, name_ar: "بورسعيد", name_en: "Port Said", country_id: 1 },
      { id: 19, name_ar: "دمياط", name_en: "Damietta", country_id: 1 },
      { id: 20, name_ar: "الشرقية", name_en: "Sharkia", country_id: 1 },
      { id: 21, name_ar: "جنوب سيناء", name_en: "South Sinai", country_id: 1 },
      {
        id: 22,
        name_ar: "كفر الشيخ",
        name_en: "Kafr Al Sheikh",
        country_id: 1,
      },
      { id: 23, name_ar: "مطروح", name_en: "Matrouh", country_id: 1 },
      { id: 24, name_ar: "الأقصر", name_en: "Luxor", country_id: 1 },
      { id: 25, name_ar: "قنا", name_en: "Qena", country_id: 1 },
      { id: 26, name_ar: "شمال سيناء", name_en: "North Sinai", country_id: 1 },
      { id: 27, name_ar: "سوهاج", name_en: "Sohag", country_id: 1 },
    ],
    skipDuplicates: true,
  });
  await prisma.cities.createMany({
    data: [
      { id: 1, governorate_id: 1, name_ar: "15 مايو", name_en: "15 May" },
      {
        id: 2,
        governorate_id: 1,
        name_ar: "الازبكية",
        name_en: "Al Azbakeyah",
      },
      { id: 3, governorate_id: 1, name_ar: "البساتين", name_en: "Al Basatin" },
      { id: 4, governorate_id: 1, name_ar: "التبين", name_en: "Tebin" },
      { id: 5, governorate_id: 1, name_ar: "الخليفة", name_en: "El-Khalifa" },
      { id: 6, governorate_id: 1, name_ar: "الدراسة", name_en: "El darrasa" },
      {
        id: 7,
        governorate_id: 1,
        name_ar: "الدرب الاحمر",
        name_en: "Aldarb Alahmar",
      },
      {
        id: 8,
        governorate_id: 1,
        name_ar: "الزاوية الحمراء",
        name_en: "Zawya al-Hamra",
      },
      { id: 9, governorate_id: 1, name_ar: "الزيتون", name_en: "El-Zaytoun" },
      { id: 10, governorate_id: 1, name_ar: "الساحل", name_en: "Sahel" },
      { id: 11, governorate_id: 1, name_ar: "السلام", name_en: "El Salam" },
      {
        id: 12,
        governorate_id: 1,
        name_ar: "السيدة زينب",
        name_en: "Sayeda Zeinab",
      },
      {
        id: 13,
        governorate_id: 1,
        name_ar: "الشرابية",
        name_en: "El Sharabeya",
      },
      {
        id: 14,
        governorate_id: 1,
        name_ar: "مدينة الشروق",
        name_en: "Shorouk",
      },
      { id: 15, governorate_id: 1, name_ar: "الظاهر", name_en: "El Daher" },
      { id: 16, governorate_id: 1, name_ar: "العتبة", name_en: "Ataba" },
      {
        id: 17,
        governorate_id: 1,
        name_ar: "القاهرة الجديدة",
        name_en: "New Cairo",
      },
      { id: 18, governorate_id: 1, name_ar: "المرج", name_en: "El Marg" },
      {
        id: 19,
        governorate_id: 1,
        name_ar: "عزبة النخل",
        name_en: "Ezbet el Nakhl",
      },
      { id: 20, governorate_id: 1, name_ar: "المطرية", name_en: "Matareya" },
      { id: 21, governorate_id: 1, name_ar: "المعادى", name_en: "Maadi" },
      { id: 22, governorate_id: 1, name_ar: "المعصرة", name_en: "Maasara" },
      { id: 23, governorate_id: 1, name_ar: "المقطم", name_en: "Mokattam" },
      { id: 24, governorate_id: 1, name_ar: "المنيل", name_en: "Manyal" },
      { id: 25, governorate_id: 1, name_ar: "الموسكى", name_en: "Mosky" },
      { id: 26, governorate_id: 1, name_ar: "النزهة", name_en: "Nozha" },
      { id: 27, governorate_id: 1, name_ar: "الوايلى", name_en: "Waily" },
      {
        id: 28,
        governorate_id: 1,
        name_ar: "باب الشعرية",
        name_en: "Bab al-Shereia",
      },
      { id: 29, governorate_id: 1, name_ar: "بولاق", name_en: "Bolaq" },
      {
        id: 30,
        governorate_id: 1,
        name_ar: "جاردن سيتى",
        name_en: "Garden City",
      },
      {
        id: 31,
        governorate_id: 1,
        name_ar: "حدائق القبة",
        name_en: "Hadayek El-Kobba",
      },
      { id: 32, governorate_id: 1, name_ar: "حلوان", name_en: "Helwan" },
      {
        id: 33,
        governorate_id: 1,
        name_ar: "دار السلام",
        name_en: "Dar Al Salam",
      },
      { id: 34, governorate_id: 1, name_ar: "شبرا", name_en: "Shubra" },
      { id: 35, governorate_id: 1, name_ar: "طره", name_en: "Tura" },
      { id: 36, governorate_id: 1, name_ar: "عابدين", name_en: "Abdeen" },
      { id: 37, governorate_id: 1, name_ar: "عباسية", name_en: "Abaseya" },
      { id: 38, governorate_id: 1, name_ar: "عين شمس", name_en: "Ain Shams" },
      { id: 39, governorate_id: 1, name_ar: "مدينة نصر", name_en: "Nasr City" },
      {
        id: 40,
        governorate_id: 1,
        name_ar: "مصر الجديدة",
        name_en: "New Heliopolis",
      },
      {
        id: 41,
        governorate_id: 1,
        name_ar: "مصر القديمة",
        name_en: "Masr Al Qadima",
      },
      {
        id: 42,
        governorate_id: 1,
        name_ar: "منشية ناصر",
        name_en: "Mansheya Nasir",
      },
      { id: 43, governorate_id: 1, name_ar: "مدينة بدر", name_en: "Badr City" },
      {
        id: 44,
        governorate_id: 1,
        name_ar: "مدينة العبور",
        name_en: "Obour City",
      },
      {
        id: 45,
        governorate_id: 1,
        name_ar: "وسط البلد",
        name_en: "Cairo Downtown",
      },
      { id: 46, governorate_id: 1, name_ar: "الزمالك", name_en: "Zamalek" },
      {
        id: 47,
        governorate_id: 1,
        name_ar: "قصر النيل",
        name_en: "Kasr El Nile",
      },
      { id: 48, governorate_id: 1, name_ar: "الرحاب", name_en: "Rehab" },
      { id: 49, governorate_id: 1, name_ar: "القطامية", name_en: "Katameya" },
      { id: 50, governorate_id: 1, name_ar: "مدينتي", name_en: "Madinty" },
      {
        id: 51,
        governorate_id: 1,
        name_ar: "روض الفرج",
        name_en: "Rod Alfarag",
      },
      { id: 52, governorate_id: 1, name_ar: "شيراتون", name_en: "Sheraton" },
      {
        id: 53,
        governorate_id: 1,
        name_ar: "الجمالية",
        name_en: "El-Gamaleya",
      },
      {
        id: 54,
        governorate_id: 1,
        name_ar: "العاشر من رمضان",
        name_en: "10th of Ramadan City",
      },
      {
        id: 55,
        governorate_id: 1,
        name_ar: "الحلمية",
        name_en: "Helmeyat Alzaytoun",
      },
      {
        id: 56,
        governorate_id: 1,
        name_ar: "النزهة الجديدة",
        name_en: "New Nozha",
      },
      {
        id: 57,
        governorate_id: 1,
        name_ar: "العاصمة الإدارية",
        name_en: "Capital New",
      },
      { id: 58, governorate_id: 2, name_ar: "الجيزة", name_en: "Giza" },
      {
        id: 59,
        governorate_id: 2,
        name_ar: "السادس من أكتوبر",
        name_en: "Sixth of October",
      },
      {
        id: 60,
        governorate_id: 2,
        name_ar: "الشيخ زايد",
        name_en: "Cheikh Zayed",
      },
      {
        id: 61,
        governorate_id: 2,
        name_ar: "الحوامدية",
        name_en: "Hawamdiyah",
      },
      {
        id: 62,
        governorate_id: 2,
        name_ar: "البدرشين",
        name_en: "Al Badrasheen",
      },
      { id: 63, governorate_id: 2, name_ar: "الصف", name_en: "Saf" },
      { id: 64, governorate_id: 2, name_ar: "أطفيح", name_en: "Atfih" },
      { id: 65, governorate_id: 2, name_ar: "العياط", name_en: "Al Ayat" },
      { id: 66, governorate_id: 2, name_ar: "الباويطي", name_en: "Al-Bawaiti" },
      {
        id: 67,
        governorate_id: 2,
        name_ar: "منشأة القناطر",
        name_en: "ManshiyetAl Qanater",
      },
      { id: 68, governorate_id: 2, name_ar: "أوسيم", name_en: "Oaseem" },
      { id: 69, governorate_id: 2, name_ar: "كرداسة", name_en: "Kerdasa" },
      {
        id: 70,
        governorate_id: 2,
        name_ar: "أبو النمرس",
        name_en: "Abu Nomros",
      },
      {
        id: 71,
        governorate_id: 2,
        name_ar: "كفر غطاطي",
        name_en: "Kafr Ghati",
      },
      {
        id: 72,
        governorate_id: 2,
        name_ar: "منشأة البكاري",
        name_en: "Manshiyet Al Bakari",
      },
      { id: 73, governorate_id: 2, name_ar: "الدقى", name_en: "Dokki" },
      { id: 74, governorate_id: 2, name_ar: "العجوزة", name_en: "Agouza" },
      { id: 75, governorate_id: 2, name_ar: "الهرم", name_en: "Haram" },
      { id: 76, governorate_id: 2, name_ar: "الوراق", name_en: "Warraq" },
      { id: 77, governorate_id: 2, name_ar: "امبابة", name_en: "Imbaba" },
      {
        id: 78,
        governorate_id: 2,
        name_ar: "بولاق الدكرور",
        name_en: "Boulaq Dakrour",
      },
      {
        id: 79,
        governorate_id: 2,
        name_ar: "الواحات البحرية",
        name_en: "Al Wahat Al Baharia",
      },
      { id: 80, governorate_id: 2, name_ar: "العمرانية", name_en: "Omraneya" },
      { id: 81, governorate_id: 2, name_ar: "المنيب", name_en: "Moneeb" },
      {
        id: 82,
        governorate_id: 2,
        name_ar: "بين السرايات",
        name_en: "Bin Alsarayat",
      },
      { id: 83, governorate_id: 2, name_ar: "الكيت كات", name_en: "Kit Kat" },
      {
        id: 84,
        governorate_id: 2,
        name_ar: "المهندسين",
        name_en: "Mohandessin",
      },
      { id: 85, governorate_id: 2, name_ar: "فيصل", name_en: "Faisal" },
      { id: 86, governorate_id: 2, name_ar: "أبو رواش", name_en: "Abu Rawash" },
      {
        id: 87,
        governorate_id: 2,
        name_ar: "حدائق الأهرام",
        name_en: "Hadayek Alahram",
      },
      { id: 88, governorate_id: 2, name_ar: "الحرانية", name_en: "Haraneya" },
      {
        id: 89,
        governorate_id: 2,
        name_ar: "حدائق اكتوبر",
        name_en: "Hadayek October",
      },
      {
        id: 90,
        governorate_id: 2,
        name_ar: "صفط اللبن",
        name_en: "Saft Allaban",
      },
      {
        id: 91,
        governorate_id: 2,
        name_ar: "القرية الذكية",
        name_en: "Smart Village",
      },
      {
        id: 92,
        governorate_id: 2,
        name_ar: "ارض اللواء",
        name_en: "Ard Ellwaa",
      },
      { id: 93, governorate_id: 3, name_ar: "ابو قير", name_en: "Abu Qir" },
      {
        id: 94,
        governorate_id: 3,
        name_ar: "الابراهيمية",
        name_en: "Al Ibrahimeyah",
      },
      { id: 95, governorate_id: 3, name_ar: "الأزاريطة", name_en: "Azarita" },
      { id: 96, governorate_id: 3, name_ar: "الانفوشى", name_en: "Anfoushi" },
      { id: 97, governorate_id: 3, name_ar: "الدخيلة", name_en: "Dekheila" },
      { id: 98, governorate_id: 3, name_ar: "السيوف", name_en: "El Soyof" },
      { id: 99, governorate_id: 3, name_ar: "العامرية", name_en: "Ameria" },
      { id: 100, governorate_id: 3, name_ar: "اللبان", name_en: "El Labban" },
      {
        id: 101,
        governorate_id: 3,
        name_ar: "المفروزة",
        name_en: "Al Mafrouza",
      },
      { id: 102, governorate_id: 3, name_ar: "المنتزه", name_en: "El Montaza" },
      { id: 103, governorate_id: 3, name_ar: "المنشية", name_en: "Mansheya" },
      { id: 104, governorate_id: 3, name_ar: "الناصرية", name_en: "Naseria" },
      { id: 105, governorate_id: 3, name_ar: "امبروزو", name_en: "Ambrozo" },
      { id: 106, governorate_id: 3, name_ar: "باب شرق", name_en: "Bab Sharq" },
      {
        id: 107,
        governorate_id: 3,
        name_ar: "برج العرب",
        name_en: "Bourj Alarab",
      },
      { id: 108, governorate_id: 3, name_ar: "ستانلى", name_en: "Stanley" },
      { id: 109, governorate_id: 3, name_ar: "سموحة", name_en: "Smouha" },
      {
        id: 110,
        governorate_id: 3,
        name_ar: "سيدى بشر",
        name_en: "Sidi Bishr",
      },
      { id: 111, governorate_id: 3, name_ar: "شدس", name_en: "Shads" },
      {
        id: 112,
        governorate_id: 3,
        name_ar: "غيط العنب",
        name_en: "Gheet Alenab",
      },
      { id: 113, governorate_id: 3, name_ar: "فلمينج", name_en: "Fleming" },
      { id: 114, governorate_id: 3, name_ar: "فيكتوريا", name_en: "Victoria" },
      {
        id: 115,
        governorate_id: 3,
        name_ar: "كامب شيزار",
        name_en: "Camp Shizar",
      },
      { id: 116, governorate_id: 3, name_ar: "كرموز", name_en: "Karmooz" },
      {
        id: 117,
        governorate_id: 3,
        name_ar: "محطة الرمل",
        name_en: "Mahta Alraml",
      },
      {
        id: 118,
        governorate_id: 3,
        name_ar: "مينا البصل",
        name_en: "Mina El-Basal",
      },
      { id: 119, governorate_id: 3, name_ar: "العصافرة", name_en: "Asafra" },
      { id: 120, governorate_id: 3, name_ar: "العجمي", name_en: "Agamy" },
      { id: 121, governorate_id: 3, name_ar: "بكوس", name_en: "Bakos" },
      { id: 122, governorate_id: 3, name_ar: "بولكلي", name_en: "Boulkly" },
      {
        id: 123,
        governorate_id: 3,
        name_ar: "كليوباترا",
        name_en: "Cleopatra",
      },
      { id: 124, governorate_id: 3, name_ar: "جليم", name_en: "Glim" },
      {
        id: 125,
        governorate_id: 3,
        name_ar: "المعمورة",
        name_en: "Al Mamurah",
      },
      { id: 126, governorate_id: 3, name_ar: "المندرة", name_en: "Al Mandara" },
      {
        id: 127,
        governorate_id: 3,
        name_ar: "محرم بك",
        name_en: "Moharam Bek",
      },
      { id: 128, governorate_id: 3, name_ar: "الشاطبي", name_en: "Elshatby" },
      {
        id: 129,
        governorate_id: 3,
        name_ar: "سيدي جابر",
        name_en: "Sidi Gaber",
      },
      {
        id: 130,
        governorate_id: 3,
        name_ar: "الساحل الشمالي",
        name_en: "North Coast\/sahel",
      },
      { id: 131, governorate_id: 3, name_ar: "الحضرة", name_en: "Alhadra" },
      { id: 132, governorate_id: 3, name_ar: "العطارين", name_en: "Alattarin" },
      {
        id: 133,
        governorate_id: 3,
        name_ar: "سيدي كرير",
        name_en: "Sidi Kerir",
      },
      { id: 134, governorate_id: 3, name_ar: "الجمرك", name_en: "Elgomrok" },
      { id: 135, governorate_id: 3, name_ar: "المكس", name_en: "Al Max" },
      { id: 136, governorate_id: 3, name_ar: "مارينا", name_en: "Marina" },
      { id: 137, governorate_id: 4, name_ar: "المنصورة", name_en: "Mansoura" },
      { id: 138, governorate_id: 4, name_ar: "طلخا", name_en: "Talkha" },
      { id: 139, governorate_id: 4, name_ar: "ميت غمر", name_en: "Mitt Ghamr" },
      { id: 140, governorate_id: 4, name_ar: "دكرنس", name_en: "Dekernes" },
      { id: 141, governorate_id: 4, name_ar: "أجا", name_en: "Aga" },
      {
        id: 142,
        governorate_id: 4,
        name_ar: "منية النصر",
        name_en: "Menia El Nasr",
      },
      {
        id: 143,
        governorate_id: 4,
        name_ar: "السنبلاوين",
        name_en: "Sinbillawin",
      },
      { id: 144, governorate_id: 4, name_ar: "الكردي", name_en: "El Kurdi" },
      {
        id: 145,
        governorate_id: 4,
        name_ar: "بني عبيد",
        name_en: "Bani Ubaid",
      },
      { id: 146, governorate_id: 4, name_ar: "المنزلة", name_en: "Al Manzala" },
      {
        id: 147,
        governorate_id: 4,
        name_ar: "تمي الأمديد",
        name_en: "tami al'amdid",
      },
      { id: 148, governorate_id: 4, name_ar: "الجمالية", name_en: "aljamalia" },
      { id: 149, governorate_id: 4, name_ar: "شربين", name_en: "Sherbin" },
      { id: 150, governorate_id: 4, name_ar: "المطرية", name_en: "Mataria" },
      { id: 151, governorate_id: 4, name_ar: "بلقاس", name_en: "Belqas" },
      {
        id: 152,
        governorate_id: 4,
        name_ar: "ميت سلسيل",
        name_en: "Meet Salsil",
      },
      { id: 153, governorate_id: 4, name_ar: "جمصة", name_en: "Gamasa" },
      {
        id: 154,
        governorate_id: 4,
        name_ar: "محلة دمنة",
        name_en: "Mahalat Damana",
      },
      { id: 155, governorate_id: 4, name_ar: "نبروه", name_en: "Nabroh" },
      { id: 156, governorate_id: 5, name_ar: "الغردقة", name_en: "Hurghada" },
      {
        id: 157,
        governorate_id: 5,
        name_ar: "رأس غارب",
        name_en: "Ras Ghareb",
      },
      { id: 158, governorate_id: 5, name_ar: "سفاجا", name_en: "Safaga" },
      { id: 159, governorate_id: 5, name_ar: "القصير", name_en: "El Qusiar" },
      {
        id: 160,
        governorate_id: 5,
        name_ar: "مرسى علم",
        name_en: "Marsa Alam",
      },
      { id: 161, governorate_id: 5, name_ar: "الشلاتين", name_en: "Shalatin" },
      { id: 162, governorate_id: 5, name_ar: "حلايب", name_en: "Halaib" },
      { id: 163, governorate_id: 5, name_ar: "الدهار", name_en: "Aldahar" },
      { id: 164, governorate_id: 6, name_ar: "دمنهور", name_en: "Damanhour" },
      {
        id: 165,
        governorate_id: 6,
        name_ar: "كفر الدوار",
        name_en: "Kafr El Dawar",
      },
      { id: 166, governorate_id: 6, name_ar: "رشيد", name_en: "Rashid" },
      { id: 167, governorate_id: 6, name_ar: "إدكو", name_en: "Edco" },
      {
        id: 168,
        governorate_id: 6,
        name_ar: "أبو المطامير",
        name_en: "Abu al-Matamir",
      },
      { id: 169, governorate_id: 6, name_ar: "أبو حمص", name_en: "Abu Homs" },
      { id: 170, governorate_id: 6, name_ar: "الدلنجات", name_en: "Delengat" },
      {
        id: 171,
        governorate_id: 6,
        name_ar: "المحمودية",
        name_en: "Mahmoudiyah",
      },
      {
        id: 172,
        governorate_id: 6,
        name_ar: "الرحمانية",
        name_en: "Rahmaniyah",
      },
      {
        id: 173,
        governorate_id: 6,
        name_ar: "إيتاي البارود",
        name_en: "Itai Baroud",
      },
      {
        id: 174,
        governorate_id: 6,
        name_ar: "حوش عيسى",
        name_en: "Housh Eissa",
      },
      { id: 175, governorate_id: 6, name_ar: "شبراخيت", name_en: "Shubrakhit" },
      {
        id: 176,
        governorate_id: 6,
        name_ar: "كوم حمادة",
        name_en: "Kom Hamada",
      },
      { id: 177, governorate_id: 6, name_ar: "بدر", name_en: "Badr" },
      {
        id: 178,
        governorate_id: 6,
        name_ar: "وادي النطرون",
        name_en: "Wadi Natrun",
      },
      {
        id: 179,
        governorate_id: 6,
        name_ar: "النوبارية الجديدة",
        name_en: "New Nubaria",
      },
      {
        id: 180,
        governorate_id: 6,
        name_ar: "النوبارية",
        name_en: "Alnoubareya",
      },
      { id: 181, governorate_id: 7, name_ar: "الفيوم", name_en: "Fayoum" },
      {
        id: 182,
        governorate_id: 7,
        name_ar: "الفيوم الجديدة",
        name_en: "Fayoum El Gedida",
      },
      { id: 183, governorate_id: 7, name_ar: "طامية", name_en: "Tamiya" },
      { id: 184, governorate_id: 7, name_ar: "سنورس", name_en: "Snores" },
      { id: 185, governorate_id: 7, name_ar: "إطسا", name_en: "Etsa" },
      { id: 186, governorate_id: 7, name_ar: "إبشواي", name_en: "Epschway" },
      {
        id: 187,
        governorate_id: 7,
        name_ar: "يوسف الصديق",
        name_en: "Yusuf El Sediaq",
      },
      { id: 188, governorate_id: 7, name_ar: "الحادقة", name_en: "Hadqa" },
      { id: 189, governorate_id: 7, name_ar: "اطسا", name_en: "Atsa" },
      { id: 190, governorate_id: 7, name_ar: "الجامعة", name_en: "Algamaa" },
      { id: 191, governorate_id: 7, name_ar: "السيالة", name_en: "Sayala" },
      { id: 192, governorate_id: 8, name_ar: "طنطا", name_en: "Tanta" },
      {
        id: 193,
        governorate_id: 8,
        name_ar: "المحلة الكبرى",
        name_en: "Al Mahalla Al Kobra",
      },
      {
        id: 194,
        governorate_id: 8,
        name_ar: "كفر الزيات",
        name_en: "Kafr El Zayat",
      },
      { id: 195, governorate_id: 8, name_ar: "زفتى", name_en: "Zefta" },
      { id: 196, governorate_id: 8, name_ar: "السنطة", name_en: "El Santa" },
      { id: 197, governorate_id: 8, name_ar: "قطور", name_en: "Qutour" },
      { id: 198, governorate_id: 8, name_ar: "بسيون", name_en: "Basion" },
      { id: 199, governorate_id: 8, name_ar: "سمنود", name_en: "Samannoud" },
      {
        id: 200,
        governorate_id: 9,
        name_ar: "الإسماعيلية",
        name_en: "Ismailia",
      },
      { id: 201, governorate_id: 9, name_ar: "فايد", name_en: "Fayed" },
      {
        id: 202,
        governorate_id: 9,
        name_ar: "القنطرة شرق",
        name_en: "Qantara Sharq",
      },
      {
        id: 203,
        governorate_id: 9,
        name_ar: "القنطرة غرب",
        name_en: "Qantara Gharb",
      },
      {
        id: 204,
        governorate_id: 9,
        name_ar: "التل الكبير",
        name_en: "El Tal El Kabier",
      },
      { id: 205, governorate_id: 9, name_ar: "أبو صوير", name_en: "Abu Sawir" },
      {
        id: 206,
        governorate_id: 9,
        name_ar: "القصاصين الجديدة",
        name_en: "Kasasien El Gedida",
      },
      { id: 207, governorate_id: 9, name_ar: "نفيشة", name_en: "Nefesha" },
      {
        id: 208,
        governorate_id: 9,
        name_ar: "الشيخ زايد",
        name_en: "Sheikh Zayed",
      },
      {
        id: 209,
        governorate_id: 10,
        name_ar: "شبين الكوم",
        name_en: "Shbeen El Koom",
      },
      {
        id: 210,
        governorate_id: 10,
        name_ar: "مدينة السادات",
        name_en: "Sadat City",
      },
      { id: 211, governorate_id: 10, name_ar: "منوف", name_en: "Menouf" },
      {
        id: 212,
        governorate_id: 10,
        name_ar: "سرس الليان",
        name_en: "Sars El-Layan",
      },
      { id: 213, governorate_id: 10, name_ar: "أشمون", name_en: "Ashmon" },
      { id: 214, governorate_id: 10, name_ar: "الباجور", name_en: "Al Bagor" },
      { id: 215, governorate_id: 10, name_ar: "قويسنا", name_en: "Quesna" },
      {
        id: 216,
        governorate_id: 10,
        name_ar: "بركة السبع",
        name_en: "Berkat El Saba",
      },
      { id: 217, governorate_id: 10, name_ar: "تلا", name_en: "Tala" },
      {
        id: 218,
        governorate_id: 10,
        name_ar: "الشهداء",
        name_en: "Al Shohada",
      },
      { id: 219, governorate_id: 11, name_ar: "المنيا", name_en: "Minya" },
      {
        id: 220,
        governorate_id: 11,
        name_ar: "المنيا الجديدة",
        name_en: "Minya El Gedida",
      },
      { id: 221, governorate_id: 11, name_ar: "العدوة", name_en: "El Adwa" },
      { id: 222, governorate_id: 11, name_ar: "مغاغة", name_en: "Magagha" },
      {
        id: 223,
        governorate_id: 11,
        name_ar: "بني مزار",
        name_en: "Bani Mazar",
      },
      { id: 224, governorate_id: 11, name_ar: "مطاي", name_en: "Mattay" },
      { id: 225, governorate_id: 11, name_ar: "سمالوط", name_en: "Samalut" },
      {
        id: 226,
        governorate_id: 11,
        name_ar: "المدينة الفكرية",
        name_en: "Madinat El Fekria",
      },
      { id: 227, governorate_id: 11, name_ar: "ملوي", name_en: "Meloy" },
      {
        id: 228,
        governorate_id: 11,
        name_ar: "دير مواس",
        name_en: "Deir Mawas",
      },
      {
        id: 229,
        governorate_id: 11,
        name_ar: "ابو قرقاص",
        name_en: "Abu Qurqas",
      },
      {
        id: 230,
        governorate_id: 11,
        name_ar: "ارض سلطان",
        name_en: "Ard Sultan",
      },
      { id: 231, governorate_id: 12, name_ar: "بنها", name_en: "Banha" },
      { id: 232, governorate_id: 12, name_ar: "قليوب", name_en: "Qalyub" },
      {
        id: 233,
        governorate_id: 12,
        name_ar: "شبرا الخيمة",
        name_en: "Shubra Al Khaimah",
      },
      {
        id: 234,
        governorate_id: 12,
        name_ar: "القناطر الخيرية",
        name_en: "Al Qanater Charity",
      },
      { id: 235, governorate_id: 12, name_ar: "الخانكة", name_en: "Khanka" },
      {
        id: 236,
        governorate_id: 12,
        name_ar: "كفر شكر",
        name_en: "Kafr Shukr",
      },
      { id: 237, governorate_id: 12, name_ar: "طوخ", name_en: "Tukh" },
      { id: 238, governorate_id: 12, name_ar: "قها", name_en: "Qaha" },
      { id: 239, governorate_id: 12, name_ar: "العبور", name_en: "Obour" },
      { id: 240, governorate_id: 12, name_ar: "الخصوص", name_en: "Khosous" },
      {
        id: 241,
        governorate_id: 12,
        name_ar: "شبين القناطر",
        name_en: "Shibin Al Qanater",
      },
      { id: 242, governorate_id: 12, name_ar: "مسطرد", name_en: "Mostorod" },
      { id: 243, governorate_id: 13, name_ar: "الخارجة", name_en: "El Kharga" },
      { id: 244, governorate_id: 13, name_ar: "باريس", name_en: "Paris" },
      { id: 245, governorate_id: 13, name_ar: "موط", name_en: "Mout" },
      { id: 246, governorate_id: 13, name_ar: "الفرافرة", name_en: "Farafra" },
      { id: 247, governorate_id: 13, name_ar: "بلاط", name_en: "Balat" },
      { id: 248, governorate_id: 13, name_ar: "الداخلة", name_en: "Dakhla" },
      { id: 249, governorate_id: 14, name_ar: "السويس", name_en: "Suez" },
      { id: 250, governorate_id: 14, name_ar: "الجناين", name_en: "Alganayen" },
      { id: 251, governorate_id: 14, name_ar: "عتاقة", name_en: "Ataqah" },
      {
        id: 252,
        governorate_id: 14,
        name_ar: "العين السخنة",
        name_en: "Ain Sokhna",
      },
      { id: 253, governorate_id: 14, name_ar: "فيصل", name_en: "Faysal" },
      { id: 254, governorate_id: 15, name_ar: "أسوان", name_en: "Aswan" },
      {
        id: 255,
        governorate_id: 15,
        name_ar: "أسوان الجديدة",
        name_en: "Aswan El Gedida",
      },
      { id: 256, governorate_id: 15, name_ar: "دراو", name_en: "Drau" },
      { id: 257, governorate_id: 15, name_ar: "كوم أمبو", name_en: "Kom Ombo" },
      {
        id: 258,
        governorate_id: 15,
        name_ar: "نصر النوبة",
        name_en: "Nasr Al Nuba",
      },
      { id: 259, governorate_id: 15, name_ar: "كلابشة", name_en: "Kalabsha" },
      { id: 260, governorate_id: 15, name_ar: "إدفو", name_en: "Edfu" },
      {
        id: 261,
        governorate_id: 15,
        name_ar: "الرديسية",
        name_en: "Al-Radisiyah",
      },
      {
        id: 262,
        governorate_id: 15,
        name_ar: "البصيلية",
        name_en: "Al Basilia",
      },
      {
        id: 263,
        governorate_id: 15,
        name_ar: "السباعية",
        name_en: "Al Sibaeia",
      },
      {
        id: 264,
        governorate_id: 15,
        name_ar: "ابوسمبل السياحية",
        name_en: "Abo Simbl Al Siyahia",
      },
      {
        id: 265,
        governorate_id: 15,
        name_ar: "مرسى علم",
        name_en: "Marsa Alam",
      },
      { id: 266, governorate_id: 16, name_ar: "أسيوط", name_en: "Assiut" },
      {
        id: 267,
        governorate_id: 16,
        name_ar: "أسيوط الجديدة",
        name_en: "Assiut El Gedida",
      },
      { id: 268, governorate_id: 16, name_ar: "ديروط", name_en: "Dayrout" },
      { id: 269, governorate_id: 16, name_ar: "منفلوط", name_en: "Manfalut" },
      { id: 270, governorate_id: 16, name_ar: "القوصية", name_en: "Qusiya" },
      { id: 271, governorate_id: 16, name_ar: "أبنوب", name_en: "Abnoub" },
      { id: 272, governorate_id: 16, name_ar: "أبو تيج", name_en: "Abu Tig" },
      {
        id: 273,
        governorate_id: 16,
        name_ar: "الغنايم",
        name_en: "El Ghanaim",
      },
      {
        id: 274,
        governorate_id: 16,
        name_ar: "ساحل سليم",
        name_en: "Sahel Selim",
      },
      { id: 275, governorate_id: 16, name_ar: "البداري", name_en: "El Badari" },
      { id: 276, governorate_id: 16, name_ar: "صدفا", name_en: "Sidfa" },
      {
        id: 277,
        governorate_id: 17,
        name_ar: "بني سويف",
        name_en: "Bani Sweif",
      },
      {
        id: 278,
        governorate_id: 17,
        name_ar: "بني سويف الجديدة",
        name_en: "Beni Suef El Gedida",
      },
      { id: 279, governorate_id: 17, name_ar: "الواسطى", name_en: "Al Wasta" },
      { id: 280, governorate_id: 17, name_ar: "ناصر", name_en: "Naser" },
      { id: 281, governorate_id: 17, name_ar: "إهناسيا", name_en: "Ehnasia" },
      { id: 282, governorate_id: 17, name_ar: "ببا", name_en: "beba" },
      { id: 283, governorate_id: 17, name_ar: "الفشن", name_en: "Fashn" },
      { id: 284, governorate_id: 17, name_ar: "سمسطا", name_en: "Somasta" },
      {
        id: 285,
        governorate_id: 17,
        name_ar: "الاباصيرى",
        name_en: "Alabbaseri",
      },
      { id: 286, governorate_id: 17, name_ar: "مقبل", name_en: "Mokbel" },
      { id: 287, governorate_id: 18, name_ar: "بورسعيد", name_en: "PorSaid" },
      {
        id: 288,
        governorate_id: 18,
        name_ar: "بورفؤاد",
        name_en: "Port Fouad",
      },
      { id: 289, governorate_id: 18, name_ar: "العرب", name_en: "Alarab" },
      { id: 290, governorate_id: 18, name_ar: "حى الزهور", name_en: "Zohour" },
      { id: 291, governorate_id: 18, name_ar: "حى الشرق", name_en: "Alsharq" },
      {
        id: 292,
        governorate_id: 18,
        name_ar: "حى الضواحى",
        name_en: "Aldawahi",
      },
      {
        id: 293,
        governorate_id: 18,
        name_ar: "حى المناخ",
        name_en: "Almanakh",
      },
      { id: 294, governorate_id: 18, name_ar: "حى مبارك", name_en: "Mubarak" },
      { id: 295, governorate_id: 19, name_ar: "دمياط", name_en: "Damietta" },
      {
        id: 296,
        governorate_id: 19,
        name_ar: "دمياط الجديدة",
        name_en: "New Damietta",
      },
      {
        id: 297,
        governorate_id: 19,
        name_ar: "رأس البر",
        name_en: "Ras El Bar",
      },
      { id: 298, governorate_id: 19, name_ar: "فارسكور", name_en: "Faraskour" },
      { id: 299, governorate_id: 19, name_ar: "الزرقا", name_en: "Zarqa" },
      { id: 300, governorate_id: 19, name_ar: "السرو", name_en: "alsaru" },
      { id: 301, governorate_id: 19, name_ar: "الروضة", name_en: "alruwda" },
      {
        id: 302,
        governorate_id: 19,
        name_ar: "كفر البطيخ",
        name_en: "Kafr El-Batikh",
      },
      {
        id: 303,
        governorate_id: 19,
        name_ar: "عزبة البرج",
        name_en: "Azbet Al Burg",
      },
      {
        id: 304,
        governorate_id: 19,
        name_ar: "ميت أبو غالب",
        name_en: "Meet Abou Ghalib",
      },
      { id: 305, governorate_id: 19, name_ar: "كفر سعد", name_en: "Kafr Saad" },
      { id: 306, governorate_id: 20, name_ar: "الزقازيق", name_en: "Zagazig" },
      {
        id: 307,
        governorate_id: 20,
        name_ar: "العاشر من رمضان",
        name_en: "Al Ashr Men Ramadan",
      },
      {
        id: 308,
        governorate_id: 20,
        name_ar: "منيا القمح",
        name_en: "Minya Al Qamh",
      },
      { id: 309, governorate_id: 20, name_ar: "بلبيس", name_en: "Belbeis" },
      {
        id: 310,
        governorate_id: 20,
        name_ar: "مشتول السوق",
        name_en: "Mashtoul El Souq",
      },
      { id: 311, governorate_id: 20, name_ar: "القنايات", name_en: "Qenaiat" },
      {
        id: 312,
        governorate_id: 20,
        name_ar: "أبو حماد",
        name_en: "Abu Hammad",
      },
      { id: 313, governorate_id: 20, name_ar: "القرين", name_en: "El Qurain" },
      { id: 314, governorate_id: 20, name_ar: "ههيا", name_en: "Hehia" },
      {
        id: 315,
        governorate_id: 20,
        name_ar: "أبو كبير",
        name_en: "Abu Kabir",
      },
      { id: 316, governorate_id: 20, name_ar: "فاقوس", name_en: "Faccus" },
      {
        id: 317,
        governorate_id: 20,
        name_ar: "الصالحية الجديدة",
        name_en: "El Salihia El Gedida",
      },
      {
        id: 318,
        governorate_id: 20,
        name_ar: "الإبراهيمية",
        name_en: "Al Ibrahimiyah",
      },
      {
        id: 319,
        governorate_id: 20,
        name_ar: "ديرب نجم",
        name_en: "Deirb Negm",
      },
      { id: 320, governorate_id: 20, name_ar: "كفر صقر", name_en: "Kafr Saqr" },
      {
        id: 321,
        governorate_id: 20,
        name_ar: "أولاد صقر",
        name_en: "Awlad Saqr",
      },
      {
        id: 322,
        governorate_id: 20,
        name_ar: "الحسينية",
        name_en: "Husseiniya",
      },
      {
        id: 323,
        governorate_id: 20,
        name_ar: "صان الحجر القبلية",
        name_en: "san alhajar alqablia",
      },
      {
        id: 324,
        governorate_id: 20,
        name_ar: "منشأة أبو عمر",
        name_en: "Manshayat Abu Omar",
      },
      { id: 325, governorate_id: 21, name_ar: "الطور", name_en: "Al Toor" },
      {
        id: 326,
        governorate_id: 21,
        name_ar: "شرم الشيخ",
        name_en: "Sharm El-Shaikh",
      },
      { id: 327, governorate_id: 21, name_ar: "دهب", name_en: "Dahab" },
      { id: 328, governorate_id: 21, name_ar: "نويبع", name_en: "Nuweiba" },
      { id: 329, governorate_id: 21, name_ar: "طابا", name_en: "Taba" },
      {
        id: 330,
        governorate_id: 21,
        name_ar: "سانت كاترين",
        name_en: "Saint Catherine",
      },
      {
        id: 331,
        governorate_id: 21,
        name_ar: "أبو رديس",
        name_en: "Abu Redis",
      },
      {
        id: 332,
        governorate_id: 21,
        name_ar: "أبو زنيمة",
        name_en: "Abu Zenaima",
      },
      { id: 333, governorate_id: 21, name_ar: "رأس سدر", name_en: "Ras Sidr" },
      {
        id: 334,
        governorate_id: 22,
        name_ar: "كفر الشيخ",
        name_en: "Kafr El Sheikh",
      },
      {
        id: 335,
        governorate_id: 22,
        name_ar: "وسط البلد كفر الشيخ",
        name_en: "Kafr El Sheikh Downtown",
      },
      { id: 336, governorate_id: 22, name_ar: "دسوق", name_en: "Desouq" },
      { id: 337, governorate_id: 22, name_ar: "فوه", name_en: "Fooh" },
      { id: 338, governorate_id: 22, name_ar: "مطوبس", name_en: "Metobas" },
      {
        id: 339,
        governorate_id: 22,
        name_ar: "برج البرلس",
        name_en: "Burg Al Burullus",
      },
      { id: 340, governorate_id: 22, name_ar: "بلطيم", name_en: "Baltim" },
      {
        id: 341,
        governorate_id: 22,
        name_ar: "مصيف بلطيم",
        name_en: "Masief Baltim",
      },
      { id: 342, governorate_id: 22, name_ar: "الحامول", name_en: "Hamol" },
      { id: 343, governorate_id: 22, name_ar: "بيلا", name_en: "Bella" },
      { id: 344, governorate_id: 22, name_ar: "الرياض", name_en: "Riyadh" },
      {
        id: 345,
        governorate_id: 22,
        name_ar: "سيدي سالم",
        name_en: "Sidi Salm",
      },
      { id: 346, governorate_id: 22, name_ar: "قلين", name_en: "Qellen" },
      {
        id: 347,
        governorate_id: 22,
        name_ar: "سيدي غازي",
        name_en: "Sidi Ghazi",
      },
      {
        id: 348,
        governorate_id: 23,
        name_ar: "مرسى مطروح",
        name_en: "Marsa Matrouh",
      },
      { id: 349, governorate_id: 23, name_ar: "الحمام", name_en: "El Hamam" },
      { id: 350, governorate_id: 23, name_ar: "العلمين", name_en: "Alamein" },
      { id: 351, governorate_id: 23, name_ar: "الضبعة", name_en: "Dabaa" },
      { id: 352, governorate_id: 23, name_ar: "النجيلة", name_en: "Al-Nagila" },
      {
        id: 353,
        governorate_id: 23,
        name_ar: "سيدي براني",
        name_en: "Sidi Brani",
      },
      { id: 354, governorate_id: 23, name_ar: "السلوم", name_en: "Salloum" },
      { id: 355, governorate_id: 23, name_ar: "سيوة", name_en: "Siwa" },
      { id: 356, governorate_id: 23, name_ar: "مارينا", name_en: "Marina" },
      {
        id: 357,
        governorate_id: 23,
        name_ar: "الساحل الشمالى",
        name_en: "North Coast",
      },
      { id: 358, governorate_id: 24, name_ar: "الأقصر", name_en: "Luxor" },
      {
        id: 359,
        governorate_id: 24,
        name_ar: "الأقصر الجديدة",
        name_en: "New Luxor",
      },
      { id: 360, governorate_id: 24, name_ar: "إسنا", name_en: "Esna" },
      {
        id: 361,
        governorate_id: 24,
        name_ar: "طيبة الجديدة",
        name_en: "New Tiba",
      },
      { id: 362, governorate_id: 24, name_ar: "الزينية", name_en: "Al ziynia" },
      {
        id: 363,
        governorate_id: 24,
        name_ar: "البياضية",
        name_en: "Al Bayadieh",
      },
      { id: 364, governorate_id: 24, name_ar: "القرنة", name_en: "Al Qarna" },
      { id: 365, governorate_id: 24, name_ar: "أرمنت", name_en: "Armant" },
      { id: 366, governorate_id: 24, name_ar: "الطود", name_en: "Al Tud" },
      { id: 367, governorate_id: 25, name_ar: "قنا", name_en: "Qena" },
      {
        id: 368,
        governorate_id: 25,
        name_ar: "قنا الجديدة",
        name_en: "New Qena",
      },
      { id: 369, governorate_id: 25, name_ar: "ابو طشت", name_en: "Abu Tesht" },
      {
        id: 370,
        governorate_id: 25,
        name_ar: "نجع حمادي",
        name_en: "Nag Hammadi",
      },
      { id: 371, governorate_id: 25, name_ar: "دشنا", name_en: "Deshna" },
      { id: 372, governorate_id: 25, name_ar: "الوقف", name_en: "Alwaqf" },
      { id: 373, governorate_id: 25, name_ar: "قفط", name_en: "Qaft" },
      { id: 374, governorate_id: 25, name_ar: "نقادة", name_en: "Naqada" },
      { id: 375, governorate_id: 25, name_ar: "فرشوط", name_en: "Farshout" },
      { id: 376, governorate_id: 25, name_ar: "قوص", name_en: "Quos" },
      { id: 377, governorate_id: 26, name_ar: "العريش", name_en: "Arish" },
      {
        id: 378,
        governorate_id: 26,
        name_ar: "الشيخ زويد",
        name_en: "Sheikh Zowaid",
      },
      { id: 379, governorate_id: 26, name_ar: "نخل", name_en: "Nakhl" },
      { id: 380, governorate_id: 26, name_ar: "رفح", name_en: "Rafah" },
      {
        id: 381,
        governorate_id: 26,
        name_ar: "بئر العبد",
        name_en: "Bir al-Abed",
      },
      { id: 382, governorate_id: 26, name_ar: "الحسنة", name_en: "Al Hasana" },
      { id: 383, governorate_id: 27, name_ar: "سوهاج", name_en: "Sohag" },
      {
        id: 384,
        governorate_id: 27,
        name_ar: "سوهاج الجديدة",
        name_en: "Sohag El Gedida",
      },
      { id: 385, governorate_id: 27, name_ar: "أخميم", name_en: "Akhmeem" },
      {
        id: 386,
        governorate_id: 27,
        name_ar: "أخميم الجديدة",
        name_en: "Akhmim El Gedida",
      },
      { id: 387, governorate_id: 27, name_ar: "البلينا", name_en: "Albalina" },
      {
        id: 388,
        governorate_id: 27,
        name_ar: "المراغة",
        name_en: "El Maragha",
      },
      {
        id: 389,
        governorate_id: 27,
        name_ar: "المنشأة",
        name_en: "almunsha'a",
      },
      {
        id: 390,
        governorate_id: 27,
        name_ar: "دار السلام",
        name_en: "Dar AISalaam",
      },
      { id: 391, governorate_id: 27, name_ar: "جرجا", name_en: "Gerga" },
      {
        id: 392,
        governorate_id: 27,
        name_ar: "جهينة الغربية",
        name_en: "Jahina Al Gharbia",
      },
      { id: 393, governorate_id: 27, name_ar: "ساقلته", name_en: "Saqilatuh" },
      { id: 394, governorate_id: 27, name_ar: "طما", name_en: "Tama" },
      { id: 395, governorate_id: 27, name_ar: "طهطا", name_en: "Tahta" },
      { id: 396, governorate_id: 27, name_ar: "الكوثر", name_en: "Alkawthar" },
    ],
    skipDuplicates: true,
  });
  await prisma.areas.createMany({
    data: [
      {
        id: 1,
        city_id: 1,
        name_ar: "الحي الأول - 15 مايو",
        name_en: "First District - 15 May",
      },
      {
        id: 2,
        city_id: 1,
        name_ar: "الحي الثاني - 15 مايو",
        name_en: "Second District - 15 May",
      },
      {
        id: 3,
        city_id: 1,
        name_ar: "الحي الثالث - 15 مايو",
        name_en: "Third District - 15 May",
      },
      {
        id: 4,
        city_id: 1,
        name_ar: "الحي الرابع - 15 مايو",
        name_en: "Fourth District - 15 May",
      },
      {
        id: 5,
        city_id: 1,
        name_ar: "الحي الخامس - 15 مايو",
        name_en: "Fifth District - 15 May",
      },
      {
        id: 6,
        city_id: 1,
        name_ar: "الحي السادس - 15 مايو",
        name_en: "Sixth District - 15 May",
      },
      {
        id: 7,
        city_id: 1,
        name_ar: "الحي السابع - 15 مايو",
        name_en: "Seventh District - 15 May",
      },
      {
        id: 8,
        city_id: 1,
        name_ar: "الحي الثامن - 15 مايو",
        name_en: "Eighth District - 15 May",
      },
      {
        id: 9,
        city_id: 1,
        name_ar: "الحي التاسع - 15 مايو",
        name_en: "Ninth District - 15 May",
      },
      {
        id: 10,
        city_id: 1,
        name_ar: "الحي العاشر - 15 مايو",
        name_en: "Tenth District - 15 May",
      },
      {
        id: 11,
        city_id: 1,
        name_ar: "الحي الحادي عشر - 15 مايو",
        name_en: "Eleventh District - 15 May",
      },
      {
        id: 12,
        city_id: 1,
        name_ar: "الحي الثاني عشر - 15 مايو",
        name_en: "Twelfth District - 15 May",
      },
      {
        id: 13,
        city_id: 1,
        name_ar: "الحي الثالث عشر - 15 مايو",
        name_en: "Thirteenth District - 15 May",
      },
      {
        id: 14,
        city_id: 1,
        name_ar: "الحي الرابع عشر - 15 مايو",
        name_en: "Fourteenth District - 15 May",
      },
      {
        id: 15,
        city_id: 1,
        name_ar: "الحي الخامس عشر - 15 مايو",
        name_en: "Fifteenth District - 15 May",
      },
      {
        id: 16,
        city_id: 1,
        name_ar: "المنطقة الصناعية - 15 مايو",
        name_en: "Industrial Zone - 15 May",
      },
      {
        id: 17,
        city_id: 1,
        name_ar: "المنطقة الحرفية - 15 مايو",
        name_en: "Crafts Zone - 15 May",
      },
      {
        id: 18,
        city_id: 1,
        name_ar: "المنطقة التجارية - 15 مايو",
        name_en: "Commercial Zone - 15 May",
      },
      {
        id: 19,
        city_id: 1,
        name_ar: "مدينة 15 مايو الجديدة",
        name_en: "New 15 May City",
      },
      {
        id: 20,
        city_id: 1,
        name_ar: "امتداد 15 مايو",
        name_en: "15 May Extension",
      },

      // الازبكية (id: 2)
      { id: 21, city_id: 2, name_ar: "شارع الجيش", name_en: "Al Geish Street" },
      {
        id: 22,
        city_id: 2,
        name_ar: "شارع الجمهورية",
        name_en: "Al Gomhoreya Street",
      },
      { id: 23, city_id: 2, name_ar: "شارع رمسيس", name_en: "Ramses Street" },
      { id: 24, city_id: 2, name_ar: "ميدان رمسيس", name_en: "Ramses Square" },
      {
        id: 25,
        city_id: 2,
        name_ar: "شارع الجلاء",
        name_en: "Al Galaa Street",
      },
      {
        id: 26,
        city_id: 2,
        name_ar: "شارع نجيب الريحاني",
        name_en: "Naguib El Rihani Street",
      },
      {
        id: 27,
        city_id: 2,
        name_ar: "شارع محمد فريد",
        name_en: "Mohamed Farid Street",
      },
      {
        id: 28,
        city_id: 2,
        name_ar: "شارع عبد الخالق ثروت",
        name_en: "Abdel Khalek Tharwat Street",
      },
      {
        id: 29,
        city_id: 2,
        name_ar: "شارع شامبليون",
        name_en: "Champollion Street",
      },
      {
        id: 30,
        city_id: 2,
        name_ar: "شارع سليمان باشا",
        name_en: "Soliman Pasha Street",
      },
      {
        id: 31,
        city_id: 2,
        name_ar: "شارع قصر النيل",
        name_en: "Kasr El Nil Street",
      },
      {
        id: 32,
        city_id: 2,
        name_ar: "شارع البستان",
        name_en: "Al Bustan Street",
      },
      {
        id: 33,
        city_id: 2,
        name_ar: "شارع طلعت حرب",
        name_en: "Talaat Harb Street",
      },
      { id: 34, city_id: 2, name_ar: "شارع عدلي", name_en: "Adly Street" },
      { id: 35, city_id: 2, name_ar: "ميدان الأوبرا", name_en: "Opera Square" },
      {
        id: 36,
        city_id: 2,
        name_ar: "شارع صبري أبو علم",
        name_en: "Sabri Abou Alam Street",
      },
      {
        id: 37,
        city_id: 2,
        name_ar: "شارع محمد صبري أبو علم",
        name_en: "Mohamed Sabri Abou Alam Street",
      },
      {
        id: 38,
        city_id: 2,
        name_ar: "شارع إبراهيم باشا",
        name_en: "Ibrahim Pasha Street",
      },
      {
        id: 39,
        city_id: 2,
        name_ar: "شارع الجبخانة",
        name_en: "Al Gabkhana Street",
      },
      {
        id: 40,
        city_id: 2,
        name_ar: "شارع الكحكيين",
        name_en: "Al Kahkyeen Street",
      },

      // البساتين (id: 3)
      {
        id: 41,
        city_id: 3,
        name_ar: "عزبة خير الله",
        name_en: "Ezbet Khairallah",
      },
      {
        id: 42,
        city_id: 3,
        name_ar: "حدائق المعادي",
        name_en: "Hadayek Al Maadi",
      },
      {
        id: 43,
        city_id: 3,
        name_ar: "زهراء المعادي",
        name_en: "Zahraa Al Maadi",
      },
      { id: 44, city_id: 3, name_ar: "المعادي القديمة", name_en: "Old Maadi" },
      { id: 45, city_id: 3, name_ar: "شارع النصر", name_en: "Al Nasr Street" },
      { id: 46, city_id: 3, name_ar: "شارع 9", name_en: "Street 9" },
      { id: 47, city_id: 3, name_ar: "شارع 77", name_en: "Street 77" },
      { id: 48, city_id: 3, name_ar: "شارع 105", name_en: "Street 105" },
      { id: 49, city_id: 3, name_ar: "شارع 250", name_en: "Street 250" },
      {
        id: 50,
        city_id: 3,
        name_ar: "شارع الجزائر",
        name_en: "Al Jazeer Street",
      },
      {
        id: 51,
        city_id: 3,
        name_ar: "شارع الأهرام",
        name_en: "Al Ahram Street",
      },
      {
        id: 52,
        city_id: 3,
        name_ar: "شارع اللاسلكي",
        name_en: "Al Laselky Street",
      },
      {
        id: 53,
        city_id: 3,
        name_ar: "شارع وادي النيل",
        name_en: "Wadi El Nil Street",
      },
      { id: 54, city_id: 3, name_ar: "شارع دجلة", name_en: "Digla Street" },
      { id: 55, city_id: 3, name_ar: "كوتسيكا", name_en: "Kotsika" },
      {
        id: 56,
        city_id: 3,
        name_ar: "عزبة نادي النيل",
        name_en: "Ezbet Nadi El Nil",
      },
      {
        id: 57,
        city_id: 3,
        name_ar: "الترعة السويس",
        name_en: "Al Ter'a Al Suez",
      },
      { id: 58, city_id: 3, name_ar: "أرض الجمعية", name_en: "Ard Al Gamaa" },
      {
        id: 59,
        city_id: 3,
        name_ar: "شارع الفريق",
        name_en: "Al Fareek Street",
      },
      { id: 60, city_id: 3, name_ar: "شارع الهدى", name_en: "Al Hoda Street" },

      // التبين (id: 4)
      {
        id: 61,
        city_id: 4,
        name_ar: "التبين البحرية",
        name_en: "Tebin Al Baharya",
      },
      {
        id: 62,
        city_id: 4,
        name_ar: "التبين القبلية",
        name_en: "Tebin Al Qeblya",
      },
      { id: 63, city_id: 4, name_ar: "كفر العلو", name_en: "Kafr Al Olow" },
      { id: 64, city_id: 4, name_ar: "مساكن التبين", name_en: "Tebin Housing" },
      { id: 65, city_id: 4, name_ar: "الصلاحيات", name_en: "Al Salahiyat" },
      { id: 66, city_id: 4, name_ar: "عزبة التبين", name_en: "Ezbet Tebin" },
      {
        id: 67,
        city_id: 4,
        name_ar: "مصنع الحديد والصلب",
        name_en: "Iron and Steel Factory",
      },
      {
        id: 68,
        city_id: 4,
        name_ar: "الكوم الأحمر",
        name_en: "Al Kom Al Ahmar",
      },
      { id: 69, city_id: 4, name_ar: "عزبة عقل", name_en: "Ezbet Akl" },
      {
        id: 70,
        city_id: 4,
        name_ar: "منطقة الكسارات",
        name_en: "Crushers Area",
      },
      { id: 71, city_id: 4, name_ar: "وادي حوف", name_en: "Wadi Hof" },
      {
        id: 72,
        city_id: 4,
        name_ar: "كفر أبو الخير",
        name_en: "Kafr Abou El Kheir",
      },
      {
        id: 73,
        city_id: 4,
        name_ar: "مساكن الأمل",
        name_en: "Al Amal Housing",
      },
      {
        id: 74,
        city_id: 4,
        name_ar: "منطقة المحاجر",
        name_en: "Quarries Area",
      },
      {
        id: 75,
        city_id: 4,
        name_ar: "جبال التبين",
        name_en: "Tebin Mountains",
      },

      // الخليفة (id: 5)
      { id: 76, city_id: 5, name_ar: "الخليفة", name_en: "Al Khalifa" },
      { id: 77, city_id: 5, name_ar: "المغربلين", name_en: "Al Magharbelin" },
      {
        id: 78,
        city_id: 5,
        name_ar: "السيدة عائشة",
        name_en: "Al Sayeda Aisha",
      },
      { id: 79, city_id: 5, name_ar: "الدراسة", name_en: "Al Darrasa" },
      {
        id: 80,
        city_id: 5,
        name_ar: "سور مجرى العيون",
        name_en: "Sour Magra Al Oyoun",
      },
      { id: 81, city_id: 5, name_ar: "الفسطاط", name_en: "Al Fustat" },
      { id: 82, city_id: 5, name_ar: "عين الصيرة", name_en: "Ain Al Seira" },
      { id: 83, city_id: 5, name_ar: "منشية ناصر", name_en: "Mansheyat Naser" },
      {
        id: 84,
        city_id: 5,
        name_ar: "عزبة أبو قريعة",
        name_en: "Ezbet Abou Qoreia",
      },
      { id: 85, city_id: 5, name_ar: "السبع بنات", name_en: "Al Sabaa Banat" },
      { id: 86, city_id: 5, name_ar: "الدويقة", name_en: "Al Dweqa" },
      {
        id: 87,
        city_id: 5,
        name_ar: "عزبة الوالدة",
        name_en: "Ezbet Al Walda",
      },
      {
        id: 88,
        city_id: 5,
        name_ar: "القصر العيني",
        name_en: "Al Kasr Al Ainy",
      },
      { id: 89, city_id: 5, name_ar: "المنيل", name_en: "Al Manyal" },
      { id: 90, city_id: 5, name_ar: "الروضة", name_en: "Al Rawda" },

      // الدراسة (id: 6)
      { id: 91, city_id: 6, name_ar: "الدراسة", name_en: "Al Darrasa" },
      { id: 92, city_id: 6, name_ar: "الأشرفية", name_en: "Al Ashrafia" },
      { id: 93, city_id: 6, name_ar: "باب الوزير", name_en: "Bab Al Wazir" },
      { id: 94, city_id: 6, name_ar: "المنصورية", name_en: "Al Mansouria" },
      { id: 95, city_id: 6, name_ar: "القللي", name_en: "Al Qalaly" },
      { id: 96, city_id: 6, name_ar: "عزبة البرقي", name_en: "Ezbet Al Barqy" },
      { id: 97, city_id: 6, name_ar: "سوق الخميس", name_en: "Souq Al Khamis" },
      {
        id: 98,
        city_id: 6,
        name_ar: "ميدان ابن سندر",
        name_en: "Ibn Sendar Square",
      },
      { id: 99, city_id: 6, name_ar: "شارع الدرس", name_en: "Al Dars Street" },
      {
        id: 100,
        city_id: 6,
        name_ar: "شارع الأشراف",
        name_en: "Al Ashraf Street",
      },

      // الدرب الاحمر (id: 7)
      {
        id: 101,
        city_id: 7,
        name_ar: "الدرب الأحمر",
        name_en: "Al Darb Al Ahmar",
      },
      { id: 102, city_id: 7, name_ar: "باب زويلة", name_en: "Bab Zuweila" },
      { id: 103, city_id: 7, name_ar: "الخيامية", name_en: "Al Khayamiya" },
      { id: 104, city_id: 7, name_ar: "التبانة", name_en: "Al Tabana" },
      { id: 105, city_id: 7, name_ar: "سوق السلاح", name_en: "Souq Al Silah" },
      { id: 106, city_id: 7, name_ar: "الجرايح", name_en: "Al Garayeh" },
      { id: 107, city_id: 7, name_ar: "تحت الربع", name_en: "Taht Al Rabaa" },
      { id: 108, city_id: 7, name_ar: "عطفة الجمل", name_en: "Atfet Al Gamal" },
      {
        id: 109,
        city_id: 7,
        name_ar: "شارع السكرية",
        name_en: "Al Sokaria Street",
      },
      {
        id: 110,
        city_id: 7,
        name_ar: "شارع القربية",
        name_en: "Al Qarafea Street",
      },
      {
        id: 111,
        city_id: 7,
        name_ar: "شارع باب الوزير",
        name_en: "Bab Al Wazir Street",
      },
      { id: 112, city_id: 7, name_ar: "حارة الروم", name_en: "Haret Al Roum" },
      { id: 113, city_id: 7, name_ar: "الصبان", name_en: "Al Sabban" },
      { id: 114, city_id: 7, name_ar: "سوق القماش", name_en: "Souq Al Qumash" },
      { id: 115, city_id: 7, name_ar: "باب الخلق", name_en: "Bab Al Khalq" },

      // الزاوية الحمراء (id: 8)
      {
        id: 116,
        city_id: 8,
        name_ar: "الزاوية الحمراء",
        name_en: "Zawya Al Hamra",
      },
      { id: 117, city_id: 8, name_ar: "الساحل", name_en: "Al Sahel" },
      { id: 118, city_id: 8, name_ar: "مسطرد", name_en: "Mostorod" },
      { id: 119, city_id: 8, name_ar: "المطرية", name_en: "Matareya" },
      {
        id: 120,
        city_id: 8,
        name_ar: "عزبة الهجانة",
        name_en: "Ezbet Al Hagana",
      },
      {
        id: 121,
        city_id: 8,
        name_ar: "منشية الساحل",
        name_en: "Mansheyat Al Sahel",
      },
      { id: 122, city_id: 8, name_ar: "عزبة النخل", name_en: "Ezbet Al Nakhl" },
      {
        id: 123,
        city_id: 8,
        name_ar: "أرض الخيالة",
        name_en: "Ard Al Khayala",
      },
      {
        id: 124,
        city_id: 8,
        name_ar: "حدائق الزاوية",
        name_en: "Hadayek Al Zawya",
      },
      { id: 125, city_id: 8, name_ar: "الشرابية", name_en: "Al Sharabiya" },
      { id: 126, city_id: 8, name_ar: "القلج", name_en: "Al Qalag" },
      { id: 127, city_id: 8, name_ar: "عزبة رستم", name_en: "Ezbet Rostom" },
      {
        id: 128,
        city_id: 8,
        name_ar: "عزبة جب الله",
        name_en: "Ezbet Gaballah",
      },
      {
        id: 129,
        city_id: 8,
        name_ar: "محطة الزاوية",
        name_en: "Zawya Station",
      },
      {
        id: 130,
        city_id: 8,
        name_ar: "كوبري القبة",
        name_en: "Kobri Al Kobba",
      },

      // الزيتون (id: 9)
      {
        id: 131,
        city_id: 9,
        name_ar: "الزيتون الشرقية",
        name_en: "Zaytoun East",
      },
      {
        id: 132,
        city_id: 9,
        name_ar: "الزيتون الغربية",
        name_en: "Zaytoun West",
      },
      { id: 133, city_id: 9, name_ar: "المرج", name_en: "Al Marg" },
      {
        id: 134,
        city_id: 9,
        name_ar: "حدائق الزيتون",
        name_en: "Hadayek Al Zaytoun",
      },
      { id: 135, city_id: 9, name_ar: "أرض الإسكان", name_en: "Ard Al Iskan" },
      {
        id: 136,
        city_id: 9,
        name_ar: "عزبة أبو حشيش",
        name_en: "Ezbet Abo Hasheesh",
      },
      { id: 137, city_id: 9, name_ar: "المنشية", name_en: "Al Mansheya" },
      {
        id: 138,
        city_id: 9,
        name_ar: "كوبري القبة",
        name_en: "Kobri Al Kobba",
      },
      {
        id: 139,
        city_id: 9,
        name_ar: "شارع مصر والسودان",
        name_en: "Masr Wal Sudan Street",
      },
      {
        id: 140,
        city_id: 9,
        name_ar: "شارع جسر السويس",
        name_en: "Gisr Al Suez Street",
      },
      {
        id: 141,
        city_id: 9,
        name_ar: "شارع الحجاز",
        name_en: "Al Hegaz Street",
      },
      {
        id: 142,
        city_id: 9,
        name_ar: "شارع طومان باي",
        name_en: "Touman Bay Street",
      },
      {
        id: 143,
        city_id: 9,
        name_ar: "ميدان الزيتون",
        name_en: "Zaytoun Square",
      },
      { id: 144, city_id: 9, name_ar: "أرض الجولف", name_en: "Ard Al Golf" },
      {
        id: 145,
        city_id: 9,
        name_ar: "مساكن الزيتون",
        name_en: "Zaytoun Housing",
      },

      // الساحل (id: 10)
      {
        id: 146,
        city_id: 10,
        name_ar: "الساحل الشمالي",
        name_en: "Al Sahel Al Shomali",
      },
      {
        id: 147,
        city_id: 10,
        name_ar: "الساحل الجنوبي",
        name_en: "Al Sahel Al Ganoubi",
      },
      {
        id: 148,
        city_id: 10,
        name_ar: "منشية الساحل",
        name_en: "Mansheyat Al Sahel",
      },
      { id: 149, city_id: 10, name_ar: "كفر الساحل", name_en: "Kafr Al Sahel" },
      {
        id: 150,
        city_id: 10,
        name_ar: "عزبة الساحل",
        name_en: "Ezbet Al Sahel",
      },
      {
        id: 151,
        city_id: 10,
        name_ar: "مساكن الضباط",
        name_en: "Zabateen Housing",
      },
      {
        id: 152,
        city_id: 10,
        name_ar: "مساكن المحافظة",
        name_en: "Al Mohafza Housing",
      },
      { id: 153, city_id: 10, name_ar: "عزبة جعفر", name_en: "Ezbet Gaafar" },
      { id: 154, city_id: 10, name_ar: "عزبة عطية", name_en: "Ezbet Atteya" },
      { id: 155, city_id: 10, name_ar: "الخلفاوي", name_en: "Al Khlfawy" },
      {
        id: 156,
        city_id: 10,
        name_ar: "ترعة الساحل",
        name_en: "Al Sahel Canal",
      },
      {
        id: 157,
        city_id: 10,
        name_ar: "شارع الساحل",
        name_en: "Al Sahel Street",
      },
      {
        id: 158,
        city_id: 10,
        name_ar: "شارع ترعة الجبل",
        name_en: "Ter'et Al Gabal Street",
      },
      {
        id: 159,
        city_id: 10,
        name_ar: "ميدان الساحل",
        name_en: "Al Sahel Square",
      },
      {
        id: 160,
        city_id: 10,
        name_ar: "كوبري الساحل",
        name_en: "Al Sahel Bridge",
      },

      // السلام (id: 11)
      {
        id: 161,
        city_id: 11,
        name_ar: "السلام الأول",
        name_en: "Al Salam First",
      },
      {
        id: 162,
        city_id: 11,
        name_ar: "السلام الثاني",
        name_en: "Al Salam Second",
      },
      {
        id: 163,
        city_id: 11,
        name_ar: "السلام الثالث",
        name_en: "Al Salam Third",
      },
      {
        id: 164,
        city_id: 11,
        name_ar: "عزبة النخل",
        name_en: "Ezbet Al Nakhl",
      },
      {
        id: 165,
        city_id: 11,
        name_ar: "منشية السلام",
        name_en: "Mansheyat Al Salam",
      },
      {
        id: 166,
        city_id: 11,
        name_ar: "مساكن السلام",
        name_en: "Al Salam Housing",
      },
      { id: 167, city_id: 11, name_ar: "أرض الجمعية", name_en: "Ard Al Gamaa" },
      {
        id: 168,
        city_id: 11,
        name_ar: "حدائق السلام",
        name_en: "Hadayek Al Salam",
      },
      { id: 169, city_id: 11, name_ar: "المسلة", name_en: "Al Masalla" },
      {
        id: 170,
        city_id: 11,
        name_ar: "كفر أبو صير",
        name_en: "Kafr Abou Seir",
      },
      {
        id: 171,
        city_id: 11,
        name_ar: "عزبة أبو صير",
        name_en: "Ezbet Abou Seir",
      },
      {
        id: 172,
        city_id: 11,
        name_ar: "عزبة الصفيح",
        name_en: "Ezbet Al Safeeh",
      },
      {
        id: 173,
        city_id: 11,
        name_ar: "عزبة السكة الحديد",
        name_en: "Ezbet Al Sikka Al Hadeed",
      },
      {
        id: 174,
        city_id: 11,
        name_ar: "شارع السلام",
        name_en: "Al Salam Street",
      },
      {
        id: 175,
        city_id: 11,
        name_ar: "شارع جسر السويس",
        name_en: "Gisr Al Suez Street",
      },

      // السيدة زينب (id: 12)
      {
        id: 176,
        city_id: 12,
        name_ar: "السيدة زينب",
        name_en: "Sayeda Zeinab",
      },
      { id: 177, city_id: 12, name_ar: "الناصرية", name_en: "Al Naseria" },
      { id: 178, city_id: 12, name_ar: "باب الخلق", name_en: "Bab Al Khalq" },
      {
        id: 179,
        city_id: 12,
        name_ar: "السيدة عائشة",
        name_en: "Sayeda Aisha",
      },
      { id: 180, city_id: 12, name_ar: "الجزيرة", name_en: "Al Gazira" },
      { id: 181, city_id: 12, name_ar: "القللي", name_en: "Al Qalaly" },
      { id: 182, city_id: 12, name_ar: "الفرج", name_en: "Al Farag" },
      { id: 183, city_id: 12, name_ar: "الروضة", name_en: "Al Rawda" },
      { id: 184, city_id: 12, name_ar: "المنيل", name_en: "Al Manyal" },
      { id: 185, city_id: 12, name_ar: "قصر العيني", name_en: "Kasr Al Ainy" },
      {
        id: 186,
        city_id: 12,
        name_ar: "شارع السيدة زينب",
        name_en: "Sayeda Zeinab Street",
      },
      {
        id: 187,
        city_id: 12,
        name_ar: "شارع التونسي",
        name_en: "Al Tounsi Street",
      },
      {
        id: 188,
        city_id: 12,
        name_ar: "شارع مجلس الشعب",
        name_en: "Magles Al Shaab Street",
      },
      {
        id: 189,
        city_id: 12,
        name_ar: "شارع بورسعيد",
        name_en: "Port Said Street",
      },
      {
        id: 190,
        city_id: 12,
        name_ar: "ميدان السيدة زينب",
        name_en: "Sayeda Zeinab Square",
      },

      // الشرابية (id: 13)
      { id: 191, city_id: 13, name_ar: "الشرابية", name_en: "Al Sharabiya" },
      {
        id: 192,
        city_id: 13,
        name_ar: "الزاوية الحمراء",
        name_en: "Zawya Al Hamra",
      },
      { id: 193, city_id: 13, name_ar: "الساحل", name_en: "Al Sahel" },
      { id: 194, city_id: 13, name_ar: "مسطرد", name_en: "Mostorod" },
      {
        id: 195,
        city_id: 13,
        name_ar: "أرض الخيالة",
        name_en: "Ard Al Khayala",
      },
      {
        id: 196,
        city_id: 13,
        name_ar: "عزبة أبو حشيش",
        name_en: "Ezbet Abo Hasheesh",
      },
      {
        id: 197,
        city_id: 13,
        name_ar: "منشية الساحل",
        name_en: "Mansheyat Al Sahel",
      },
      {
        id: 198,
        city_id: 13,
        name_ar: "عزبة الصفيح",
        name_en: "Ezbet Al Safeeh",
      },
      {
        id: 199,
        city_id: 13,
        name_ar: "محطة الشرابية",
        name_en: "Sharabiya Station",
      },
      {
        id: 200,
        city_id: 13,
        name_ar: "كوبري الشرابية",
        name_en: "Sharabiya Bridge",
      },
      {
        id: 201,
        city_id: 13,
        name_ar: "شارع الشرابية",
        name_en: "Al Sharabiya Street",
      },
      {
        id: 202,
        city_id: 13,
        name_ar: "شارع السكة الحديد",
        name_en: "Al Sikka Al Hadeed Street",
      },
      {
        id: 203,
        city_id: 13,
        name_ar: "عزبة جب الله",
        name_en: "Ezbet Gaballah",
      },
      { id: 204, city_id: 13, name_ar: "عزبة رستم", name_en: "Ezbet Rostom" },
      {
        id: 205,
        city_id: 13,
        name_ar: "عزبة فرج الله",
        name_en: "Ezbet Faragallah",
      },

      // مدينة الشروق (id: 14)
      {
        id: 206,
        city_id: 14,
        name_ar: "الحي الأول - الشروق",
        name_en: "First District - Shorouk",
      },
      {
        id: 207,
        city_id: 14,
        name_ar: "الحي الثاني - الشروق",
        name_en: "Second District - Shorouk",
      },
      {
        id: 208,
        city_id: 14,
        name_ar: "الحي الثالث - الشروق",
        name_en: "Third District - Shorouk",
      },
      {
        id: 209,
        city_id: 14,
        name_ar: "الحي الرابع - الشروق",
        name_en: "Fourth District - Shorouk",
      },
      {
        id: 210,
        city_id: 14,
        name_ar: "الحي الخامس - الشروق",
        name_en: "Fifth District - Shorouk",
      },
      {
        id: 211,
        city_id: 14,
        name_ar: "الحي السادس - الشروق",
        name_en: "Sixth District - Shorouk",
      },
      {
        id: 212,
        city_id: 14,
        name_ar: "الحي السابع - الشروق",
        name_en: "Seventh District - Shorouk",
      },
      {
        id: 213,
        city_id: 14,
        name_ar: "الحي الثامن - الشروق",
        name_en: "Eighth District - Shorouk",
      },
      {
        id: 214,
        city_id: 14,
        name_ar: "الحي التاسع - الشروق",
        name_en: "Ninth District - Shorouk",
      },
      {
        id: 215,
        city_id: 14,
        name_ar: "الحي العاشر - الشروق",
        name_en: "Tenth District - Shorouk",
      },
      {
        id: 216,
        city_id: 14,
        name_ar: "الحي الحادي عشر - الشروق",
        name_en: "Eleventh District - Shorouk",
      },
      {
        id: 217,
        city_id: 14,
        name_ar: "الحي الثاني عشر - الشروق",
        name_en: "Twelfth District - Shorouk",
      },
      {
        id: 218,
        city_id: 14,
        name_ar: "الحي الثالث عشر - الشروق",
        name_en: "Thirteenth District - Shorouk",
      },
      {
        id: 219,
        city_id: 14,
        name_ar: "الحي الرابع عشر - الشروق",
        name_en: "Fourteenth District - Shorouk",
      },
      {
        id: 220,
        city_id: 14,
        name_ar: "المنطقة الصناعية - الشروق",
        name_en: "Industrial Zone - Shorouk",
      },

      // الظاهر (id: 15)
      { id: 221, city_id: 15, name_ar: "الظاهر", name_en: "Al Daher" },
      { id: 222, city_id: 15, name_ar: "العباسية", name_en: "Al Abaseya" },
      { id: 223, city_id: 15, name_ar: "الوايلي", name_en: "Al Waily" },
      { id: 224, city_id: 15, name_ar: "غمرة", name_en: "Ghamra" },
      { id: 225, city_id: 15, name_ar: "الحلمية", name_en: "Helmeya" },
      {
        id: 226,
        city_id: 15,
        name_ar: "عزبة الهجانة",
        name_en: "Ezbet Al Hagana",
      },
      {
        id: 227,
        city_id: 15,
        name_ar: "شارع كلوت بك",
        name_en: "Clot Bey Street",
      },
      { id: 228, city_id: 15, name_ar: "شارع رمسيس", name_en: "Ramses Street" },
      {
        id: 229,
        city_id: 15,
        name_ar: "شارع الجيش",
        name_en: "Al Geish Street",
      },
      {
        id: 230,
        city_id: 15,
        name_ar: "شارع الظاهر",
        name_en: "Al Daher Street",
      },
      {
        id: 231,
        city_id: 15,
        name_ar: "ميدان الظاهر",
        name_en: "Al Daher Square",
      },
      {
        id: 232,
        city_id: 15,
        name_ar: "ميدان العباسية",
        name_en: "Al Abaseya Square",
      },
      {
        id: 233,
        city_id: 15,
        name_ar: "شارع عبد المنعم رياض",
        name_en: "Abdel Moneim Riyad Street",
      },
      { id: 234, city_id: 15, name_ar: "شارع رضوان", name_en: "Radwan Street" },
      {
        id: 235,
        city_id: 15,
        name_ar: "شارع المطرية",
        name_en: "Matareya Street",
      },

      // العتبة (id: 16)
      { id: 236, city_id: 16, name_ar: "العتبة", name_en: "Ataba" },
      {
        id: 237,
        city_id: 16,
        name_ar: "ميدان العتبة",
        name_en: "Ataba Square",
      },
      {
        id: 238,
        city_id: 16,
        name_ar: "شارع الأزهر",
        name_en: "Al Azhar Street",
      },
      {
        id: 239,
        city_id: 16,
        name_ar: "شارع محمد علي",
        name_en: "Mohamed Aly Street",
      },
      {
        id: 240,
        city_id: 16,
        name_ar: "شارع جوهر القائد",
        name_en: "Gawhar Al Kaed Street",
      },
      {
        id: 241,
        city_id: 16,
        name_ar: "شارع بورسعيد",
        name_en: "Port Said Street",
      },
      {
        id: 242,
        city_id: 16,
        name_ar: "شارع كلوت بك",
        name_en: "Clot Bey Street",
      },
      {
        id: 243,
        city_id: 16,
        name_ar: "شارع الجمهورية",
        name_en: "Al Gomhoreya Street",
      },
      {
        id: 244,
        city_id: 16,
        name_ar: "شارع الجيش",
        name_en: "Al Geish Street",
      },
      {
        id: 245,
        city_id: 16,
        name_ar: "شارع القللي",
        name_en: "Al Qalaly Street",
      },
      {
        id: 246,
        city_id: 16,
        name_ar: "شارع الفجالة",
        name_en: "Al Faggala Street",
      },
      {
        id: 247,
        city_id: 16,
        name_ar: "شارع نجيب الريحاني",
        name_en: "Naguib El Rihani Street",
      },
      { id: 248, city_id: 16, name_ar: "سوق العتبة", name_en: "Ataba Market" },
      {
        id: 249,
        city_id: 16,
        name_ar: "مجمع العتبة",
        name_en: "Ataba Complex",
      },
      {
        id: 250,
        city_id: 16,
        name_ar: "عمارات العتبة",
        name_en: "Ataba Buildings",
      },

      // القاهرة الجديدة (id: 17)
      {
        id: 251,
        city_id: 17,
        name_ar: "الحي الأول - القاهرة الجديدة",
        name_en: "First District - New Cairo",
      },
      {
        id: 252,
        city_id: 17,
        name_ar: "الحي الثاني - القاهرة الجديدة",
        name_en: "Second District - New Cairo",
      },
      {
        id: 253,
        city_id: 17,
        name_ar: "الحي الثالث - القاهرة الجديدة",
        name_en: "Third District - New Cairo",
      },
      {
        id: 254,
        city_id: 17,
        name_ar: "الحي الرابع - القاهرة الجديدة",
        name_en: "Fourth District - New Cairo",
      },
      {
        id: 255,
        city_id: 17,
        name_ar: "الحي الخامس - القاهرة الجديدة",
        name_en: "Fifth District - New Cairo",
      },
      {
        id: 256,
        city_id: 17,
        name_ar: "التجمع الأول",
        name_en: "First Settlement",
      },
      {
        id: 257,
        city_id: 17,
        name_ar: "التجمع الثاني",
        name_en: "Second Settlement",
      },
      {
        id: 258,
        city_id: 17,
        name_ar: "التجمع الثالث",
        name_en: "Third Settlement",
      },
      {
        id: 259,
        city_id: 17,
        name_ar: "التجمع الخامس",
        name_en: "Fifth Settlement",
      },
      { id: 260, city_id: 17, name_ar: "الرحاب", name_en: "Rehab" },
      { id: 261, city_id: 17, name_ar: "مدينتي", name_en: "Madinty" },
      { id: 262, city_id: 17, name_ar: "القطامية", name_en: "Katameya" },
      { id: 263, city_id: 17, name_ar: "النرجس", name_en: "Al Narges" },
      { id: 264, city_id: 17, name_ar: "الياسمين", name_en: "Al Yasmeen" },
      { id: 265, city_id: 17, name_ar: "البنفسج", name_en: "Al Banafseg" },
      { id: 266, city_id: 17, name_ar: "الندى", name_en: "Al Nada" },
      { id: 267, city_id: 17, name_ar: "الأندلس", name_en: "Al Andalus" },
      { id: 268, city_id: 17, name_ar: "الفل", name_en: "Al Full" },
      { id: 269, city_id: 17, name_ar: "الأكاسيا", name_en: "Acacia" },
      { id: 270, city_id: 17, name_ar: "جنات", name_en: "Gannat" },
      {
        id: 271,
        city_id: 17,
        name_ar: "بيتا المنطقة السادسة",
        name_en: "Beta District 6",
      },
      {
        id: 272,
        city_id: 17,
        name_ar: "بيتا المنطقة السابعة",
        name_en: "Beta District 7",
      },
      {
        id: 273,
        city_id: 17,
        name_ar: "بيتا المنطقة الثامنة",
        name_en: "Beta District 8",
      },
      {
        id: 274,
        city_id: 17,
        name_ar: "بيتا المنطقة التاسعة",
        name_en: "Beta District 9",
      },
      {
        id: 275,
        city_id: 17,
        name_ar: "بيتا المنطقة العاشرة",
        name_en: "Beta District 10",
      },
      {
        id: 276,
        city_id: 17,
        name_ar: "بيتا المنطقة الحادية عشر",
        name_en: "Beta District 11",
      },
      {
        id: 277,
        city_id: 17,
        name_ar: "بيتا المنطقة الثانية عشر",
        name_en: "Beta District 12",
      },
      {
        id: 278,
        city_id: 17,
        name_ar: "بيتا المنطقة الثالثة عشر",
        name_en: "Beta District 13",
      },
      {
        id: 279,
        city_id: 17,
        name_ar: "بيتا المنطقة الرابعة عشر",
        name_en: "Beta District 14",
      },
      {
        id: 280,
        city_id: 17,
        name_ar: "بيتا المنطقة الخامسة عشر",
        name_en: "Beta District 15",
      },
      {
        id: 281,
        city_id: 17,
        name_ar: "بيتا المنطقة السادسة عشر",
        name_en: "Beta District 16",
      },
      {
        id: 282,
        city_id: 17,
        name_ar: "بيتا المنطقة السابعة عشر",
        name_en: "Beta District 17",
      },
      {
        id: 283,
        city_id: 17,
        name_ar: "بيتا المنطقة الثامنة عشر",
        name_en: "Beta District 18",
      },
      {
        id: 284,
        city_id: 17,
        name_ar: "بيتا المنطقة التاسعة عشر",
        name_en: "Beta District 19",
      },
      {
        id: 285,
        city_id: 17,
        name_ar: "بيتا المنطقة العشرون",
        name_en: "Beta District 20",
      },
      {
        id: 286,
        city_id: 17,
        name_ar: "جامعة الأمريكية",
        name_en: "American University",
      },
      {
        id: 287,
        city_id: 17,
        name_ar: "مستشفى 57357",
        name_en: "57357 Hospital",
      },
      {
        id: 288,
        city_id: 17,
        name_ar: "المنطقة الصناعية - القاهرة الجديدة",
        name_en: "Industrial Zone - New Cairo",
      },
      {
        id: 289,
        city_id: 17,
        name_ar: "المنطقة الحرفية - القاهرة الجديدة",
        name_en: "Crafts Zone - New Cairo",
      },
      {
        id: 290,
        city_id: 17,
        name_ar: "المنطقة التجارية - القاهرة الجديدة",
        name_en: "Commercial Zone - New Cairo",
      },

      // المرج (id: 18)
      { id: 291, city_id: 18, name_ar: "المرج القديمة", name_en: "Old Marg" },
      { id: 292, city_id: 18, name_ar: "المرج الجديدة", name_en: "New Marg" },
      {
        id: 293,
        city_id: 18,
        name_ar: "عزبة النخل",
        name_en: "Ezbet Al Nakhl",
      },
      {
        id: 294,
        city_id: 18,
        name_ar: "منشية المرج",
        name_en: "Mansheyat Al Marg",
      },
      {
        id: 295,
        city_id: 18,
        name_ar: "كفر أبو صير",
        name_en: "Kafr Abou Seir",
      },
      {
        id: 296,
        city_id: 18,
        name_ar: "عزبة أبو صير",
        name_en: "Ezbet Abou Seir",
      },
      {
        id: 297,
        city_id: 18,
        name_ar: "عزبة الصفيح",
        name_en: "Ezbet Al Safeeh",
      },
      {
        id: 298,
        city_id: 18,
        name_ar: "عزبة جب الله",
        name_en: "Ezbet Gaballah",
      },
      { id: 299, city_id: 18, name_ar: "عزبة رستم", name_en: "Ezbet Rostom" },
      {
        id: 300,
        city_id: 18,
        name_ar: "عزبة فرج الله",
        name_en: "Ezbet Faragallah",
      },
      {
        id: 301,
        city_id: 18,
        name_ar: "شارع المرج",
        name_en: "Al Marg Street",
      },
      {
        id: 302,
        city_id: 18,
        name_ar: "شارع جسر السويس",
        name_en: "Gisr Al Suez Street",
      },
      {
        id: 303,
        city_id: 18,
        name_ar: "شارع مصر والسودان",
        name_en: "Masr Wal Sudan Street",
      },
      {
        id: 304,
        city_id: 18,
        name_ar: "ميدان المرج",
        name_en: "Al Marg Square",
      },
      { id: 305, city_id: 18, name_ar: "محطة المرج", name_en: "Marg Station" },

      // عزبة النخل (id: 19)
      {
        id: 306,
        city_id: 19,
        name_ar: "عزبة النخل",
        name_en: "Ezbet Al Nakhl",
      },
      {
        id: 307,
        city_id: 19,
        name_ar: "كفر أبو صير",
        name_en: "Kafr Abou Seir",
      },
      {
        id: 308,
        city_id: 19,
        name_ar: "عزبة الصفيح",
        name_en: "Ezbet Al Safeeh",
      },
      {
        id: 309,
        city_id: 19,
        name_ar: "عزبة جب الله",
        name_en: "Ezbet Gaballah",
      },
      { id: 310, city_id: 19, name_ar: "عزبة رستم", name_en: "Ezbet Rostom" },
      {
        id: 311,
        city_id: 19,
        name_ar: "عزبة فرج الله",
        name_en: "Ezbet Faragallah",
      },
      {
        id: 312,
        city_id: 19,
        name_ar: "عزبة أبو حشيش",
        name_en: "Ezbet Abo Hasheesh",
      },
      {
        id: 313,
        city_id: 19,
        name_ar: "شارع جسر السويس",
        name_en: "Gisr Al Suez Street",
      },
      {
        id: 314,
        city_id: 19,
        name_ar: "شارع مصر والسودان",
        name_en: "Masr Wal Sudan Street",
      },
      {
        id: 315,
        city_id: 19,
        name_ar: "شارع عزبة النخل",
        name_en: "Ezbet Al Nakhl Street",
      },

      // المطرية (id: 20)
      { id: 316, city_id: 20, name_ar: "المطرية", name_en: "Matareya" },
      {
        id: 317,
        city_id: 20,
        name_ar: "عزبة النخل",
        name_en: "Ezbet Al Nakhl",
      },
      { id: 318, city_id: 20, name_ar: "مسطرد", name_en: "Mostorod" },
      {
        id: 319,
        city_id: 20,
        name_ar: "كوبري المطرية",
        name_en: "Matareya Bridge",
      },
      {
        id: 320,
        city_id: 20,
        name_ar: "ميدان المطرية",
        name_en: "Matareya Square",
      },
      {
        id: 321,
        city_id: 20,
        name_ar: "شارع المطرية",
        name_en: "Matareya Street",
      },
      {
        id: 322,
        city_id: 20,
        name_ar: "شارع جسر السويس",
        name_en: "Gisr Al Suez Street",
      },
      {
        id: 323,
        city_id: 20,
        name_ar: "شارع مصر والسودان",
        name_en: "Masr Wal Sudan Street",
      },
      {
        id: 324,
        city_id: 20,
        name_ar: "شارع ترعة الجبل",
        name_en: "Ter'et Al Gabal Street",
      },
      {
        id: 325,
        city_id: 20,
        name_ar: "منطقة المسلة",
        name_en: "Al Masalla Area",
      },
      {
        id: 326,
        city_id: 20,
        name_ar: "مسلة المطرية",
        name_en: "Matareya Obelisk",
      },
      {
        id: 327,
        city_id: 20,
        name_ar: "حدائق المطرية",
        name_en: "Hadayek Matareya",
      },
      {
        id: 328,
        city_id: 20,
        name_ar: "عزبة المطرية",
        name_en: "Ezbet Matareya",
      },
      {
        id: 329,
        city_id: 20,
        name_ar: "كفر المطرية",
        name_en: "Kafr Matareya",
      },
      {
        id: 330,
        city_id: 20,
        name_ar: "عزبة أبو حشيش",
        name_en: "Ezbet Abo Hasheesh",
      },

      // المعادي (id: 21)
      {
        id: 331,
        city_id: 21,
        name_ar: "المعادي القديمة",
        name_en: "Old Maadi",
      },
      {
        id: 332,
        city_id: 21,
        name_ar: "حدائق المعادي",
        name_en: "Hadayek Al Maadi",
      },
      {
        id: 333,
        city_id: 21,
        name_ar: "زهراء المعادي",
        name_en: "Zahraa Al Maadi",
      },
      {
        id: 334,
        city_id: 21,
        name_ar: "المعادي الجديدة",
        name_en: "New Maadi",
      },
      { id: 335, city_id: 21, name_ar: "دجلة", name_en: "Digla" },
      { id: 336, city_id: 21, name_ar: "شارع 9", name_en: "Street 9" },
      { id: 337, city_id: 21, name_ar: "شارع 77", name_en: "Street 77" },
      { id: 338, city_id: 21, name_ar: "شارع 105", name_en: "Street 105" },
      { id: 339, city_id: 21, name_ar: "شارع 250", name_en: "Street 250" },
      {
        id: 340,
        city_id: 21,
        name_ar: "شارع النصر",
        name_en: "Al Nasr Street",
      },
      {
        id: 341,
        city_id: 21,
        name_ar: "شارع الجزائر",
        name_en: "Al Jazeer Street",
      },
      {
        id: 342,
        city_id: 21,
        name_ar: "شارع الأهرام",
        name_en: "Al Ahram Street",
      },
      {
        id: 343,
        city_id: 21,
        name_ar: "شارع اللاسلكي",
        name_en: "Al Laselky Street",
      },
      {
        id: 344,
        city_id: 21,
        name_ar: "شارع وادي النيل",
        name_en: "Wadi El Nil Street",
      },
      { id: 345, city_id: 21, name_ar: "شارع دجلة", name_en: "Digla Street" },
      { id: 346, city_id: 21, name_ar: "كوتسيكا", name_en: "Kotsika" },
      {
        id: 347,
        city_id: 21,
        name_ar: "عزبة نادي النيل",
        name_en: "Ezbet Nadi El Nil",
      },
      {
        id: 348,
        city_id: 21,
        name_ar: "الترعة السويس",
        name_en: "Al Ter'a Al Suez",
      },
      { id: 349, city_id: 21, name_ar: "أرض الجمعية", name_en: "Ard Al Gamaa" },
      {
        id: 350,
        city_id: 21,
        name_ar: "نزلة المعادي",
        name_en: "Nazlet Al Maadi",
      },

      // المعصرة (id: 22)
      { id: 351, city_id: 22, name_ar: "المعصرة", name_en: "Maasara" },
      { id: 352, city_id: 22, name_ar: "كفر العلو", name_en: "Kafr Al Olow" },
      { id: 353, city_id: 22, name_ar: "التبين", name_en: "Tebin" },
      { id: 354, city_id: 22, name_ar: "وادي حوف", name_en: "Wadi Hof" },
      {
        id: 355,
        city_id: 22,
        name_ar: "عزبة خير الله",
        name_en: "Ezbet Khairallah",
      },
      {
        id: 356,
        city_id: 22,
        name_ar: "كفر أبو الخير",
        name_en: "Kafr Abou El Kheir",
      },
      {
        id: 357,
        city_id: 22,
        name_ar: "مساكن المعصرة",
        name_en: "Maasara Housing",
      },
      { id: 358, city_id: 22, name_ar: "الصلاحيات", name_en: "Al Salahiyat" },
      {
        id: 359,
        city_id: 22,
        name_ar: "الكوم الأحمر",
        name_en: "Al Kom Al Ahmar",
      },
      { id: 360, city_id: 22, name_ar: "عزبة عقل", name_en: "Ezbet Akl" },

      // المقطم (id: 23)
      { id: 361, city_id: 23, name_ar: "المقطم", name_en: "Mokattam" },
      {
        id: 362,
        city_id: 23,
        name_ar: "هضبة المقطم",
        name_en: "Mokattam Plateau",
      },
      {
        id: 363,
        city_id: 23,
        name_ar: "الوفاء والأمل",
        name_en: "Wafa'a Wal Amal",
      },
      { id: 364, city_id: 23, name_ar: "المرج", name_en: "Al Marg" },
      {
        id: 365,
        city_id: 23,
        name_ar: "عزبة خير الله",
        name_en: "Ezbet Khairallah",
      },
      {
        id: 366,
        city_id: 23,
        name_ar: "منشية ناصر",
        name_en: "Mansheyat Naser",
      },
      { id: 367, city_id: 23, name_ar: "الدويقة", name_en: "Al Dweqa" },
      {
        id: 368,
        city_id: 23,
        name_ar: "السبع بنات",
        name_en: "Al Sabaa Banat",
      },
      {
        id: 369,
        city_id: 23,
        name_ar: "عزبة الوالدة",
        name_en: "Ezbet Al Walda",
      },
      {
        id: 370,
        city_id: 23,
        name_ar: "شارع 9 - المقطم",
        name_en: "Street 9 - Mokattam",
      },
      {
        id: 371,
        city_id: 23,
        name_ar: "شارع النصر - المقطم",
        name_en: "Al Nasr Street - Mokattam",
      },
      {
        id: 372,
        city_id: 23,
        name_ar: "كمبوندات المقطم",
        name_en: "Mokattam Compounds",
      },

      // المنيل (id: 24)
      { id: 373, city_id: 24, name_ar: "المنيل", name_en: "Manyal" },
      { id: 374, city_id: 24, name_ar: "الروضة", name_en: "Al Rawda" },
      {
        id: 375,
        city_id: 24,
        name_ar: "السيدة زينب",
        name_en: "Sayeda Zeinab",
      },
      { id: 376, city_id: 24, name_ar: "قصر العيني", name_en: "Kasr Al Ainy" },
      {
        id: 377,
        city_id: 24,
        name_ar: "جامعة القاهرة",
        name_en: "Cairo University",
      },
      {
        id: 378,
        city_id: 24,
        name_ar: "شارع المنيل",
        name_en: "Manyal Street",
      },
      {
        id: 379,
        city_id: 24,
        name_ar: "كوبري المنيل",
        name_en: "Manyal Bridge",
      },
      {
        id: 380,
        city_id: 24,
        name_ar: "ميدان المنيل",
        name_en: "Manyal Square",
      },
      {
        id: 381,
        city_id: 24,
        name_ar: "شارع التونسي",
        name_en: "Al Tounsi Street",
      },
      {
        id: 382,
        city_id: 24,
        name_ar: "شارع مجلس الشعب",
        name_en: "Magles Al Shaab Street",
      },

      // الموسكي (id: 25)
      { id: 383, city_id: 25, name_ar: "الموسكي", name_en: "Mosky" },
      { id: 384, city_id: 25, name_ar: "العتبة", name_en: "Ataba" },
      {
        id: 385,
        city_id: 25,
        name_ar: "شارع الأزهر",
        name_en: "Al Azhar Street",
      },
      {
        id: 386,
        city_id: 25,
        name_ar: "شارع جوهر القائد",
        name_en: "Gawhar Al Kaed Street",
      },
      {
        id: 387,
        city_id: 25,
        name_ar: "شارع محمد علي",
        name_en: "Mohamed Aly Street",
      },
      {
        id: 388,
        city_id: 25,
        name_ar: "شارع بورسعيد",
        name_en: "Port Said Street",
      },
      {
        id: 389,
        city_id: 25,
        name_ar: "شارع الجيش",
        name_en: "Al Geish Street",
      },
      { id: 390, city_id: 25, name_ar: "سوق الموسكي", name_en: "Mosky Market" },
      {
        id: 391,
        city_id: 25,
        name_ar: "وكالة البلح",
        name_en: "Wekalet Al Balah",
      },
      { id: 392, city_id: 25, name_ar: "الغورية", name_en: "Al Ghourya" },

      // النزهة (id: 26)
      { id: 393, city_id: 26, name_ar: "النزهة الجديدة", name_en: "New Nozha" },
      { id: 394, city_id: 26, name_ar: "النزهة القديمة", name_en: "Old Nozha" },
      { id: 395, city_id: 26, name_ar: "مصر الجديدة", name_en: "Heliopolis" },
      { id: 396, city_id: 26, name_ar: "الشيراتون", name_en: "Sheraton" },
      { id: 397, city_id: 26, name_ar: "الألف مسكن", name_en: "Alf Maskan" },
      {
        id: 398,
        city_id: 26,
        name_ar: "مساكن شيراتون",
        name_en: "Sheraton Housing",
      },
      { id: 399, city_id: 26, name_ar: "شارع النزهة", name_en: "Nozha Street" },
      {
        id: 400,
        city_id: 26,
        name_ar: "شارع عبد الحميد بدوي",
        name_en: "Abdel Hamid Badawy Street",
      },
      {
        id: 401,
        city_id: 26,
        name_ar: "شارع مكرم عبيد",
        name_en: "Makram Ebeid Street",
      },
      {
        id: 402,
        city_id: 26,
        name_ar: "شارع حسن مأمون",
        name_en: "Hasan Mamoun Street",
      },

      // الوايلي (id: 27)
      { id: 403, city_id: 27, name_ar: "الوايلي", name_en: "Waily" },
      { id: 404, city_id: 27, name_ar: "العباسية", name_en: "Al Abaseya" },
      { id: 405, city_id: 27, name_ar: "غمرة", name_en: "Ghamra" },
      { id: 406, city_id: 27, name_ar: "الحلمية", name_en: "Helmeya" },
      { id: 407, city_id: 27, name_ar: "الظاهر", name_en: "Al Daher" },
      {
        id: 408,
        city_id: 27,
        name_ar: "عزبة الهجانة",
        name_en: "Ezbet Al Hagana",
      },
      {
        id: 409,
        city_id: 27,
        name_ar: "شارع العباسية",
        name_en: "Al Abaseya Street",
      },
      {
        id: 410,
        city_id: 27,
        name_ar: "شارع كلوت بك",
        name_en: "Clot Bey Street",
      },
      { id: 411, city_id: 27, name_ar: "شارع رمسيس", name_en: "Ramses Street" },
      {
        id: 412,
        city_id: 27,
        name_ar: "ميدان العباسية",
        name_en: "Al Abaseya Square",
      },

      // باب الشعرية (id: 28)
      {
        id: 413,
        city_id: 28,
        name_ar: "باب الشعرية",
        name_en: "Bab Al Shereia",
      },
      { id: 414, city_id: 28, name_ar: "الحلمية", name_en: "Helmeya" },
      { id: 415, city_id: 28, name_ar: "الظاهر", name_en: "Al Daher" },
      { id: 416, city_id: 28, name_ar: "غمرة", name_en: "Ghamra" },
      {
        id: 417,
        city_id: 28,
        name_ar: "شارع الجيش",
        name_en: "Al Geish Street",
      },
      {
        id: 418,
        city_id: 28,
        name_ar: "شارع كلوت بك",
        name_en: "Clot Bey Street",
      },
      { id: 419, city_id: 28, name_ar: "شارع رمسيس", name_en: "Ramses Street" },
      {
        id: 420,
        city_id: 28,
        name_ar: "ميدان باب الشعرية",
        name_en: "Bab Al Shereia Square",
      },

      // بولاق (id: 29)
      {
        id: 421,
        city_id: 29,
        name_ar: "بولاق أبو العلا",
        name_en: "Bolaq Abou El Ala",
      },
      { id: 422, city_id: 29, name_ar: "الزمالك", name_en: "Zamalek" },
      { id: 423, city_id: 29, name_ar: "وسط البلد", name_en: "Downtown" },
      {
        id: 424,
        city_id: 29,
        name_ar: "شارع 26 يوليو",
        name_en: "26th of July Street",
      },
      { id: 425, city_id: 29, name_ar: "شارع رمسيس", name_en: "Ramses Street" },
      {
        id: 426,
        city_id: 29,
        name_ar: "شارع الجلاء",
        name_en: "Al Galaa Street",
      },
      {
        id: 427,
        city_id: 29,
        name_ar: "ميدان رمسيس",
        name_en: "Ramses Square",
      },
      {
        id: 428,
        city_id: 29,
        name_ar: "شارع المطار",
        name_en: "Al Matar Street",
      },

      // جاردن سيتي (id: 30)
      { id: 429, city_id: 30, name_ar: "جاردن سيتي", name_en: "Garden City" },
      {
        id: 430,
        city_id: 30,
        name_ar: "قصر الدوبارة",
        name_en: "Kasr Al Dobara",
      },
      {
        id: 431,
        city_id: 30,
        name_ar: "شارع قصر العيني",
        name_en: "Kasr Al Ainy Street",
      },
      {
        id: 432,
        city_id: 30,
        name_ar: "شارع الجلاء",
        name_en: "Al Galaa Street",
      },
      {
        id: 433,
        city_id: 30,
        name_ar: "شارع البرازيل",
        name_en: "Al Brazil Street",
      },
      {
        id: 434,
        city_id: 30,
        name_ar: "شارع إسماعيل محمد",
        name_en: "Ismail Mohamed Street",
      },
      {
        id: 435,
        city_id: 30,
        name_ar: "شارع أحمد حشمت",
        name_en: "Ahmed Heshmat Street",
      },

      // حدائق القبة (id: 31)
      {
        id: 436,
        city_id: 31,
        name_ar: "حدائق القبة",
        name_en: "Hadayek Al Kobba",
      },
      {
        id: 437,
        city_id: 31,
        name_ar: "كوبري القبة",
        name_en: "Kobri Al Kobba",
      },
      { id: 438, city_id: 31, name_ar: "الوايلي", name_en: "Al Waily" },
      { id: 439, city_id: 31, name_ar: "الزيتون", name_en: "Zaytoun" },
      {
        id: 440,
        city_id: 31,
        name_ar: "شارع مصر والسودان",
        name_en: "Masr Wal Sudan Street",
      },
      {
        id: 441,
        city_id: 31,
        name_ar: "شارع جسر السويس",
        name_en: "Gisr Al Suez Street",
      },
      {
        id: 442,
        city_id: 31,
        name_ar: "شارع الحجاز",
        name_en: "Al Hegaz Street",
      },
      {
        id: 443,
        city_id: 31,
        name_ar: "ميدان حدائق القبة",
        name_en: "Hadayek Al Kobba Square",
      },

      // حلوان (id: 32)
      { id: 444, city_id: 32, name_ar: "حلوان", name_en: "Helwan" },
      { id: 445, city_id: 32, name_ar: "عين حلوان", name_en: "Ain Helwan" },
      { id: 446, city_id: 32, name_ar: "وادي حوف", name_en: "Wadi Hof" },
      { id: 447, city_id: 32, name_ar: "كفر العلو", name_en: "Kafr Al Olow" },
      { id: 448, city_id: 32, name_ar: "التبين", name_en: "Tebin" },
      { id: 449, city_id: 32, name_ar: "المعصرة", name_en: "Maasara" },
      {
        id: 450,
        city_id: 32,
        name_ar: "عزبة خير الله",
        name_en: "Ezbet Khairallah",
      },
      {
        id: 451,
        city_id: 32,
        name_ar: "جامعة حلوان",
        name_en: "Helwan University",
      },
      {
        id: 452,
        city_id: 32,
        name_ar: "كورنيش النيل - حلوان",
        name_en: "Nile Corniche - Helwan",
      },
      {
        id: 453,
        city_id: 32,
        name_ar: "حمامات حلوان",
        name_en: "Helwan Baths",
      },

      // دار السلام (id: 33)
      { id: 454, city_id: 33, name_ar: "دار السلام", name_en: "Dar Al Salam" },
      { id: 455, city_id: 33, name_ar: "البساتين", name_en: "Al Basatin" },
      {
        id: 456,
        city_id: 33,
        name_ar: "عزبة خير الله",
        name_en: "Ezbet Khairallah",
      },
      { id: 457, city_id: 33, name_ar: "المعادي", name_en: "Maadi" },
      {
        id: 458,
        city_id: 33,
        name_ar: "حدائق المعادي",
        name_en: "Hadayek Al Maadi",
      },
      { id: 459, city_id: 33, name_ar: "كوتسيكا", name_en: "Kotsika" },

      // شبرا (id: 34)
      { id: 460, city_id: 34, name_ar: "شبرا", name_en: "Shubra" },
      {
        id: 461,
        city_id: 34,
        name_ar: "شبرا الخيمة",
        name_en: "Shubra Al Khaimah",
      },
      { id: 462, city_id: 34, name_ar: "روض الفرج", name_en: "Rod Al Farag" },
      { id: 463, city_id: 34, name_ar: "الشرابية", name_en: "Al Sharabiya" },
      { id: 464, city_id: 34, name_ar: "الساحل", name_en: "Al Sahel" },
      { id: 465, city_id: 34, name_ar: "ميدان شبرا", name_en: "Shubra Square" },
      { id: 466, city_id: 34, name_ar: "شارع شبرا", name_en: "Shubra Street" },
      {
        id: 467,
        city_id: 34,
        name_ar: "شارع ترعة الجبل",
        name_en: "Ter'et Al Gabal Street",
      },

      // طره (id: 35)
      { id: 468, city_id: 35, name_ar: "طره", name_en: "Tura" },
      { id: 469, city_id: 35, name_ar: "طره البلد", name_en: "Tura Al Balad" },
      {
        id: 470,
        city_id: 35,
        name_ar: "طره الأسمنت",
        name_en: "Tura Al Asmant",
      },
      {
        id: 471,
        city_id: 35,
        name_ar: "طره الحجارة",
        name_en: "Tura Al Hegara",
      },
      { id: 472, city_id: 35, name_ar: "المعصرة", name_en: "Maasara" },
      { id: 473, city_id: 35, name_ar: "وادي حوف", name_en: "Wadi Hof" },

      // عابدين (id: 36)
      { id: 474, city_id: 36, name_ar: "عابدين", name_en: "Abdeen" },
      {
        id: 475,
        city_id: 36,
        name_ar: "ميدان عابدين",
        name_en: "Abdeen Square",
      },
      {
        id: 476,
        city_id: 36,
        name_ar: "شارع عبد الخالق ثروت",
        name_en: "Abdel Khalek Tharwat Street",
      },
      {
        id: 477,
        city_id: 36,
        name_ar: "شارع محمد فريد",
        name_en: "Mohamed Farid Street",
      },
      {
        id: 478,
        city_id: 36,
        name_ar: "شارع الجلاء",
        name_en: "Al Galaa Street",
      },
      {
        id: 479,
        city_id: 36,
        name_ar: "شارع الجمهورية",
        name_en: "Al Gomhoreya Street",
      },

      // عباسية (id: 37)
      { id: 480, city_id: 37, name_ar: "العباسية", name_en: "Al Abaseya" },
      { id: 481, city_id: 37, name_ar: "غمرة", name_en: "Ghamra" },
      { id: 482, city_id: 37, name_ar: "الحلمية", name_en: "Helmeya" },
      { id: 483, city_id: 37, name_ar: "الظاهر", name_en: "Al Daher" },
      {
        id: 484,
        city_id: 37,
        name_ar: "ميدان العباسية",
        name_en: "Al Abaseya Square",
      },
      {
        id: 485,
        city_id: 37,
        name_ar: "شارع العباسية",
        name_en: "Al Abaseya Street",
      },

      // عين شمس (id: 38)
      { id: 486, city_id: 38, name_ar: "عين شمس", name_en: "Ain Shams" },
      { id: 487, city_id: 38, name_ar: "المطرية", name_en: "Matareya" },
      {
        id: 488,
        city_id: 38,
        name_ar: "عزبة النخل",
        name_en: "Ezbet Al Nakhl",
      },
      { id: 489, city_id: 38, name_ar: "مسطرد", name_en: "Mostorod" },
      {
        id: 490,
        city_id: 38,
        name_ar: "جامعة عين شمس",
        name_en: "Ain Shams University",
      },
      {
        id: 491,
        city_id: 38,
        name_ar: "كلية الهندسة - عين شمس",
        name_en: "Engineering Faculty",
      },

      // مدينة نصر (id: 39)
      { id: 492, city_id: 39, name_ar: "مدينة نصر", name_en: "Nasr City" },
      {
        id: 493,
        city_id: 39,
        name_ar: "الحي السابع",
        name_en: "Seventh District",
      },
      {
        id: 494,
        city_id: 39,
        name_ar: "الحي الثامن",
        name_en: "Eighth District",
      },
      {
        id: 495,
        city_id: 39,
        name_ar: "الحي التاسع",
        name_en: "Ninth District",
      },
      {
        id: 496,
        city_id: 39,
        name_ar: "الحي العاشر",
        name_en: "Tenth District",
      },
      {
        id: 497,
        city_id: 39,
        name_ar: "الحي الحادي عشر",
        name_en: "Eleventh District",
      },
      {
        id: 498,
        city_id: 39,
        name_ar: "الحي الثاني عشر",
        name_en: "Twelfth District",
      },
      {
        id: 499,
        city_id: 39,
        name_ar: "شارع عباس العقاد",
        name_en: "Abbas Al Akkad Street",
      },
      {
        id: 500,
        city_id: 39,
        name_ar: "شارع مكرم عبيد",
        name_en: "Makram Ebeid Street",
      },
      { id: 501, city_id: 39, name_ar: "شارع النزهة", name_en: "Nozha Street" },
      {
        id: 502,
        city_id: 39,
        name_ar: "شارع الطيران",
        name_en: "Al Tayaran Street",
      },
      {
        id: 503,
        city_id: 39,
        name_ar: "شارع يوسف عباس",
        name_en: "Youssef Abbas Street",
      },
      {
        id: 504,
        city_id: 39,
        name_ar: "شارع حسن مأمون",
        name_en: "Hasan Mamoun Street",
      },
      {
        id: 505,
        city_id: 39,
        name_ar: "مدينة الأمل",
        name_en: "Madinet Al Amal",
      },
      {
        id: 506,
        city_id: 39,
        name_ar: "مدينة السكن",
        name_en: "Madinet Al Sakan",
      },
      {
        id: 507,
        city_id: 39,
        name_ar: "مدينة الزهراء",
        name_en: "Madinet Al Zahraa",
      },
      {
        id: 508,
        city_id: 39,
        name_ar: "مدينة القدس",
        name_en: "Madinet Al Quds",
      },
      {
        id: 509,
        city_id: 39,
        name_ar: "استاد القاهرة",
        name_en: "Cairo Stadium",
      },
      { id: 510, city_id: 39, name_ar: "مدينة نصر 1", name_en: "Nasr City 1" },
      { id: 511, city_id: 39, name_ar: "مدينة نصر 2", name_en: "Nasr City 2" },

      // مصر الجديدة (id: 40)
      { id: 512, city_id: 40, name_ar: "مصر الجديدة", name_en: "Heliopolis" },
      { id: 513, city_id: 40, name_ar: "روكسي", name_en: "Roxy" },
      { id: 514, city_id: 40, name_ar: "الميريلاند", name_en: "Merryland" },
      { id: 515, city_id: 40, name_ar: "الألماظة", name_en: "Almaza" },
      { id: 516, city_id: 40, name_ar: "كوربة", name_en: "Korba" },
      {
        id: 517,
        city_id: 40,
        name_ar: "حدائق القبة",
        name_en: "Hadayek Al Kobba",
      },
      { id: 518, city_id: 40, name_ar: "المطار", name_en: "Airport" },
      { id: 519, city_id: 40, name_ar: "النزهة", name_en: "Nozha" },
      {
        id: 520,
        city_id: 40,
        name_ar: "شارع الثورة",
        name_en: "Al Thawra Street",
      },
      {
        id: 521,
        city_id: 40,
        name_ar: "شارع الحجاز",
        name_en: "Al Hegaz Street",
      },
      {
        id: 522,
        city_id: 40,
        name_ar: "شارع عمر بن الخطاب",
        name_en: "Omar Ibn Al Khattab Street",
      },
      {
        id: 523,
        city_id: 40,
        name_ar: "شارع بغداد",
        name_en: "Baghdad Street",
      },
      { id: 524, city_id: 40, name_ar: "شارع العراق", name_en: "Iraq Street" },
      { id: 525, city_id: 40, name_ar: "شارع الألفي", name_en: "Alfy Street" },

      // مصر القديمة (id: 41)
      {
        id: 526,
        city_id: 41,
        name_ar: "مصر القديمة",
        name_en: "Masr Al Qadima",
      },
      { id: 527, city_id: 41, name_ar: "الفسطاط", name_en: "Al Fustat" },
      { id: 528, city_id: 41, name_ar: "عين الصيرة", name_en: "Ain Al Seira" },
      {
        id: 529,
        city_id: 41,
        name_ar: "سور مجرى العيون",
        name_en: "Sour Magra Al Oyoun",
      },
      { id: 530, city_id: 41, name_ar: "الروضة", name_en: "Al Rawda" },
      { id: 531, city_id: 41, name_ar: "المنيل", name_en: "Al Manyal" },
      {
        id: 532,
        city_id: 41,
        name_ar: "السيدة زينب",
        name_en: "Sayeda Zeinab",
      },
      { id: 533, city_id: 41, name_ar: "قصر العيني", name_en: "Kasr Al Ainy" },
      {
        id: 534,
        city_id: 41,
        name_ar: "متحف الحضارة",
        name_en: "Civilization Museum",
      },

      // منشية ناصر (id: 42)
      {
        id: 535,
        city_id: 42,
        name_ar: "منشية ناصر",
        name_en: "Mansheyat Nasir",
      },
      { id: 536, city_id: 42, name_ar: "الدويقة", name_en: "Al Dweqa" },
      {
        id: 537,
        city_id: 42,
        name_ar: "السبع بنات",
        name_en: "Al Sabaa Banat",
      },
      {
        id: 538,
        city_id: 42,
        name_ar: "عزبة الوالدة",
        name_en: "Ezbet Al Walda",
      },
      { id: 539, city_id: 42, name_ar: "المقطم", name_en: "Mokattam" },

      // مدينة بدر (id: 43)
      {
        id: 540,
        city_id: 43,
        name_ar: "الحي الأول - بدر",
        name_en: "First District - Badr",
      },
      {
        id: 541,
        city_id: 43,
        name_ar: "الحي الثاني - بدر",
        name_en: "Second District - Badr",
      },
      {
        id: 542,
        city_id: 43,
        name_ar: "الحي الثالث - بدر",
        name_en: "Third District - Badr",
      },
      {
        id: 543,
        city_id: 43,
        name_ar: "الحي الرابع - بدر",
        name_en: "Fourth District - Badr",
      },
      {
        id: 544,
        city_id: 43,
        name_ar: "الحي الخامس - بدر",
        name_en: "Fifth District - Badr",
      },
      {
        id: 545,
        city_id: 43,
        name_ar: "المنطقة الصناعية - بدر",
        name_en: "Industrial Zone - Badr",
      },

      // مدينة العبور (id: 44)
      {
        id: 546,
        city_id: 44,
        name_ar: "الحي الأول - العبور",
        name_en: "First District - Obour",
      },
      {
        id: 547,
        city_id: 44,
        name_ar: "الحي الثاني - العبور",
        name_en: "Second District - Obour",
      },
      {
        id: 548,
        city_id: 44,
        name_ar: "الحي الثالث - العبور",
        name_en: "Third District - Obour",
      },
      {
        id: 549,
        city_id: 44,
        name_ar: "الحي الرابع - العبور",
        name_en: "Fourth District - Obour",
      },
      {
        id: 550,
        city_id: 44,
        name_ar: "الحي الخامس - العبور",
        name_en: "Fifth District - Obour",
      },
      {
        id: 551,
        city_id: 44,
        name_ar: "الحي السادس - العبور",
        name_en: "Sixth District - Obour",
      },
      {
        id: 552,
        city_id: 44,
        name_ar: "الحي السابع - العبور",
        name_en: "Seventh District - Obour",
      },
      {
        id: 553,
        city_id: 44,
        name_ar: "المنطقة الصناعية - العبور",
        name_en: "Industrial Zone - Obour",
      },

      // وسط البلد (id: 45)
      { id: 554, city_id: 45, name_ar: "وسط البلد", name_en: "Downtown" },
      {
        id: 555,
        city_id: 45,
        name_ar: "ميدان التحرير",
        name_en: "Tahrir Square",
      },
      {
        id: 556,
        city_id: 45,
        name_ar: "شارع طلعت حرب",
        name_en: "Talaat Harb Street",
      },
      {
        id: 557,
        city_id: 45,
        name_ar: "شارع قصر النيل",
        name_en: "Kasr El Nil Street",
      },
      {
        id: 558,
        city_id: 45,
        name_ar: "شارع شامبليون",
        name_en: "Champollion Street",
      },
      {
        id: 559,
        city_id: 45,
        name_ar: "شارع البستان",
        name_en: "Al Bustan Street",
      },
      {
        id: 560,
        city_id: 45,
        name_ar: "شارع محمد فريد",
        name_en: "Mohamed Farid Street",
      },
      {
        id: 561,
        city_id: 45,
        name_ar: "شارع عبد الخالق ثروت",
        name_en: "Abdel Khalek Tharwat Street",
      },
      { id: 562, city_id: 45, name_ar: "شارع عدلي", name_en: "Adly Street" },
      {
        id: 563,
        city_id: 45,
        name_ar: "شارع سليمان باشا",
        name_en: "Soliman Pasha Street",
      },

      // الزمالك (id: 46)
      { id: 564, city_id: 46, name_ar: "الزمالك", name_en: "Zamalek" },
      {
        id: 565,
        city_id: 46,
        name_ar: "شارع 26 يوليو",
        name_en: "26th of July Street",
      },
      {
        id: 566,
        city_id: 46,
        name_ar: "شارع البرازيل",
        name_en: "Al Brazil Street",
      },
      {
        id: 567,
        city_id: 46,
        name_ar: "شارع إسماعيل محمد",
        name_en: "Ismail Mohamed Street",
      },
      {
        id: 568,
        city_id: 46,
        name_ar: "شارع أحمد حشمت",
        name_en: "Ahmed Heshmat Street",
      },
      {
        id: 569,
        city_id: 46,
        name_ar: "كوبري الزمالك",
        name_en: "Zamalek Bridge",
      },
      { id: 570, city_id: 46, name_ar: "نادي الجزيرة", name_en: "Gezira Club" },

      // قصر النيل (id: 47)
      { id: 571, city_id: 47, name_ar: "قصر النيل", name_en: "Kasr El Nile" },
      {
        id: 572,
        city_id: 47,
        name_ar: "ميدان التحرير",
        name_en: "Tahrir Square",
      },
      {
        id: 573,
        city_id: 47,
        name_ar: "كورنيش النيل",
        name_en: "Nile Corniche",
      },
      {
        id: 574,
        city_id: 47,
        name_ar: "شارع قصر النيل",
        name_en: "Kasr El Nile Street",
      },

      // الرحاب (id: 48)
      { id: 575, city_id: 48, name_ar: "الرحاب", name_en: "Rehab" },
      {
        id: 576,
        city_id: 48,
        name_ar: "الحي الأول - الرحاب",
        name_en: "First District - Rehab",
      },
      {
        id: 577,
        city_id: 48,
        name_ar: "الحي الثاني - الرحاب",
        name_en: "Second District - Rehab",
      },
      {
        id: 578,
        city_id: 48,
        name_ar: "الحي الثالث - الرحاب",
        name_en: "Third District - Rehab",
      },
      {
        id: 579,
        city_id: 48,
        name_ar: "الحي الرابع - الرحاب",
        name_en: "Fourth District - Rehab",
      },
      {
        id: 580,
        city_id: 48,
        name_ar: "الحي الخامس - الرحاب",
        name_en: "Fifth District - Rehab",
      },
      {
        id: 581,
        city_id: 48,
        name_ar: "الحي السادس - الرحاب",
        name_en: "Sixth District - Rehab",
      },
      {
        id: 582,
        city_id: 48,
        name_ar: "الحي السابع - الرحاب",
        name_en: "Seventh District - Rehab",
      },

      // القطامية (id: 49)
      { id: 583, city_id: 49, name_ar: "القطامية", name_en: "Katameya" },
      {
        id: 584,
        city_id: 49,
        name_ar: "قطامية هايتس",
        name_en: "Katameya Heights",
      },
      {
        id: 585,
        city_id: 49,
        name_ar: "قطامية داون تاون",
        name_en: "Katameya Downtown",
      },
      {
        id: 586,
        city_id: 49,
        name_ar: "كمبوند قطامية",
        name_en: "Katameya Compound",
      },

      // مدينتي (id: 50)
      { id: 587, city_id: 50, name_ar: "مدينتي", name_en: "Madinty" },
      {
        id: 588,
        city_id: 50,
        name_ar: "الحي الأول - مدينتي",
        name_en: "First District - Madinty",
      },
      {
        id: 589,
        city_id: 50,
        name_ar: "الحي الثاني - مدينتي",
        name_en: "Second District - Madinty",
      },
      {
        id: 590,
        city_id: 50,
        name_ar: "الحي الثالث - مدينتي",
        name_en: "Third District - Madinty",
      },
      {
        id: 591,
        city_id: 50,
        name_ar: "الحي الرابع - مدينتي",
        name_en: "Fourth District - Madinty",
      },
      {
        id: 592,
        city_id: 50,
        name_ar: "الحي الخامس - مدينتي",
        name_en: "Fifth District - Madinty",
      },

      // روض الفرج (id: 51)
      { id: 593, city_id: 51, name_ar: "روض الفرج", name_en: "Rod Alfarag" },
      { id: 594, city_id: 51, name_ar: "شبرا", name_en: "Shubra" },
      { id: 595, city_id: 51, name_ar: "الشرابية", name_en: "Al Sharabiya" },
      { id: 596, city_id: 51, name_ar: "الساحل", name_en: "Al Sahel" },
      {
        id: 597,
        city_id: 51,
        name_ar: "ميدان روض الفرج",
        name_en: "Rod Alfarag Square",
      },

      // شيراتون (id: 52)
      { id: 598, city_id: 52, name_ar: "شيراتون", name_en: "Sheraton" },
      { id: 599, city_id: 52, name_ar: "الألف مسكن", name_en: "Alf Maskan" },
      {
        id: 600,
        city_id: 52,
        name_ar: "مساكن شيراتون",
        name_en: "Sheraton Housing",
      },
      { id: 601, city_id: 52, name_ar: "النزهة", name_en: "Nozha" },

      // الجمالية (id: 53)
      { id: 602, city_id: 53, name_ar: "الجمالية", name_en: "El-Gamaleya" },
      { id: 603, city_id: 53, name_ar: "الحسين", name_en: "Al Hussein" },
      { id: 604, city_id: 53, name_ar: "الأزهر", name_en: "Al Azhar" },
      {
        id: 605,
        city_id: 53,
        name_ar: "شارع المعز",
        name_en: "Al Moez Street",
      },
      {
        id: 606,
        city_id: 53,
        name_ar: "خان الخليلي",
        name_en: "Khan Al Khalili",
      },

      // العاشر من رمضان (id: 54)
      {
        id: 607,
        city_id: 54,
        name_ar: "الحي الأول - العاشر",
        name_en: "First District - 10th of Ramadan",
      },
      {
        id: 608,
        city_id: 54,
        name_ar: "الحي الثاني - العاشر",
        name_en: "Second District - 10th of Ramadan",
      },
      {
        id: 609,
        city_id: 54,
        name_ar: "الحي الثالث - العاشر",
        name_en: "Third District - 10th of Ramadan",
      },
      {
        id: 610,
        city_id: 54,
        name_ar: "الحي الرابع - العاشر",
        name_en: "Fourth District - 10th of Ramadan",
      },
      {
        id: 611,
        city_id: 54,
        name_ar: "الحي الخامس - العاشر",
        name_en: "Fifth District - 10th of Ramadan",
      },
      {
        id: 612,
        city_id: 54,
        name_ar: "الحي السادس - العاشر",
        name_en: "Sixth District - 10th of Ramadan",
      },
      {
        id: 613,
        city_id: 54,
        name_ar: "الحي السابع - العاشر",
        name_en: "Seventh District - 10th of Ramadan",
      },
      {
        id: 614,
        city_id: 54,
        name_ar: "الحي الثامن - العاشر",
        name_en: "Eighth District - 10th of Ramadan",
      },
      {
        id: 615,
        city_id: 54,
        name_ar: "الحي التاسع - العاشر",
        name_en: "Ninth District - 10th of Ramadan",
      },
      {
        id: 616,
        city_id: 54,
        name_ar: "الحي العاشر - العاشر",
        name_en: "Tenth District - 10th of Ramadan",
      },
      {
        id: 617,
        city_id: 54,
        name_ar: "المنطقة الصناعية الأولى",
        name_en: "First Industrial Zone",
      },
      {
        id: 618,
        city_id: 54,
        name_ar: "المنطقة الصناعية الثانية",
        name_en: "Second Industrial Zone",
      },
      {
        id: 619,
        city_id: 54,
        name_ar: "المنطقة الصناعية الثالثة",
        name_en: "Third Industrial Zone",
      },
      {
        id: 620,
        city_id: 54,
        name_ar: "المنطقة الصناعية الرابعة",
        name_en: "Fourth Industrial Zone",
      },
      {
        id: 621,
        city_id: 54,
        name_ar: "المنطقة الصناعية الخامسة",
        name_en: "Fifth Industrial Zone",
      },

      // الحلمية (id: 55)
      {
        id: 622,
        city_id: 55,
        name_ar: "الحلمية",
        name_en: "Helmeyat Alzaytoun",
      },
      { id: 623, city_id: 55, name_ar: "الزيتون", name_en: "Zaytoun" },
      {
        id: 624,
        city_id: 55,
        name_ar: "حدائق الزيتون",
        name_en: "Hadayek Al Zaytoun",
      },

      // النزهة الجديدة (id: 56)
      { id: 625, city_id: 56, name_ar: "النزهة الجديدة", name_en: "New Nozha" },
      { id: 626, city_id: 56, name_ar: "مصر الجديدة", name_en: "Heliopolis" },
      { id: 627, city_id: 56, name_ar: "الشيراتون", name_en: "Sheraton" },

      // العاصمة الإدارية (id: 57)
      {
        id: 628,
        city_id: 57,
        name_ar: "الحي الحكومي",
        name_en: "Government District",
      },
      {
        id: 629,
        city_id: 57,
        name_ar: "الحي الدبلوماسي",
        name_en: "Diplomatic District",
      },
      {
        id: 630,
        city_id: 57,
        name_ar: "الحي السكني الأول",
        name_en: "First Residential District",
      },
      {
        id: 631,
        city_id: 57,
        name_ar: "الحي السكني الثاني",
        name_en: "Second Residential District",
      },
      {
        id: 632,
        city_id: 57,
        name_ar: "الحي السكني الثالث",
        name_en: "Third Residential District",
      },
      {
        id: 633,
        city_id: 57,
        name_ar: "الحي السكني الرابع",
        name_en: "Fourth Residential District",
      },
      {
        id: 634,
        city_id: 57,
        name_ar: "الحي السكني الخامس",
        name_en: "Fifth Residential District",
      },
      {
        id: 635,
        city_id: 57,
        name_ar: "الحي السكني السادس",
        name_en: "Sixth Residential District",
      },
      {
        id: 636,
        city_id: 57,
        name_ar: "الحي السكني السابع",
        name_en: "Seventh Residential District",
      },
      {
        id: 637,
        city_id: 57,
        name_ar: "الحي السكني الثامن",
        name_en: "Eighth Residential District",
      },
      {
        id: 638,
        city_id: 57,
        name_ar: "الحي السكني التاسع",
        name_en: "Ninth Residential District",
      },
      {
        id: 639,
        city_id: 57,
        name_ar: "الحي السكني العاشر",
        name_en: "Tenth Residential District",
      },
      {
        id: 640,
        city_id: 57,
        name_ar: "المنطقة التجارية",
        name_en: "Commercial Zone",
      },
      {
        id: 641,
        city_id: 57,
        name_ar: "المنطقة المالية",
        name_en: "Financial Zone",
      },
      {
        id: 642,
        city_id: 57,
        name_ar: "حي الأعمال",
        name_en: "Business District",
      },
      { id: 643, city_id: 57, name_ar: "مدينة الفنون", name_en: "Arts City" },
      {
        id: 644,
        city_id: 57,
        name_ar: "المتحف المصري الكبير",
        name_en: "Grand Egyptian Museum",
      },
      {
        id: 645,
        city_id: 57,
        name_ar: "مركز المؤتمرات",
        name_en: "Conference Center",
      },
      {
        id: 646,
        city_id: 57,
        name_ar: "الاستاد الرياضي",
        name_en: "Sports Stadium",
      },
      {
        id: 647,
        city_id: 57,
        name_ar: "الجامعة الدولية",
        name_en: "International University",
      },
      {
        id: 648,
        city_id: 57,
        name_ar: "المدينة الطبية",
        name_en: "Medical City",
      },
      {
        id: 649,
        city_id: 57,
        name_ar: "حي الوزارات",
        name_en: "Ministries District",
      },
      { id: 650, city_id: 57, name_ar: "دار الأوبرا", name_en: "Opera House" },
      {
        id: 651,
        city_id: 57,
        name_ar: "مدينة المعارض",
        name_en: "Exhibition City",
      },
      {
        id: 652,
        city_id: 57,
        name_ar: "المنطقة الترفيهية",
        name_en: "Entertainment Zone",
      },
      {
        id: 653,
        city_id: 57,
        name_ar: "المركز الإعلامي",
        name_en: "Media Center",
      },

      // ==================== الجيزة (cities 58-92) ====================

      // الجيزة (id: 58)
      { id: 654, city_id: 58, name_ar: "فيصل", name_en: "Faisal" },
      { id: 655, city_id: 58, name_ar: "الهرم", name_en: "Haram" },
      { id: 656, city_id: 58, name_ar: "المهندسين", name_en: "Mohandessin" },
      { id: 657, city_id: 58, name_ar: "الدقي", name_en: "Dokki" },
      { id: 658, city_id: 58, name_ar: "العجوزة", name_en: "Agouza" },
      { id: 659, city_id: 58, name_ar: "إمبابة", name_en: "Imbaba" },
      {
        id: 660,
        city_id: 58,
        name_ar: "بولاق الدكرور",
        name_en: "Boulaq Dakrour",
      },
      { id: 661, city_id: 58, name_ar: "الوراق", name_en: "Warraq" },
      { id: 662, city_id: 58, name_ar: "العمرانية", name_en: "Omraneya" },
      { id: 663, city_id: 58, name_ar: "المنيب", name_en: "Moneeb" },
      {
        id: 664,
        city_id: 58,
        name_ar: "بين السرايات",
        name_en: "Bin Alsarayat",
      },
      { id: 665, city_id: 58, name_ar: "الكيت كات", name_en: "Kit Kat" },
      {
        id: 666,
        city_id: 58,
        name_ar: "حدائق الأهرام",
        name_en: "Hadayek Alahram",
      },
      { id: 667, city_id: 58, name_ar: "صفط اللبن", name_en: "Saft Allaban" },
      { id: 668, city_id: 58, name_ar: "أرض اللواء", name_en: "Ard Ellwaa" },
      { id: 669, city_id: 58, name_ar: "شارع الهرم", name_en: "Haram Street" },
      { id: 670, city_id: 58, name_ar: "شارع فيصل", name_en: "Faisal Street" },
      {
        id: 671,
        city_id: 58,
        name_ar: "شارع جامعة الدول",
        name_en: "Gamaet Al Dowal Street",
      },
      {
        id: 672,
        city_id: 58,
        name_ar: "شارع السودان",
        name_en: "Sudan Street",
      },
      { id: 673, city_id: 58, name_ar: "ميدان الجيزة", name_en: "Giza Square" },
      {
        id: 674,
        city_id: 58,
        name_ar: "ميدان سفنكس",
        name_en: "Sphinx Square",
      },
      {
        id: 675,
        city_id: 58,
        name_ar: "ميدان النهضة",
        name_en: "Nahda Square",
      },
      {
        id: 676,
        city_id: 58,
        name_ar: "ميدان لبنان",
        name_en: "Lebanon Square",
      },
      {
        id: 677,
        city_id: 58,
        name_ar: "شارع التحرير",
        name_en: "Tahrir Street",
      },
      { id: 678, city_id: 58, name_ar: "شارع مراد", name_en: "Morad Street" },
      {
        id: 679,
        city_id: 58,
        name_ar: "شارع القصر العيني",
        name_en: "Kasr Al Ainy Street",
      },

      // 6 أكتوبر (id: 59)
      {
        id: 680,
        city_id: 59,
        name_ar: "الحي الأول - 6 أكتوبر",
        name_en: "First District - 6th October",
      },
      {
        id: 681,
        city_id: 59,
        name_ar: "الحي الثاني - 6 أكتوبر",
        name_en: "Second District - 6th October",
      },
      {
        id: 682,
        city_id: 59,
        name_ar: "الحي الثالث - 6 أكتوبر",
        name_en: "Third District - 6th October",
      },
      {
        id: 683,
        city_id: 59,
        name_ar: "الحي الرابع - 6 أكتوبر",
        name_en: "Fourth District - 6th October",
      },
      {
        id: 684,
        city_id: 59,
        name_ar: "الحي الخامس - 6 أكتوبر",
        name_en: "Fifth District - 6th October",
      },
      {
        id: 685,
        city_id: 59,
        name_ar: "الحي السادس - 6 أكتوبر",
        name_en: "Sixth District - 6th October",
      },
      {
        id: 686,
        city_id: 59,
        name_ar: "الحي السابع - 6 أكتوبر",
        name_en: "Seventh District - 6th October",
      },
      {
        id: 687,
        city_id: 59,
        name_ar: "الحي الثامن - 6 أكتوبر",
        name_en: "Eighth District - 6th October",
      },
      {
        id: 688,
        city_id: 59,
        name_ar: "الحي التاسع - 6 أكتوبر",
        name_en: "Ninth District - 6th October",
      },
      {
        id: 689,
        city_id: 59,
        name_ar: "الحي العاشر - 6 أكتوبر",
        name_en: "Tenth District - 6th October",
      },
      {
        id: 690,
        city_id: 59,
        name_ar: "الحي الحادي عشر - 6 أكتوبر",
        name_en: "Eleventh District - 6th October",
      },
      {
        id: 691,
        city_id: 59,
        name_ar: "الحي الثاني عشر - 6 أكتوبر",
        name_en: "Twelfth District - 6th October",
      },
      {
        id: 692,
        city_id: 59,
        name_ar: "الحي الثالث عشر - 6 أكتوبر",
        name_en: "Thirteenth District - 6th October",
      },
      {
        id: 693,
        city_id: 59,
        name_ar: "الحي الرابع عشر - 6 أكتوبر",
        name_en: "Fourteenth District - 6th October",
      },
      {
        id: 694,
        city_id: 59,
        name_ar: "الحي الخامس عشر - 6 أكتوبر",
        name_en: "Fifteenth District - 6th October",
      },
      {
        id: 695,
        city_id: 59,
        name_ar: "المنطقة الصناعية - 6 أكتوبر",
        name_en: "Industrial Zone - 6th October",
      },
      {
        id: 696,
        city_id: 59,
        name_ar: "قرية الفيروز",
        name_en: "Al Fairoz Village",
      },
      {
        id: 697,
        city_id: 59,
        name_ar: "حدائق أكتوبر",
        name_en: "October Gardens",
      },
      {
        id: 698,
        city_id: 59,
        name_ar: "كمبوندات 6 أكتوبر",
        name_en: "6th October Compounds",
      },

      // الشيخ زايد (id: 60)
      {
        id: 699,
        city_id: 60,
        name_ar: "الحي الأول - الشيخ زايد",
        name_en: "First District - Sheikh Zayed",
      },
      {
        id: 700,
        city_id: 60,
        name_ar: "الحي الثاني - الشيخ زايد",
        name_en: "Second District - Sheikh Zayed",
      },
      {
        id: 701,
        city_id: 60,
        name_ar: "الحي الثالث - الشيخ زايد",
        name_en: "Third District - Sheikh Zayed",
      },
      {
        id: 702,
        city_id: 60,
        name_ar: "الحي الرابع - الشيخ زايد",
        name_en: "Fourth District - Sheikh Zayed",
      },
      {
        id: 703,
        city_id: 60,
        name_ar: "الحي الخامس - الشيخ زايد",
        name_en: "Fifth District - Sheikh Zayed",
      },
      {
        id: 704,
        city_id: 60,
        name_ar: "الحي السادس - الشيخ زايد",
        name_en: "Sixth District - Sheikh Zayed",
      },
      {
        id: 705,
        city_id: 60,
        name_ar: "الحي السابع - الشيخ زايد",
        name_en: "Seventh District - Sheikh Zayed",
      },
      {
        id: 706,
        city_id: 60,
        name_ar: "الحي الثامن - الشيخ زايد",
        name_en: "Eighth District - Sheikh Zayed",
      },
      {
        id: 707,
        city_id: 60,
        name_ar: "الحي التاسع - الشيخ زايد",
        name_en: "Ninth District - Sheikh Zayed",
      },
      {
        id: 708,
        city_id: 60,
        name_ar: "الحي العاشر - الشيخ زايد",
        name_en: "Tenth District - Sheikh Zayed",
      },
      {
        id: 709,
        city_id: 60,
        name_ar: "الحي الحادي عشر - الشيخ زايد",
        name_en: "Eleventh District - Sheikh Zayed",
      },
      {
        id: 710,
        city_id: 60,
        name_ar: "الحي الثاني عشر - الشيخ زايد",
        name_en: "Twelfth District - Sheikh Zayed",
      },
      {
        id: 711,
        city_id: 60,
        name_ar: "كمبوندات الشيخ زايد",
        name_en: "Sheikh Zayed Compounds",
      },

      // الحوامدية (id: 61)
      { id: 712, city_id: 61, name_ar: "الحوامدية", name_en: "Hawamdiyah" },
      { id: 713, city_id: 61, name_ar: "كفر غطاطي", name_en: "Kafr Ghati" },
      {
        id: 714,
        city_id: 61,
        name_ar: "منشأة البكاري",
        name_en: "Manshiyet Al Bakari",
      },

      // البدرشين (id: 62)
      { id: 715, city_id: 62, name_ar: "البدرشين", name_en: "Al Badrasheen" },
      { id: 716, city_id: 62, name_ar: "دهشور", name_en: "Dashour" },
      { id: 717, city_id: 62, name_ar: "سقارة", name_en: "Saqqara" },
      { id: 718, city_id: 62, name_ar: "أبو صير", name_en: "Abu Seir" },

      // الصف (id: 63)
      { id: 719, city_id: 63, name_ar: "الصف", name_en: "Saf" },
      { id: 720, city_id: 63, name_ar: "الخصاص", name_en: "Al Khasas" },

      // أطفيح (id: 64)
      { id: 721, city_id: 64, name_ar: "أطفيح", name_en: "Atfih" },

      // العياط (id: 65)
      { id: 722, city_id: 65, name_ar: "العياط", name_en: "Al Ayat" },

      // الباويطي (id: 66)
      { id: 723, city_id: 66, name_ar: "الباويطي", name_en: "Al-Bawaiti" },

      // منشأة القناطر (id: 67)
      {
        id: 724,
        city_id: 67,
        name_ar: "منشأة القناطر",
        name_en: "Manshiyet Al Qanater",
      },

      // أوسيم (id: 68)
      { id: 725, city_id: 68, name_ar: "أوسيم", name_en: "Oaseem" },

      // كرداسة (id: 69)
      { id: 726, city_id: 69, name_ar: "كرداسة", name_en: "Kerdasa" },

      // أبو النمرس (id: 70)
      { id: 727, city_id: 70, name_ar: "أبو النمرس", name_en: "Abu Nomros" },

      // كفر غطاطي (id: 71)
      { id: 728, city_id: 71, name_ar: "كفر غطاطي", name_en: "Kafr Ghati" },

      // منشأة البكاري (id: 72)
      {
        id: 729,
        city_id: 72,
        name_ar: "منشأة البكاري",
        name_en: "Manshiyet Al Bakari",
      },

      // الدقي (id: 73)
      { id: 730, city_id: 73, name_ar: "الدقي", name_en: "Dokki" },
      {
        id: 731,
        city_id: 73,
        name_ar: "شارع التحرير",
        name_en: "Tahrir Street",
      },
      {
        id: 732,
        city_id: 73,
        name_ar: "شارع جامعة الدول",
        name_en: "Gamaet Al Dowal Street",
      },
      {
        id: 733,
        city_id: 73,
        name_ar: "شارع سليمان أباظة",
        name_en: "Soliman Abaza Street",
      },
      {
        id: 734,
        city_id: 73,
        name_ar: "شارع البطل أحمد عبد العزيز",
        name_en: "Ahmad Abdulaziz Street",
      },
      {
        id: 735,
        city_id: 73,
        name_ar: "ميدان المساحة",
        name_en: "Al Masaha Square",
      },

      // العجوزة (id: 74)
      { id: 736, city_id: 74, name_ar: "العجوزة", name_en: "Agouza" },
      {
        id: 737,
        city_id: 74,
        name_ar: "شارع جامعة الدول",
        name_en: "Gamaet Al Dowal Street",
      },
      {
        id: 738,
        city_id: 74,
        name_ar: "شارع السودان",
        name_en: "Sudan Street",
      },
      { id: 739, city_id: 74, name_ar: "شارع نوال", name_en: "Nawal Street" },

      // الهرم (id: 75)
      { id: 740, city_id: 75, name_ar: "الهرم", name_en: "Haram" },
      { id: 741, city_id: 75, name_ar: "فيصل", name_en: "Faisal" },
      { id: 742, city_id: 75, name_ar: "الطالبية", name_en: "Talbia" },
      { id: 743, city_id: 75, name_ar: "المنيب", name_en: "Moneeb" },
      {
        id: 744,
        city_id: 75,
        name_ar: "حدائق الأهرام",
        name_en: "Hadayek Alahram",
      },
      { id: 745, city_id: 75, name_ar: "شارع الهرم", name_en: "Haram Street" },
      { id: 746, city_id: 75, name_ar: "شارع فيصل", name_en: "Faisal Street" },

      // الوراق (id: 76)
      { id: 747, city_id: 76, name_ar: "الوراق", name_en: "Warraq" },

      // إمبابة (id: 77)
      { id: 748, city_id: 77, name_ar: "إمبابة", name_en: "Imbaba" },
      { id: 749, city_id: 77, name_ar: "الكيت كات", name_en: "Kit Kat" },

      // بولاق الدكرور (id: 78)
      {
        id: 750,
        city_id: 78,
        name_ar: "بولاق الدكرور",
        name_en: "Boulaq Dakrour",
      },

      // الواحات البحرية (id: 79)
      { id: 751, city_id: 79, name_ar: "الباويطي", name_en: "Al Bawiti" },
      { id: 752, city_id: 79, name_ar: "المنيرة", name_en: "Al Munira" },

      // العمرانية (id: 80)
      { id: 753, city_id: 80, name_ar: "العمرانية", name_en: "Omraneya" },

      // المنيب (id: 81)
      { id: 754, city_id: 81, name_ar: "المنيب", name_en: "Moneeb" },

      // بين السرايات (id: 82)
      {
        id: 755,
        city_id: 82,
        name_ar: "بين السرايات",
        name_en: "Bin Alsarayat",
      },

      // الكيت كات (id: 83)
      { id: 756, city_id: 83, name_ar: "الكيت كات", name_en: "Kit Kat" },

      // المهندسين (id: 84)
      { id: 757, city_id: 84, name_ar: "المهندسين", name_en: "Mohandessin" },
      {
        id: 758,
        city_id: 84,
        name_ar: "شارع جامعة الدول",
        name_en: "Gamaet Al Dowal Street",
      },
      {
        id: 759,
        city_id: 84,
        name_ar: "شارع السودان",
        name_en: "Sudan Street",
      },
      {
        id: 760,
        city_id: 84,
        name_ar: "شارع سليمان أباظة",
        name_en: "Soliman Abaza Street",
      },
      {
        id: 761,
        city_id: 84,
        name_ar: "شارع البطل أحمد عبد العزيز",
        name_en: "Ahmad Abdulaziz Street",
      },

      // فيصل (id: 85)
      { id: 762, city_id: 85, name_ar: "فيصل", name_en: "Faisal" },
      { id: 763, city_id: 85, name_ar: "الطالبية", name_en: "Talbia" },
      { id: 764, city_id: 85, name_ar: "الهرم", name_en: "Haram" },

      // أبو رواش (id: 86)
      { id: 765, city_id: 86, name_ar: "أبو رواش", name_en: "Abu Rawash" },

      // حدائق الأهرام (id: 87)
      {
        id: 766,
        city_id: 87,
        name_ar: "حدائق الأهرام",
        name_en: "Hadayek Alahram",
      },

      // الحرانية (id: 88)
      { id: 767, city_id: 88, name_ar: "الحرانية", name_en: "Haraneya" },

      // حدائق أكتوبر (id: 89)
      {
        id: 768,
        city_id: 89,
        name_ar: "حدائق أكتوبر",
        name_en: "Hadayek October",
      },

      // صفط اللبن (id: 90)
      { id: 769, city_id: 90, name_ar: "صفط اللبن", name_en: "Saft Allaban" },

      // القرية الذكية (id: 91)
      {
        id: 770,
        city_id: 91,
        name_ar: "القرية الذكية",
        name_en: "Smart Village",
      },

      // أرض اللواء (id: 92)
      { id: 771, city_id: 92, name_ar: "أرض اللواء", name_en: "Ard Ellwaa" },

      // ==================== الإسكندرية (cities 93-136) ====================

      // أبو قير (id: 93)
      { id: 772, city_id: 93, name_ar: "أبو قير", name_en: "Abu Qir" },
      { id: 773, city_id: 93, name_ar: "المنتزه", name_en: "Al Montaza" },

      // الإبراهيمية (id: 94)
      {
        id: 774,
        city_id: 94,
        name_ar: "الإبراهيمية",
        name_en: "Al Ibrahimeyah",
      },

      // الأزاريطة (id: 95)
      { id: 775, city_id: 95, name_ar: "الأزاريطة", name_en: "Azarita" },

      // الآنفوشي (id: 96)
      { id: 776, city_id: 96, name_ar: "الأنفوشي", name_en: "Anfoushi" },

      // الدخيلة (id: 97)
      { id: 777, city_id: 97, name_ar: "الدخيلة", name_en: "Dekheila" },

      // السيوف (id: 98)
      { id: 778, city_id: 98, name_ar: "السيوف", name_en: "El Soyof" },

      // العامرية (id: 99)
      { id: 779, city_id: 99, name_ar: "العامرية", name_en: "Ameria" },

      // اللبان (id: 100)
      { id: 780, city_id: 100, name_ar: "اللبان", name_en: "El Labban" },

      // المفروزة (id: 101)
      { id: 781, city_id: 101, name_ar: "المفروزة", name_en: "Al Mafrouza" },

      // المنتزه (id: 102)
      { id: 782, city_id: 102, name_ar: "المنتزه", name_en: "El Montaza" },

      // المنشية (id: 103)
      { id: 783, city_id: 103, name_ar: "المنشية", name_en: "Mansheya" },

      // الناصرية (id: 104)
      { id: 784, city_id: 104, name_ar: "الناصرية", name_en: "Naseria" },

      // أمبروزو (id: 105)
      { id: 785, city_id: 105, name_ar: "أمبروزو", name_en: "Ambrozo" },

      // باب شرق (id: 106)
      { id: 786, city_id: 106, name_ar: "باب شرق", name_en: "Bab Sharq" },

      // برج العرب (id: 107)
      { id: 787, city_id: 107, name_ar: "برج العرب", name_en: "Bourj Alarab" },
      {
        id: 788,
        city_id: 107,
        name_ar: "برج العرب الجديدة",
        name_en: "New Borg El Arab",
      },

      // ستانلي (id: 108)
      { id: 789, city_id: 108, name_ar: "ستانلي", name_en: "Stanley" },

      // سموحة (id: 109)
      { id: 790, city_id: 109, name_ar: "سموحة", name_en: "Smouha" },

      // سيدي بشر (id: 110)
      { id: 791, city_id: 110, name_ar: "سيدي بشر", name_en: "Sidi Bishr" },

      // شدس (id: 111)
      { id: 792, city_id: 111, name_ar: "شدس", name_en: "Shads" },

      // غيط العنب (id: 112)
      { id: 793, city_id: 112, name_ar: "غيط العنب", name_en: "Gheet Alenab" },

      // فلمنج (id: 113)
      { id: 794, city_id: 113, name_ar: "فلمنج", name_en: "Fleming" },

      // فيكتوريا (id: 114)
      { id: 795, city_id: 114, name_ar: "فيكتوريا", name_en: "Victoria" },

      // كامب شيزار (id: 115)
      { id: 796, city_id: 115, name_ar: "كامب شيزار", name_en: "Camp Shizar" },

      // كرموز (id: 116)
      { id: 797, city_id: 116, name_ar: "كرموز", name_en: "Karmooz" },

      // محطة الرمل (id: 117)
      { id: 798, city_id: 117, name_ar: "محطة الرمل", name_en: "Mahta Alraml" },

      // مينا البصل (id: 118)
      {
        id: 799,
        city_id: 118,
        name_ar: "مينا البصل",
        name_en: "Mina El-Basal",
      },

      // العصافرة (id: 119)
      { id: 800, city_id: 119, name_ar: "العصافرة", name_en: "Asafra" },

      // العجمي (id: 120)
      { id: 801, city_id: 120, name_ar: "العجمي", name_en: "Agamy" },
      { id: 802, city_id: 120, name_ar: "الهانوفيل", name_en: "Hanoville" },
      { id: 803, city_id: 120, name_ar: "البيطاش", name_en: "Bitash" },

      // بكوس (id: 121)
      { id: 804, city_id: 121, name_ar: "بكوس", name_en: "Bakos" },

      // بولكلي (id: 122)
      { id: 805, city_id: 122, name_ar: "بولكلي", name_en: "Boulkly" },

      // كليوباترا (id: 123)
      { id: 806, city_id: 123, name_ar: "كليوباترا", name_en: "Cleopatra" },

      // جليم (id: 124)
      { id: 807, city_id: 124, name_ar: "جليم", name_en: "Glim" },

      // المعمورة (id: 125)
      { id: 808, city_id: 125, name_ar: "المعمورة", name_en: "Al Mamurah" },

      // المندرة (id: 126)
      { id: 809, city_id: 126, name_ar: "المندرة", name_en: "Al Mandara" },

      // محرم بك (id: 127)
      { id: 810, city_id: 127, name_ar: "محرم بك", name_en: "Moharam Bek" },

      // الشاطبي (id: 128)
      { id: 811, city_id: 128, name_ar: "الشاطبي", name_en: "Elshatby" },

      // سيدي جابر (id: 129)
      { id: 812, city_id: 129, name_ar: "سيدي جابر", name_en: "Sidi Gaber" },

      // الساحل الشمالي (id: 130)
      { id: 813, city_id: 130, name_ar: "العلمين", name_en: "Alamein" },
      { id: 814, city_id: 130, name_ar: "مارينا", name_en: "Marina" },
      {
        id: 815,
        city_id: 130,
        name_ar: "سيدي عبد الرحمن",
        name_en: "Sidi Abdel Rahman",
      },

      // الحضرة (id: 131)
      { id: 816, city_id: 131, name_ar: "الحضرة", name_en: "Alhadra" },

      // العطارين (id: 132)
      { id: 817, city_id: 132, name_ar: "العطارين", name_en: "Alattarin" },

      // سيدي كرير (id: 133)
      { id: 818, city_id: 133, name_ar: "سيدي كرير", name_en: "Sidi Kerir" },

      // الجمرك (id: 134)
      { id: 819, city_id: 134, name_ar: "الجمرك", name_en: "Elgomrok" },

      // المكس (id: 135)
      { id: 820, city_id: 135, name_ar: "المكس", name_en: "Al Max" },

      // مارينا (id: 136)
      { id: 821, city_id: 136, name_ar: "مارينا", name_en: "Marina" },

      // ==================== الدقهلية (cities 137-155) ====================

      // المنصورة (id: 137)
      { id: 822, city_id: 137, name_ar: "المنصورة", name_en: "Mansoura" },
      { id: 823, city_id: 137, name_ar: "ميت خميس", name_en: "Meet Khamis" },
      { id: 824, city_id: 137, name_ar: "سندوب", name_en: "Sandoub" },
      {
        id: 825,
        city_id: 137,
        name_ar: "جادة السيالة",
        name_en: "Gadet Al Sayala",
      },
      {
        id: 826,
        city_id: 137,
        name_ar: "شارع الجيش",
        name_en: "Al Geish Street",
      },
      {
        id: 827,
        city_id: 137,
        name_ar: "شارع سعد زغلول",
        name_en: "Saad Zaghloul Street",
      },

      // طلخا (id: 138)
      { id: 828, city_id: 138, name_ar: "طلخا", name_en: "Talkha" },
      {
        id: 829,
        city_id: 138,
        name_ar: "كفر الشرفا",
        name_en: "Kafr Al Sharfa",
      },

      // ميت غمر (id: 139)
      { id: 830, city_id: 139, name_ar: "ميت غمر", name_en: "Mitt Ghamr" },

      // دكرنس (id: 140)
      { id: 831, city_id: 140, name_ar: "دكرنس", name_en: "Dekernes" },

      // أجا (id: 141)
      { id: 832, city_id: 141, name_ar: "أجا", name_en: "Aga" },

      // منية النصر (id: 142)
      {
        id: 833,
        city_id: 142,
        name_ar: "منية النصر",
        name_en: "Menia El Nasr",
      },

      // السنبلاوين (id: 143)
      { id: 834, city_id: 143, name_ar: "السنبلاوين", name_en: "Sinbillawin" },

      // الكردي (id: 144)
      { id: 835, city_id: 144, name_ar: "الكردي", name_en: "El Kurdi" },

      // بني عبيد (id: 145)
      { id: 836, city_id: 145, name_ar: "بني عبيد", name_en: "Bani Ubaid" },

      // المنزلة (id: 146)
      { id: 837, city_id: 146, name_ar: "المنزلة", name_en: "Al Manzala" },

      // تمي الأمديد (id: 147)
      {
        id: 838,
        city_id: 147,
        name_ar: "تمي الأمديد",
        name_en: "tami al'amdid",
      },

      // الجمالية (id: 148)
      { id: 839, city_id: 148, name_ar: "الجمالية", name_en: "aljamalia" },

      // شربين (id: 149)
      { id: 840, city_id: 149, name_ar: "شربين", name_en: "Sherbin" },

      // المطرية (id: 150)
      { id: 841, city_id: 150, name_ar: "المطرية", name_en: "Mataria" },

      // بلقاس (id: 151)
      { id: 842, city_id: 151, name_ar: "بلقاس", name_en: "Belqas" },

      // ميت سلسيل (id: 152)
      { id: 843, city_id: 152, name_ar: "ميت سلسيل", name_en: "Meet Salsil" },

      // جمصة (id: 153)
      { id: 844, city_id: 153, name_ar: "جمصة", name_en: "Gamasa" },

      // محلة دمنة (id: 154)
      {
        id: 845,
        city_id: 154,
        name_ar: "محلة دمنة",
        name_en: "Mahalat Damana",
      },

      // نبروه (id: 155)
      { id: 846, city_id: 155, name_ar: "نبروه", name_en: "Nabroh" },

      // ==================== البحر الأحمر (cities 156-163) ====================

      // الغردقة (id: 156)
      { id: 847, city_id: 156, name_ar: "الدهار", name_en: "Aldahar" },
      { id: 848, city_id: 156, name_ar: "السيالة", name_en: "Al Sayala" },
      { id: 849, city_id: 156, name_ar: "المنتزة", name_en: "Al Montaza" },
      { id: 850, city_id: 156, name_ar: "قرية الجونة", name_en: "El Gouna" },
      { id: 851, city_id: 156, name_ar: "سوماباي", name_en: "Soma Bay" },
      { id: 852, city_id: 156, name_ar: "مكادي", name_en: "Makadi" },
      { id: 853, city_id: 156, name_ar: "سهل حشيش", name_en: "Sahl Hasheesh" },

      // رأس غارب (id: 157)
      { id: 854, city_id: 157, name_ar: "رأس غارب", name_en: "Ras Ghareb" },

      // سفاجا (id: 158)
      { id: 855, city_id: 158, name_ar: "سفاجا", name_en: "Safaga" },

      // القصير (id: 159)
      { id: 856, city_id: 159, name_ar: "القصير", name_en: "El Qusiar" },

      // مرسى علم (id: 160)
      { id: 857, city_id: 160, name_ar: "مرسى علم", name_en: "Marsa Alam" },
      { id: 858, city_id: 160, name_ar: "شلاتين", name_en: "Shalatin" },

      // الشلاتين (id: 161)
      { id: 859, city_id: 161, name_ar: "الشلاتين", name_en: "Shalatin" },

      // حلايب (id: 162)
      { id: 860, city_id: 162, name_ar: "حلايب", name_en: "Halaib" },

      // الدهار (id: 163)
      { id: 861, city_id: 163, name_ar: "الدهار", name_en: "Aldahar" },

      // ==================== البحيرة (cities 164-180) ====================

      // دمنهور (id: 164)
      { id: 862, city_id: 164, name_ar: "دمنهور", name_en: "Damanhour" },

      // كفر الدوار (id: 165)
      {
        id: 863,
        city_id: 165,
        name_ar: "كفر الدوار",
        name_en: "Kafr El Dawar",
      },

      // رشيد (id: 166)
      { id: 864, city_id: 166, name_ar: "رشيد", name_en: "Rashid" },

      // إدكو (id: 167)
      { id: 865, city_id: 167, name_ar: "إدكو", name_en: "Edco" },

      // أبو المطامير (id: 168)
      {
        id: 866,
        city_id: 168,
        name_ar: "أبو المطامير",
        name_en: "Abu al-Matamir",
      },

      // أبو حمص (id: 169)
      { id: 867, city_id: 169, name_ar: "أبو حمص", name_en: "Abu Homs" },

      // الدلنجات (id: 170)
      { id: 868, city_id: 170, name_ar: "الدلنجات", name_en: "Delengat" },

      // المحمودية (id: 171)
      { id: 869, city_id: 171, name_ar: "المحمودية", name_en: "Mahmoudiyah" },

      // الرحمانية (id: 172)
      { id: 870, city_id: 172, name_ar: "الرحمانية", name_en: "Rahmaniyah" },

      // إيتاي البارود (id: 173)
      {
        id: 871,
        city_id: 173,
        name_ar: "إيتاي البارود",
        name_en: "Itai Baroud",
      },

      // حوش عيسى (id: 174)
      { id: 872, city_id: 174, name_ar: "حوش عيسى", name_en: "Housh Eissa" },

      // شبراخيت (id: 175)
      { id: 873, city_id: 175, name_ar: "شبراخيت", name_en: "Shubrakhit" },

      // كوم حمادة (id: 176)
      { id: 874, city_id: 176, name_ar: "كوم حمادة", name_en: "Kom Hamada" },

      // بدر (id: 177)
      { id: 875, city_id: 177, name_ar: "بدر", name_en: "Badr" },

      // وادي النطرون (id: 178)
      {
        id: 876,
        city_id: 178,
        name_ar: "وادي النطرون",
        name_en: "Wadi Natrun",
      },

      // النوبارية الجديدة (id: 179)
      {
        id: 877,
        city_id: 179,
        name_ar: "النوبارية الجديدة",
        name_en: "New Nubaria",
      },

      // النوبارية (id: 180)
      { id: 878, city_id: 180, name_ar: "النوبارية", name_en: "Alnoubareya" },

      // ==================== الفيوم (cities 181-191) ====================

      // الفيوم (id: 181)
      { id: 879, city_id: 181, name_ar: "الفيوم", name_en: "Fayoum" },
      { id: 880, city_id: 181, name_ar: "قحافة", name_en: "Qahafa" },

      // الفيوم الجديدة (id: 182)
      {
        id: 881,
        city_id: 182,
        name_ar: "الفيوم الجديدة",
        name_en: "Fayoum El Gedida",
      },

      // طامية (id: 183)
      { id: 882, city_id: 183, name_ar: "طامية", name_en: "Tamiya" },

      // سنورس (id: 184)
      { id: 883, city_id: 184, name_ar: "سنورس", name_en: "Snores" },

      // إطسا (id: 185)
      { id: 884, city_id: 185, name_ar: "إطسا", name_en: "Etsa" },

      // إبشواي (id: 186)
      { id: 885, city_id: 186, name_ar: "إبشواي", name_en: "Epschway" },

      // يوسف الصديق (id: 187)
      {
        id: 886,
        city_id: 187,
        name_ar: "يوسف الصديق",
        name_en: "Yusuf El Sediaq",
      },

      // الحادقة (id: 188)
      { id: 887, city_id: 188, name_ar: "الحادقة", name_en: "Hadqa" },

      // أطسا (id: 189)
      { id: 888, city_id: 189, name_ar: "أطسا", name_en: "Atsa" },

      // الجامعة (id: 190)
      { id: 889, city_id: 190, name_ar: "الجامعة", name_en: "Algamaa" },

      // السيالة (id: 191)
      { id: 890, city_id: 191, name_ar: "السيالة", name_en: "Sayala" },

      // ==================== الغربية (cities 192-199) ====================

      // طنطا (id: 192)
      { id: 891, city_id: 192, name_ar: "طنطا", name_en: "Tanta" },
      { id: 892, city_id: 192, name_ar: "حوض الطويل", name_en: "Hod Al Tawil" },
      { id: 893, city_id: 192, name_ar: "سبرباي", name_en: "Sbrbay" },

      // المحلة الكبرى (id: 193)
      {
        id: 894,
        city_id: 193,
        name_ar: "المحلة الكبرى",
        name_en: "Al Mahalla Al Kobra",
      },

      // كفر الزيات (id: 194)
      {
        id: 895,
        city_id: 194,
        name_ar: "كفر الزيات",
        name_en: "Kafr El Zayat",
      },

      // زفتى (id: 195)
      { id: 896, city_id: 195, name_ar: "زفتى", name_en: "Zefta" },

      // السنطة (id: 196)
      { id: 897, city_id: 196, name_ar: "السنطة", name_en: "El Santa" },

      // قطور (id: 197)
      { id: 898, city_id: 197, name_ar: "قطور", name_en: "Qutour" },

      // بسيون (id: 198)
      { id: 899, city_id: 198, name_ar: "بسيون", name_en: "Basion" },

      // سمنود (id: 199)
      { id: 900, city_id: 199, name_ar: "سمنود", name_en: "Samannoud" },

      // ==================== الإسماعيلية (cities 200-208) ====================

      // الإسماعيلية (id: 200)
      { id: 901, city_id: 200, name_ar: "الإسماعيلية", name_en: "Ismailia" },
      { id: 902, city_id: 200, name_ar: "الضبعية", name_en: "Al Dabaeya" },
      { id: 903, city_id: 200, name_ar: "الشيخ زايد", name_en: "Sheikh Zayed" },

      // فايد (id: 201)
      { id: 904, city_id: 201, name_ar: "فايد", name_en: "Fayed" },

      // القنطرة شرق (id: 202)
      {
        id: 905,
        city_id: 202,
        name_ar: "القنطرة شرق",
        name_en: "Qantara Sharq",
      },

      // القنطرة غرب (id: 203)
      {
        id: 906,
        city_id: 203,
        name_ar: "القنطرة غرب",
        name_en: "Qantara Gharb",
      },

      // التل الكبير (id: 204)
      {
        id: 907,
        city_id: 204,
        name_ar: "التل الكبير",
        name_en: "El Tal El Kabier",
      },

      // أبو صوير (id: 205)
      { id: 908, city_id: 205, name_ar: "أبو صوير", name_en: "Abu Sawir" },

      // القصاصين الجديدة (id: 206)
      {
        id: 909,
        city_id: 206,
        name_ar: "القصاصين الجديدة",
        name_en: "Kasasien El Gedida",
      },

      // نفيشة (id: 207)
      { id: 910, city_id: 207, name_ar: "نفيشة", name_en: "Nefesha" },

      // الشيخ زايد (id: 208)
      { id: 911, city_id: 208, name_ar: "الشيخ زايد", name_en: "Sheikh Zayed" },

      // ==================== المنوفية (cities 209-218) ====================

      // شبين الكوم (id: 209)
      {
        id: 912,
        city_id: 209,
        name_ar: "شبين الكوم",
        name_en: "Shbeen El Koom",
      },

      // مدينة السادات (id: 210)
      {
        id: 913,
        city_id: 210,
        name_ar: "مدينة السادات",
        name_en: "Sadat City",
      },

      // منوف (id: 211)
      { id: 914, city_id: 211, name_ar: "منوف", name_en: "Menouf" },

      // سرس الليان (id: 212)
      {
        id: 915,
        city_id: 212,
        name_ar: "سرس الليان",
        name_en: "Sars El-Layan",
      },

      // أشمون (id: 213)
      { id: 916, city_id: 213, name_ar: "أشمون", name_en: "Ashmon" },

      // الباجور (id: 214)
      { id: 917, city_id: 214, name_ar: "الباجور", name_en: "Al Bagor" },

      // قويسنا (id: 215)
      { id: 918, city_id: 215, name_ar: "قويسنا", name_en: "Quesna" },

      // بركة السبع (id: 216)
      {
        id: 919,
        city_id: 216,
        name_ar: "بركة السبع",
        name_en: "Berkat El Saba",
      },

      // تلا (id: 217)
      { id: 920, city_id: 217, name_ar: "تلا", name_en: "Tala" },

      // الشهداء (id: 218)
      { id: 921, city_id: 218, name_ar: "الشهداء", name_en: "Al Shohada" },

      // ==================== المنيا (cities 219-230) ====================

      // المنيا (id: 219)
      { id: 922, city_id: 219, name_ar: "المنيا", name_en: "Minya" },
      {
        id: 923,
        city_id: 219,
        name_ar: "كورنيش النيل",
        name_en: "Nile Corniche",
      },

      // المنيا الجديدة (id: 220)
      {
        id: 924,
        city_id: 220,
        name_ar: "المنيا الجديدة",
        name_en: "Minya El Gedida",
      },

      // العدوة (id: 221)
      { id: 925, city_id: 221, name_ar: "العدوة", name_en: "El Adwa" },

      // مغاغة (id: 222)
      { id: 926, city_id: 222, name_ar: "مغاغة", name_en: "Magagha" },

      // بني مزار (id: 223)
      { id: 927, city_id: 223, name_ar: "بني مزار", name_en: "Bani Mazar" },

      // مطاي (id: 224)
      { id: 928, city_id: 224, name_ar: "مطاي", name_en: "Mattay" },

      // سمالوط (id: 225)
      { id: 929, city_id: 225, name_ar: "سمالوط", name_en: "Samalut" },

      // المدينة الفكرية (id: 226)
      {
        id: 930,
        city_id: 226,
        name_ar: "المدينة الفكرية",
        name_en: "Madinat El Fekria",
      },

      // ملوي (id: 227)
      { id: 931, city_id: 227, name_ar: "ملوي", name_en: "Meloy" },

      // دير مواس (id: 228)
      { id: 932, city_id: 228, name_ar: "دير مواس", name_en: "Deir Mawas" },

      // أبو قرقاص (id: 229)
      { id: 933, city_id: 229, name_ar: "أبو قرقاص", name_en: "Abu Qurqas" },

      // أرض سلطان (id: 230)
      { id: 934, city_id: 230, name_ar: "أرض سلطان", name_en: "Ard Sultan" },

      // ==================== القليوبية (cities 231-242) ====================

      // بنها (id: 231)
      { id: 935, city_id: 231, name_ar: "بنها", name_en: "Banha" },
      {
        id: 936,
        city_id: 231,
        name_ar: "كفر الجزار",
        name_en: "Kafr Al Gazaz",
      },
      { id: 937, city_id: 231, name_ar: "كفر سعد", name_en: "Kafr Saad" },
      { id: 938, city_id: 231, name_ar: "العبور", name_en: "Al Obour" },
      { id: 939, city_id: 231, name_ar: "المرج", name_en: "Al Marg" },
      { id: 940, city_id: 231, name_ar: "طوخ", name_en: "Tukh" },
      { id: 941, city_id: 231, name_ar: "كفر شكر", name_en: "Kafr Shukr" },
      { id: 942, city_id: 231, name_ar: "الخانكة", name_en: "Khanka" },

      // قليوب (id: 232)
      { id: 943, city_id: 232, name_ar: "قليوب", name_en: "Qalyub" },
      { id: 944, city_id: 232, name_ar: "مسطرد", name_en: "Mostorod" },
      { id: 945, city_id: 232, name_ar: "كفر شبرا", name_en: "Kafr Shubra" },
      { id: 946, city_id: 232, name_ar: "سندوة", name_en: "Sandawa" },
      { id: 947, city_id: 232, name_ar: "عزبة نجيب", name_en: "Ezbet Naguib" },

      // شبرا الخيمة (id: 233)
      {
        id: 948,
        city_id: 233,
        name_ar: "شبرا الخيمة",
        name_en: "Shubra Al Khaimah",
      },
      { id: 949, city_id: 233, name_ar: "بهتيم", name_en: "Bahtim" },
      { id: 950, city_id: 233, name_ar: "الخصوص", name_en: "Khosous" },
      { id: 951, city_id: 233, name_ar: "الخانكة", name_en: "Khanka" },
      { id: 952, city_id: 233, name_ar: "مسطرد", name_en: "Mostorod" },
      {
        id: 953,
        city_id: 233,
        name_ar: "عزبة النخل",
        name_en: "Ezbet Al Nakhl",
      },
      {
        id: 954,
        city_id: 233,
        name_ar: "منشية شبرا",
        name_en: "Mansheyat Shubra",
      },
      { id: 955, city_id: 233, name_ar: "كفر شبرا", name_en: "Kafr Shubra" },
      { id: 956, city_id: 233, name_ar: "المرج", name_en: "Al Marg" },

      // القناطر الخيرية (id: 234)
      {
        id: 957,
        city_id: 234,
        name_ar: "القناطر الخيرية",
        name_en: "Al Qanater Charity",
      },
      { id: 958, city_id: 234, name_ar: "أبو غالب", name_en: "Abou Ghalib" },
      { id: 959, city_id: 234, name_ar: "ميت نما", name_en: "Meit Nama" },
      { id: 960, city_id: 234, name_ar: "كفر الحما", name_en: "Kafr Al Hama" },
      {
        id: 961,
        city_id: 234,
        name_ar: "عرب الحصوة",
        name_en: "Arab Al Haswa",
      },
      { id: 962, city_id: 234, name_ar: "سندبيس", name_en: "Sandabees" },
      { id: 963, city_id: 234, name_ar: "كفر طحا", name_en: "Kafr Taha" },

      // الخانكة (id: 235)
      { id: 964, city_id: 235, name_ar: "الخانكة", name_en: "Khanka" },
      {
        id: 965,
        city_id: 235,
        name_ar: "الجبل الأصفر",
        name_en: "Al Gabal Al Asfar",
      },
      { id: 966, city_id: 235, name_ar: "أبو زعبل", name_en: "Abou Zaabal" },
      { id: 967, city_id: 235, name_ar: "المنية", name_en: "Al Manya" },
      { id: 968, city_id: 235, name_ar: "سرياقوس", name_en: "Seryaqos" },
      {
        id: 969,
        city_id: 235,
        name_ar: "عرب العيايدة",
        name_en: "Arab Al Ayayda",
      },
      { id: 970, city_id: 235, name_ar: "كفر حمزة", name_en: "Kafr Hamza" },
      {
        id: 971,
        city_id: 235,
        name_ar: "كفر الجمال",
        name_en: "Kafr Al Gamal",
      },
      { id: 972, city_id: 235, name_ar: "كفر عبيان", name_en: "Kafr Obyan" },

      // كفر شكر (id: 236)
      { id: 973, city_id: 236, name_ar: "كفر شكر", name_en: "Kafr Shukr" },
      {
        id: 974,
        city_id: 236,
        name_ar: "المنشأة الكبرى",
        name_en: "Al Manshaa Al Kobra",
      },
      { id: 975, city_id: 236, name_ar: "كفر منصور", name_en: "Kafr Mansour" },
      { id: 976, city_id: 236, name_ar: "كفر عطية", name_en: "Kafr Atteya" },
      {
        id: 977,
        city_id: 236,
        name_ar: "كفر عبد المؤمن",
        name_en: "Kafr Abdel Momen",
      },
      { id: 978, city_id: 236, name_ar: "عرب الحصة", name_en: "Arab Al Hassa" },
      { id: 979, city_id: 236, name_ar: "الجزيرة", name_en: "Al Gazira" },

      // طوخ (id: 237)
      { id: 980, city_id: 237, name_ar: "طوخ", name_en: "Tukh" },
      { id: 981, city_id: 237, name_ar: "كفر حمزة", name_en: "Kafr Hamza" },
      { id: 982, city_id: 237, name_ar: "كفر عبيان", name_en: "Kafr Obyan" },
      {
        id: 983,
        city_id: 237,
        name_ar: "كفر الجمال",
        name_en: "Kafr Al Gamal",
      },
      {
        id: 984,
        city_id: 237,
        name_ar: "كفر الجزار",
        name_en: "Kafr Al Gazaz",
      },
      { id: 985, city_id: 237, name_ar: "كفر سعد", name_en: "Kafr Saad" },
      { id: 986, city_id: 237, name_ar: "كفر منصور", name_en: "Kafr Mansour" },
      { id: 987, city_id: 237, name_ar: "كفر عطية", name_en: "Kafr Atteya" },
      {
        id: 988,
        city_id: 237,
        name_ar: "كفر عبد المؤمن",
        name_en: "Kafr Abdel Momen",
      },
      {
        id: 989,
        city_id: 237,
        name_ar: "عرب العيايدة",
        name_en: "Arab Al Ayayda",
      },
      {
        id: 990,
        city_id: 237,
        name_ar: "عرب الحصوة",
        name_en: "Arab Al Haswa",
      },
      { id: 991, city_id: 237, name_ar: "سندبيس", name_en: "Sandabees" },
      { id: 992, city_id: 237, name_ar: "المنية", name_en: "Al Manya" },
      { id: 993, city_id: 237, name_ar: "سرياقوس", name_en: "Seryaqos" },
      {
        id: 994,
        city_id: 237,
        name_ar: "الجبل الأصفر",
        name_en: "Al Gabal Al Asfar",
      },

      // قها (id: 238)
      { id: 995, city_id: 238, name_ar: "قها", name_en: "Qaha" },
      { id: 996, city_id: 238, name_ar: "كفر قها", name_en: "Kafr Qaha" },
      { id: 997, city_id: 238, name_ar: "عرب قها", name_en: "Arab Qaha" },
      {
        id: 998,
        city_id: 238,
        name_ar: "المنطقة الصناعية - قها",
        name_en: "Industrial Zone - Qaha",
      },

      // العبور (id: 239)
      {
        id: 999,
        city_id: 239,
        name_ar: "الحي الأول - العبور",
        name_en: "First District - Obour",
      },
      {
        id: 1000,
        city_id: 239,
        name_ar: "الحي الثاني - العبور",
        name_en: "Second District - Obour",
      },
      {
        id: 1001,
        city_id: 239,
        name_ar: "الحي الثالث - العبور",
        name_en: "Third District - Obour",
      },
      {
        id: 1002,
        city_id: 239,
        name_ar: "الحي الرابع - العبور",
        name_en: "Fourth District - Obour",
      },
      {
        id: 1003,
        city_id: 239,
        name_ar: "الحي الخامس - العبور",
        name_en: "Fifth District - Obour",
      },
      {
        id: 1004,
        city_id: 239,
        name_ar: "الحي السادس - العبور",
        name_en: "Sixth District - Obour",
      },
      {
        id: 1005,
        city_id: 239,
        name_ar: "الحي السابع - العبور",
        name_en: "Seventh District - Obour",
      },
      {
        id: 1006,
        city_id: 239,
        name_ar: "الحي الثامن - العبور",
        name_en: "Eighth District - Obour",
      },
      {
        id: 1007,
        city_id: 239,
        name_ar: "الحي التاسع - العبور",
        name_en: "Ninth District - Obour",
      },
      {
        id: 1008,
        city_id: 239,
        name_ar: "الحي العاشر - العبور",
        name_en: "Tenth District - Obour",
      },
      {
        id: 1009,
        city_id: 239,
        name_ar: "المنطقة الصناعية - العبور",
        name_en: "Industrial Zone - Obour",
      },
      {
        id: 1010,
        city_id: 239,
        name_ar: "المنطقة التجارية - العبور",
        name_en: "Commercial Zone - Obour",
      },
      {
        id: 1011,
        city_id: 239,
        name_ar: "المنطقة الحرفية - العبور",
        name_en: "Crafts Zone - Obour",
      },

      // الخصوص (id: 240)
      { id: 1012, city_id: 240, name_ar: "الخصوص", name_en: "Khosous" },
      {
        id: 1013,
        city_id: 240,
        name_ar: "عزبة النخل",
        name_en: "Ezbet Al Nakhl",
      },
      {
        id: 1014,
        city_id: 240,
        name_ar: "كفر الخصوص",
        name_en: "Kafr Khosous",
      },
      {
        id: 1015,
        city_id: 240,
        name_ar: "عرب الخصوص",
        name_en: "Arab Khosous",
      },

      // شبين القناطر (id: 241)
      {
        id: 1016,
        city_id: 241,
        name_ar: "شبين القناطر",
        name_en: "Shibin Al Qanater",
      },
      { id: 1017, city_id: 241, name_ar: "كفر شبين", name_en: "Kafr Shibin" },
      { id: 1018, city_id: 241, name_ar: "عرب شبين", name_en: "Arab Shibin" },
      { id: 1019, city_id: 241, name_ar: "المنشية", name_en: "Al Mansheya" },
      {
        id: 1020,
        city_id: 241,
        name_ar: "كفر الجزار",
        name_en: "Kafr Al Gazaz",
      },
      { id: 1021, city_id: 241, name_ar: "كفر سعد", name_en: "Kafr Saad" },

      // مسطرد (id: 242)
      { id: 1022, city_id: 242, name_ar: "مسطرد", name_en: "Mostorod" },
      {
        id: 1023,
        city_id: 242,
        name_ar: "كفر مسطرد",
        name_en: "Kafr Mostorod",
      },
      {
        id: 1024,
        city_id: 242,
        name_ar: "عرب مسطرد",
        name_en: "Arab Mostorod",
      },
      {
        id: 1025,
        city_id: 242,
        name_ar: "عزبة مسطرد",
        name_en: "Ezbet Mostorod",
      },

      // ==================== الوادي الجديد (cities 243-248) ====================

      // الخارجة (id: 243)
      { id: 1026, city_id: 243, name_ar: "الخارجة", name_en: "El Kharga" },
      { id: 1027, city_id: 243, name_ar: "باريس", name_en: "Paris" },
      { id: 1028, city_id: 243, name_ar: "بولاق", name_en: "Boulaq" },
      { id: 1029, city_id: 243, name_ar: "المنيرة", name_en: "Al Munira" },
      { id: 1030, city_id: 243, name_ar: "القصر", name_en: "Al Qasr" },
      { id: 1031, city_id: 243, name_ar: "الغويطة", name_en: "Al Ghweita" },
      { id: 1032, city_id: 243, name_ar: "الزيات", name_en: "Al Zayat" },
      { id: 1033, city_id: 243, name_ar: "ناصر", name_en: "Naser" },

      // باريس (id: 244)
      { id: 1034, city_id: 244, name_ar: "باريس", name_en: "Paris" },
      { id: 1035, city_id: 244, name_ar: "القصر", name_en: "Al Qasr" },
      { id: 1036, city_id: 244, name_ar: "الغويطة", name_en: "Al Ghweita" },

      // موط (id: 245)
      { id: 1037, city_id: 245, name_ar: "موط", name_en: "Mout" },
      { id: 1038, city_id: 245, name_ar: "القصر", name_en: "Al Qasr" },
      { id: 1039, city_id: 245, name_ar: "الغويطة", name_en: "Al Ghweita" },

      // الفرافرة (id: 246)
      { id: 1040, city_id: 246, name_ar: "الفرافرة", name_en: "Farafra" },
      { id: 1041, city_id: 246, name_ar: "أبو منقار", name_en: "Abou Minqar" },
      { id: 1042, city_id: 246, name_ar: "عين دلة", name_en: "Ain Dalla" },

      // بلاط (id: 247)
      { id: 1043, city_id: 247, name_ar: "بلاط", name_en: "Balat" },
      { id: 1044, city_id: 247, name_ar: "الغويطة", name_en: "Al Ghweita" },

      // الداخلة (id: 248)
      { id: 1045, city_id: 248, name_ar: "الداخلة", name_en: "Dakhla" },
      { id: 1046, city_id: 248, name_ar: "موط", name_en: "Mout" },
      { id: 1047, city_id: 248, name_ar: "القصر", name_en: "Al Qasr" },
      { id: 1048, city_id: 248, name_ar: "الغويطة", name_en: "Al Ghweita" },
      { id: 1049, city_id: 248, name_ar: "بولاق", name_en: "Boulaq" },
      { id: 1050, city_id: 248, name_ar: "المنيرة", name_en: "Al Munira" },

      // ==================== السويس (cities 249-253) ====================

      // السويس (id: 249)
      { id: 1051, city_id: 249, name_ar: "الأربعين", name_en: "Al Arba'een" },
      { id: 1052, city_id: 249, name_ar: "عتاقة", name_en: "Ataqah" },
      { id: 1053, city_id: 249, name_ar: "الجناين", name_en: "Alganayen" },
      { id: 1054, city_id: 249, name_ar: "فيصل", name_en: "Faysal" },
      { id: 1055, city_id: 249, name_ar: "بور توفيق", name_en: "Port Tawfik" },
      {
        id: 1056,
        city_id: 249,
        name_ar: "حي السويس",
        name_en: "Suez District",
      },
      {
        id: 1057,
        city_id: 249,
        name_ar: "كورنيش السويس",
        name_en: "Suez Corniche",
      },
      {
        id: 1058,
        city_id: 249,
        name_ar: "شارع الجيش",
        name_en: "Al Geish Street",
      },
      {
        id: 1059,
        city_id: 249,
        name_ar: "شارع 23 يوليو",
        name_en: "23rd July Street",
      },
      {
        id: 1060,
        city_id: 249,
        name_ar: "ميدان الشهداء",
        name_en: "Shohadaa Square",
      },

      // الجناين (id: 250)
      { id: 1061, city_id: 250, name_ar: "الجناين", name_en: "Alganayen" },
      { id: 1062, city_id: 250, name_ar: "السلام", name_en: "Al Salam" },

      // عتاقة (id: 251)
      { id: 1063, city_id: 251, name_ar: "عتاقة", name_en: "Ataqah" },
      { id: 1064, city_id: 251, name_ar: "الأدبية", name_en: "Al Adabiya" },

      // العين السخنة (id: 252)
      {
        id: 1065,
        city_id: 252,
        name_ar: "العين السخنة",
        name_en: "Ain Sokhna",
      },
      { id: 1066, city_id: 252, name_ar: "بورت غالب", name_en: "Port Ghalib" },
      { id: 1067, city_id: 252, name_ar: "كيلو 38", name_en: "Km 38" },
      { id: 1068, city_id: 252, name_ar: "كيلو 45", name_en: "Km 45" },
      { id: 1069, city_id: 252, name_ar: "كيلو 60", name_en: "Km 60" },
      { id: 1070, city_id: 252, name_ar: "كيلو 75", name_en: "Km 75" },
      { id: 1071, city_id: 252, name_ar: "كيلو 90", name_en: "Km 90" },
      { id: 1072, city_id: 252, name_ar: "كيلو 105", name_en: "Km 105" },
      {
        id: 1073,
        city_id: 252,
        name_ar: "منتجعات العين السخنة",
        name_en: "Ain Sokhna Resorts",
      },

      // فيصل (id: 253)
      { id: 1074, city_id: 253, name_ar: "فيصل", name_en: "Faysal" },

      // ==================== أسوان (cities 254-265) ====================

      // أسوان (id: 254)
      { id: 1075, city_id: 254, name_ar: "أسوان", name_en: "Aswan" },
      {
        id: 1076,
        city_id: 254,
        name_ar: "كورنيش النيل",
        name_en: "Nile Corniche",
      },
      {
        id: 1077,
        city_id: 254,
        name_ar: "جزيرة النباتات",
        name_en: "Plantation Island",
      },
      {
        id: 1078,
        city_id: 254,
        name_ar: "جزيرة إلفنتين",
        name_en: "Elephantine Island",
      },
      {
        id: 1079,
        city_id: 254,
        name_ar: "السيل الرفاعي",
        name_en: "Al Seil Al Refaey",
      },
      {
        id: 1080,
        city_id: 254,
        name_ar: "السيل الجديد",
        name_en: "Al Seil Al Gedid",
      },
      { id: 1081, city_id: 254, name_ar: "الطابية", name_en: "Al Tabia" },
      { id: 1082, city_id: 254, name_ar: "الشلال", name_en: "Al Shalal" },
      { id: 1083, city_id: 254, name_ar: "الخزان", name_en: "Al Khazan" },
      { id: 1084, city_id: 254, name_ar: "جبل تقوق", name_en: "Gabal Taqoq" },
      {
        id: 1085,
        city_id: 254,
        name_ar: "منطقة الآثار",
        name_en: "Antiquities Area",
      },

      // أسوان الجديدة (id: 255)
      {
        id: 1086,
        city_id: 255,
        name_ar: "أسوان الجديدة",
        name_en: "Aswan El Gedida",
      },
      {
        id: 1087,
        city_id: 255,
        name_ar: "الحي الأول - أسوان الجديدة",
        name_en: "First District - New Aswan",
      },
      {
        id: 1088,
        city_id: 255,
        name_ar: "الحي الثاني - أسوان الجديدة",
        name_en: "Second District - New Aswan",
      },
      {
        id: 1089,
        city_id: 255,
        name_ar: "الحي الثالث - أسوان الجديدة",
        name_en: "Third District - New Aswan",
      },
      {
        id: 1090,
        city_id: 255,
        name_ar: "الحي الرابع - أسوان الجديدة",
        name_en: "Fourth District - New Aswan",
      },
      {
        id: 1091,
        city_id: 255,
        name_ar: "الحي الخامس - أسوان الجديدة",
        name_en: "Fifth District - New Aswan",
      },

      // دراو (id: 256)
      { id: 1092, city_id: 256, name_ar: "دراو", name_en: "Drau" },
      { id: 1093, city_id: 256, name_ar: "الجعافرة", name_en: "Al Ga'afra" },

      // كوم أمبو (id: 257)
      { id: 1094, city_id: 257, name_ar: "كوم أمبو", name_en: "Kom Ombo" },
      {
        id: 1095,
        city_id: 257,
        name_ar: "معبد كوم أمبو",
        name_en: "Kom Ombo Temple",
      },
      { id: 1096, city_id: 257, name_ar: "الرغامة", name_en: "Al Ragama" },

      // نصر النوبة (id: 258)
      {
        id: 1097,
        city_id: 258,
        name_ar: "نصر النوبة",
        name_en: "Nasr Al Nuba",
      },
      { id: 1098, city_id: 258, name_ar: "كلابشة", name_en: "Kalabsha" },

      // كلابشة (id: 259)
      { id: 1099, city_id: 259, name_ar: "كلابشة", name_en: "Kalabsha" },
      {
        id: 1100,
        city_id: 259,
        name_ar: "معبد كلابشة",
        name_en: "Kalabsha Temple",
      },

      // إدفو (id: 260)
      { id: 1101, city_id: 260, name_ar: "إدفو", name_en: "Edfu" },
      { id: 1102, city_id: 260, name_ar: "معبد إدفو", name_en: "Edfu Temple" },
      { id: 1103, city_id: 260, name_ar: "الرديسية", name_en: "Al Radisiya" },
      { id: 1104, city_id: 260, name_ar: "البصيلية", name_en: "Al Basilia" },

      // الرديسية (id: 261)
      { id: 1105, city_id: 261, name_ar: "الرديسية", name_en: "Al-Radisiyah" },
      {
        id: 1106,
        city_id: 261,
        name_ar: "الرديسية بحري",
        name_en: "Al Radisiya Bahary",
      },
      {
        id: 1107,
        city_id: 261,
        name_ar: "الرديسية قبلي",
        name_en: "Al Radisiya Qebly",
      },

      // البصيلية (id: 262)
      { id: 1108, city_id: 262, name_ar: "البصيلية", name_en: "Al Basilia" },
      {
        id: 1109,
        city_id: 262,
        name_ar: "البصيلية بحري",
        name_en: "Al Basilia Bahary",
      },
      {
        id: 1110,
        city_id: 262,
        name_ar: "البصيلية قبلي",
        name_en: "Al Basilia Qebly",
      },

      // السباعية (id: 263)
      { id: 1111, city_id: 263, name_ar: "السباعية", name_en: "Al Sibaeia" },

      // أبو سمبل السياحية (id: 264)
      { id: 1112, city_id: 264, name_ar: "أبو سمبل", name_en: "Abu Simbel" },
      {
        id: 1113,
        city_id: 264,
        name_ar: "معبد أبو سمبل",
        name_en: "Abu Simbel Temple",
      },
      {
        id: 1114,
        city_id: 264,
        name_ar: "قرية أبو سمبل",
        name_en: "Abu Simbel Village",
      },

      // مرسى علم (id: 265)
      { id: 1115, city_id: 265, name_ar: "مرسى علم", name_en: "Marsa Alam" },
      { id: 1116, city_id: 265, name_ar: "شلاتين", name_en: "Shalatin" },
      { id: 1117, city_id: 265, name_ar: "برنيس", name_en: "Bernice" },
      { id: 1118, city_id: 265, name_ar: "حماطة", name_en: "Hamata" },

      // ==================== أسيوط (cities 266-276) ====================

      // أسيوط (id: 266)
      { id: 1119, city_id: 266, name_ar: "أسيوط", name_en: "Assiut" },
      {
        id: 1120,
        city_id: 266,
        name_ar: "ميدان المجذوب",
        name_en: "Al Magzoub Square",
      },
      {
        id: 1121,
        city_id: 266,
        name_ar: "شارع الجمهورية",
        name_en: "Al Gomhoreya Street",
      },
      { id: 1122, city_id: 266, name_ar: "الوليدية", name_en: "Al Walideya" },
      { id: 1123, city_id: 266, name_ar: "الحمراء", name_en: "Al Hamraa" },
      {
        id: 1124,
        city_id: 266,
        name_ar: "عرب المدابغ",
        name_en: "Arab Al Madabeg",
      },
      {
        id: 1125,
        city_id: 266,
        name_ar: "جامعة أسيوط",
        name_en: "Assiut University",
      },
      {
        id: 1126,
        city_id: 266,
        name_ar: "كورنيش أسيوط",
        name_en: "Assiut Corniche",
      },

      // أسيوط الجديدة (id: 267)
      {
        id: 1127,
        city_id: 267,
        name_ar: "أسيوط الجديدة",
        name_en: "Assiut El Gedida",
      },
      {
        id: 1128,
        city_id: 267,
        name_ar: "الحي الأول - أسيوط الجديدة",
        name_en: "First District - New Assiut",
      },
      {
        id: 1129,
        city_id: 267,
        name_ar: "الحي الثاني - أسيوط الجديدة",
        name_en: "Second District - New Assiut",
      },
      {
        id: 1130,
        city_id: 267,
        name_ar: "الحي الثالث - أسيوط الجديدة",
        name_en: "Third District - New Assiut",
      },
      {
        id: 1131,
        city_id: 267,
        name_ar: "الحي الرابع - أسيوط الجديدة",
        name_en: "Fourth District - New Assiut",
      },
      {
        id: 1132,
        city_id: 267,
        name_ar: "المنطقة الصناعية - أسيوط الجديدة",
        name_en: "Industrial Zone - New Assiut",
      },

      // ديروط (id: 268)
      { id: 1133, city_id: 268, name_ar: "ديروط", name_en: "Dayrout" },

      // منفلوط (id: 269)
      { id: 1134, city_id: 269, name_ar: "منفلوط", name_en: "Manfalut" },

      // القوصية (id: 270)
      { id: 1135, city_id: 270, name_ar: "القوصية", name_en: "Qusiya" },

      // أبنوب (id: 271)
      { id: 1136, city_id: 271, name_ar: "أبنوب", name_en: "Abnoub" },

      // أبو تيج (id: 272)
      { id: 1137, city_id: 272, name_ar: "أبو تيج", name_en: "Abu Tig" },

      // الغنايم (id: 273)
      { id: 1138, city_id: 273, name_ar: "الغنايم", name_en: "El Ghanaim" },

      // ساحل سليم (id: 274)
      { id: 1139, city_id: 274, name_ar: "ساحل سليم", name_en: "Sahel Selim" },

      // البداري (id: 275)
      { id: 1140, city_id: 275, name_ar: "البداري", name_en: "El Badari" },

      // سدفا (id: 276)
      { id: 1141, city_id: 276, name_ar: "صدفا", name_en: "Sidfa" },

      // ==================== بني سويف (cities 277-286) ====================

      // بني سويف (id: 277)
      { id: 1142, city_id: 277, name_ar: "بني سويف", name_en: "Bani Sweif" },
      {
        id: 1143,
        city_id: 277,
        name_ar: "شارع صلاح سالم",
        name_en: "Salah Salem Street",
      },
      {
        id: 1144,
        city_id: 277,
        name_ar: "ميدان الزراعة",
        name_en: "Al Zeraa Square",
      },

      // بني سويف الجديدة (id: 278)
      {
        id: 1145,
        city_id: 278,
        name_ar: "بني سويف الجديدة",
        name_en: "Beni Suef El Gedida",
      },
      {
        id: 1146,
        city_id: 278,
        name_ar: "الحي الأول - بني سويف الجديدة",
        name_en: "First District - New Beni Suef",
      },
      {
        id: 1147,
        city_id: 278,
        name_ar: "الحي الثاني - بني سويف الجديدة",
        name_en: "Second District - New Beni Suef",
      },
      {
        id: 1148,
        city_id: 278,
        name_ar: "الحي الثالث - بني سويف الجديدة",
        name_en: "Third District - New Beni Suef",
      },

      // الواسطى (id: 279)
      { id: 1149, city_id: 279, name_ar: "الواسطى", name_en: "Al Wasta" },

      // ناصر (id: 280)
      { id: 1150, city_id: 280, name_ar: "ناصر", name_en: "Naser" },

      // إهناسيا (id: 281)
      { id: 1151, city_id: 281, name_ar: "إهناسيا", name_en: "Ehnasia" },

      // ببا (id: 282)
      { id: 1152, city_id: 282, name_ar: "ببا", name_en: "beba" },

      // الفشن (id: 283)
      { id: 1153, city_id: 283, name_ar: "الفشن", name_en: "Fashn" },

      // سمسطا (id: 284)
      { id: 1154, city_id: 284, name_ar: "سمسطا", name_en: "Somasta" },

      // الأباصيري (id: 285)
      { id: 1155, city_id: 285, name_ar: "الأباصيري", name_en: "Alabbaseri" },

      // مقبل (id: 286)
      { id: 1156, city_id: 286, name_ar: "مقبل", name_en: "Mokbel" },

      // ==================== بورسعيد (cities 287-294) ====================

      // بورسعيد (id: 287)
      { id: 1157, city_id: 287, name_ar: "بورسعيد", name_en: "PorSaid" },
      {
        id: 1158,
        city_id: 287,
        name_ar: "حي الشرق",
        name_en: "Al Sharq District",
      },
      {
        id: 1159,
        city_id: 287,
        name_ar: "حي العرب",
        name_en: "Al Arab District",
      },
      {
        id: 1160,
        city_id: 287,
        name_ar: "حي الزهور",
        name_en: "Al Zohour District",
      },
      {
        id: 1161,
        city_id: 287,
        name_ar: "حي المناخ",
        name_en: "Al Manakh District",
      },
      {
        id: 1162,
        city_id: 287,
        name_ar: "حي الضواحي",
        name_en: "Al Dawahi District",
      },
      {
        id: 1163,
        city_id: 287,
        name_ar: "حي مبارك",
        name_en: "Mubarak District",
      },
      {
        id: 1164,
        city_id: 287,
        name_ar: "حي الجنوب",
        name_en: "Al Ganoob District",
      },
      {
        id: 1165,
        city_id: 287,
        name_ar: "كورنيش بورسعيد",
        name_en: "Port Said Corniche",
      },
      {
        id: 1166,
        city_id: 287,
        name_ar: "شارع 23 يوليو",
        name_en: "23rd July Street",
      },
      {
        id: 1167,
        city_id: 287,
        name_ar: "شارع طرح البحر",
        name_en: "Tarh Al Bahr Street",
      },
      {
        id: 1168,
        city_id: 287,
        name_ar: "سوق بورسعيد",
        name_en: "Port Said Market",
      },

      // بورفؤاد (id: 288)
      { id: 1169, city_id: 288, name_ar: "بورفؤاد", name_en: "Port Fouad" },
      {
        id: 1170,
        city_id: 288,
        name_ar: "حي بورفؤاد",
        name_en: "Port Fouad District",
      },
      {
        id: 1171,
        city_id: 288,
        name_ar: "كورنيش بورفؤاد",
        name_en: "Port Fouad Corniche",
      },

      // العرب (id: 289)
      {
        id: 1172,
        city_id: 289,
        name_ar: "حي العرب",
        name_en: "Alarab District",
      },

      // حي الزهور (id: 290)
      {
        id: 1173,
        city_id: 290,
        name_ar: "حي الزهور",
        name_en: "Zohour District",
      },

      // حي الشرق (id: 291)
      {
        id: 1174,
        city_id: 291,
        name_ar: "حي الشرق",
        name_en: "Alsharq District",
      },

      // حي الضواحي (id: 292)
      {
        id: 1175,
        city_id: 292,
        name_ar: "حي الضواحي",
        name_en: "Aldawahi District",
      },

      // حي المناخ (id: 293)
      {
        id: 1176,
        city_id: 293,
        name_ar: "حي المناخ",
        name_en: "Almanakh District",
      },

      // حي مبارك (id: 294)
      {
        id: 1177,
        city_id: 294,
        name_ar: "حي مبارك",
        name_en: "Mubarak District",
      },

      // ==================== دمياط (cities 295-305) ====================

      // دمياط (id: 295)
      { id: 1178, city_id: 295, name_ar: "دمياط", name_en: "Damietta" },
      { id: 1179, city_id: 295, name_ar: "شطا", name_en: "Shatta" },
      { id: 1180, city_id: 295, name_ar: "العدلية", name_en: "Al Adleya" },
      { id: 1181, city_id: 295, name_ar: "الروضة", name_en: "Al Rawda" },
      {
        id: 1182,
        city_id: 295,
        name_ar: "كورنيش دمياط",
        name_en: "Damietta Corniche",
      },

      // دمياط الجديدة (id: 296)
      {
        id: 1183,
        city_id: 296,
        name_ar: "دمياط الجديدة",
        name_en: "New Damietta",
      },
      {
        id: 1184,
        city_id: 296,
        name_ar: "الحي الأول - دمياط الجديدة",
        name_en: "First District - New Damietta",
      },
      {
        id: 1185,
        city_id: 296,
        name_ar: "الحي الثاني - دمياط الجديدة",
        name_en: "Second District - New Damietta",
      },
      {
        id: 1186,
        city_id: 296,
        name_ar: "الحي الثالث - دمياط الجديدة",
        name_en: "Third District - New Damietta",
      },
      {
        id: 1187,
        city_id: 296,
        name_ar: "الحي الرابع - دمياط الجديدة",
        name_en: "Fourth District - New Damietta",
      },
      {
        id: 1188,
        city_id: 296,
        name_ar: "الحي الخامس - دمياط الجديدة",
        name_en: "Fifth District - New Damietta",
      },
      {
        id: 1189,
        city_id: 296,
        name_ar: "المنطقة الصناعية - دمياط الجديدة",
        name_en: "Industrial Zone - New Damietta",
      },

      // رأس البر (id: 297)
      { id: 1190, city_id: 297, name_ar: "رأس البر", name_en: "Ras El Bar" },
      {
        id: 1191,
        city_id: 297,
        name_ar: "شاطئ رأس البر",
        name_en: "Ras El Bar Beach",
      },
      {
        id: 1192,
        city_id: 297,
        name_ar: "كورنيش رأس البر",
        name_en: "Ras El Bar Corniche",
      },

      // فارسكور (id: 298)
      { id: 1193, city_id: 298, name_ar: "فارسكور", name_en: "Faraskour" },

      // الزرقا (id: 299)
      { id: 1194, city_id: 299, name_ar: "الزرقا", name_en: "Zarqa" },

      // السرو (id: 300)
      { id: 1195, city_id: 300, name_ar: "السرو", name_en: "alsaru" },

      // الروضة (id: 301)
      { id: 1196, city_id: 301, name_ar: "الروضة", name_en: "alruwda" },

      // كفر البطيخ (id: 302)
      {
        id: 1197,
        city_id: 302,
        name_ar: "كفر البطيخ",
        name_en: "Kafr El-Batikh",
      },

      // عزبة البرج (id: 303)
      {
        id: 1198,
        city_id: 303,
        name_ar: "عزبة البرج",
        name_en: "Azbet Al Burg",
      },

      // ميت أبو غالب (id: 304)
      {
        id: 1199,
        city_id: 304,
        name_ar: "ميت أبو غالب",
        name_en: "Meet Abou Ghalib",
      },

      // كفر سعد (id: 305)
      { id: 1200, city_id: 305, name_ar: "كفر سعد", name_en: "Kafr Saad" },

      // ==================== الشرقية (cities 306-324) ====================

      // الزقازيق (id: 306)
      { id: 1201, city_id: 306, name_ar: "الزقازيق", name_en: "Zagazig" },
      { id: 1202, city_id: 306, name_ar: "المنشية", name_en: "Al Mansheya" },
      { id: 1203, city_id: 306, name_ar: "السعادة", name_en: "Al Saada" },
      { id: 1204, city_id: 306, name_ar: "الزهور", name_en: "Al Zohour" },
      {
        id: 1205,
        city_id: 306,
        name_ar: "جامعة الزقازيق",
        name_en: "Zagazig University",
      },
      {
        id: 1206,
        city_id: 306,
        name_ar: "شارع الجيش",
        name_en: "Al Geish Street",
      },
      {
        id: 1207,
        city_id: 306,
        name_ar: "ميدان الحسبة",
        name_en: "Al Hesba Square",
      },

      // العاشر من رمضان (id: 307)
      {
        id: 1208,
        city_id: 307,
        name_ar: "العاشر من رمضان",
        name_en: "Al Ashr Men Ramadan",
      },
      {
        id: 1209,
        city_id: 307,
        name_ar: "الحي الأول - العاشر",
        name_en: "First District - 10th of Ramadan",
      },
      {
        id: 1210,
        city_id: 307,
        name_ar: "الحي الثاني - العاشر",
        name_en: "Second District - 10th of Ramadan",
      },
      {
        id: 1211,
        city_id: 307,
        name_ar: "الحي الثالث - العاشر",
        name_en: "Third District - 10th of Ramadan",
      },
      {
        id: 1212,
        city_id: 307,
        name_ar: "الحي الرابع - العاشر",
        name_en: "Fourth District - 10th of Ramadan",
      },
      {
        id: 1213,
        city_id: 307,
        name_ar: "الحي الخامس - العاشر",
        name_en: "Fifth District - 10th of Ramadan",
      },
      {
        id: 1214,
        city_id: 307,
        name_ar: "الحي السادس - العاشر",
        name_en: "Sixth District - 10th of Ramadan",
      },
      {
        id: 1215,
        city_id: 307,
        name_ar: "الحي السابع - العاشر",
        name_en: "Seventh District - 10th of Ramadan",
      },
      {
        id: 1216,
        city_id: 307,
        name_ar: "الحي الثامن - العاشر",
        name_en: "Eighth District - 10th of Ramadan",
      },
      {
        id: 1217,
        city_id: 307,
        name_ar: "الحي التاسع - العاشر",
        name_en: "Ninth District - 10th of Ramadan",
      },
      {
        id: 1218,
        city_id: 307,
        name_ar: "الحي العاشر - العاشر",
        name_en: "Tenth District - 10th of Ramadan",
      },
      {
        id: 1219,
        city_id: 307,
        name_ar: "المنطقة الصناعية الأولى",
        name_en: "First Industrial Zone",
      },
      {
        id: 1220,
        city_id: 307,
        name_ar: "المنطقة الصناعية الثانية",
        name_en: "Second Industrial Zone",
      },
      {
        id: 1221,
        city_id: 307,
        name_ar: "المنطقة الصناعية الثالثة",
        name_en: "Third Industrial Zone",
      },
      {
        id: 1222,
        city_id: 307,
        name_ar: "المنطقة الصناعية الرابعة",
        name_en: "Fourth Industrial Zone",
      },
      {
        id: 1223,
        city_id: 307,
        name_ar: "المنطقة الصناعية الخامسة",
        name_en: "Fifth Industrial Zone",
      },

      // منيا القمح (id: 308)
      {
        id: 1224,
        city_id: 308,
        name_ar: "منيا القمح",
        name_en: "Minya Al Qamh",
      },

      // بلبيس (id: 309)
      { id: 1225, city_id: 309, name_ar: "بلبيس", name_en: "Belbeis" },

      // مشتول السوق (id: 310)
      {
        id: 1226,
        city_id: 310,
        name_ar: "مشتول السوق",
        name_en: "Mashtoul El Souq",
      },

      // القنايات (id: 311)
      { id: 1227, city_id: 311, name_ar: "القنايات", name_en: "Qenaiat" },

      // أبو حماد (id: 312)
      { id: 1228, city_id: 312, name_ar: "أبو حماد", name_en: "Abu Hammad" },

      // القرين (id: 313)
      { id: 1229, city_id: 313, name_ar: "القرين", name_en: "El Qurain" },

      // ههيا (id: 314)
      { id: 1230, city_id: 314, name_ar: "ههيا", name_en: "Hehia" },

      // أبو كبير (id: 315)
      { id: 1231, city_id: 315, name_ar: "أبو كبير", name_en: "Abu Kabir" },

      // فاقوس (id: 316)
      { id: 1232, city_id: 316, name_ar: "فاقوس", name_en: "Faccus" },

      // الصالحية الجديدة (id: 317)
      {
        id: 1233,
        city_id: 317,
        name_ar: "الصالحية الجديدة",
        name_en: "El Salihia El Gedida",
      },

      // الإبراهيمية (id: 318)
      {
        id: 1234,
        city_id: 318,
        name_ar: "الإبراهيمية",
        name_en: "Al Ibrahimiyah",
      },

      // ديرب نجم (id: 319)
      { id: 1235, city_id: 319, name_ar: "ديرب نجم", name_en: "Deirb Negm" },

      // كفر صقر (id: 320)
      { id: 1236, city_id: 320, name_ar: "كفر صقر", name_en: "Kafr Saqr" },

      // أولاد صقر (id: 321)
      { id: 1237, city_id: 321, name_ar: "أولاد صقر", name_en: "Awlad Saqr" },

      // الحسينية (id: 322)
      { id: 1238, city_id: 322, name_ar: "الحسينية", name_en: "Husseiniya" },

      // صان الحجر القبلية (id: 323)
      {
        id: 1239,
        city_id: 323,
        name_ar: "صان الحجر القبلية",
        name_en: "san alhajar alqablia",
      },

      // منشأة أبو عمر (id: 324)
      {
        id: 1240,
        city_id: 324,
        name_ar: "منشأة أبو عمر",
        name_en: "Manshayat Abu Omar",
      },

      // ==================== جنوب سيناء (cities 325-333) ====================

      // الطور (id: 325)
      { id: 1241, city_id: 325, name_ar: "الطور", name_en: "Al Toor" },

      // شرم الشيخ (id: 326)
      {
        id: 1242,
        city_id: 326,
        name_ar: "شرم الشيخ",
        name_en: "Sharm El-Shaikh",
      },
      { id: 1243, city_id: 326, name_ar: "نعمة باي", name_en: "Naama Bay" },
      {
        id: 1244,
        city_id: 326,
        name_ar: "الحديقة الوطنية",
        name_en: "National Park",
      },
      { id: 1245, city_id: 326, name_ar: "رأس نصراني", name_en: "Ras Nasrani" },
      { id: 1246, city_id: 326, name_ar: "خليج نعمة", name_en: "Naama Bay" },
      {
        id: 1247,
        city_id: 326,
        name_ar: "شرم المية",
        name_en: "Sharm El Maya",
      },
      { id: 1248, city_id: 326, name_ar: "المنتزه", name_en: "Al Montaza" },
      {
        id: 1249,
        city_id: 326,
        name_ar: "حدائق شرم",
        name_en: "Sharm Gardens",
      },
      { id: 1250, city_id: 326, name_ar: "خليج القرش", name_en: "Sharks Bay" },

      // دهب (id: 327)
      { id: 1251, city_id: 327, name_ar: "دهب", name_en: "Dahab" },
      { id: 1252, city_id: 327, name_ar: "المسيلة", name_en: "Al Masila" },
      { id: 1253, city_id: 327, name_ar: "اللاجونة", name_en: "Lagonna" },

      // نويبع (id: 328)
      { id: 1254, city_id: 328, name_ar: "نويبع", name_en: "Nuweiba" },
      { id: 1255, city_id: 328, name_ar: "المويلح", name_en: "Al Moweylah" },
      { id: 1256, city_id: 328, name_ar: "طابا", name_en: "Taba" },

      // طابا (id: 329)
      { id: 1257, city_id: 329, name_ar: "طابا", name_en: "Taba" },
      {
        id: 1258,
        city_id: 329,
        name_ar: "طابا هايتس",
        name_en: "Taba Heights",
      },

      // سانت كاترين (id: 330)
      {
        id: 1259,
        city_id: 330,
        name_ar: "سانت كاترين",
        name_en: "Saint Catherine",
      },
      {
        id: 1260,
        city_id: 330,
        name_ar: "دير سانت كاترين",
        name_en: "Saint Catherine Monastery",
      },
      { id: 1261, city_id: 330, name_ar: "جبل موسى", name_en: "Mount Moses" },

      // أبو رديس (id: 331)
      { id: 1262, city_id: 331, name_ar: "أبو رديس", name_en: "Abu Redis" },

      // أبو زنيمة (id: 332)
      { id: 1263, city_id: 332, name_ar: "أبو زنيمة", name_en: "Abu Zenaima" },

      // رأس سدر (id: 333)
      { id: 1264, city_id: 333, name_ar: "رأس سدر", name_en: "Ras Sidr" },

      // ==================== كفر الشيخ (cities 334-347) ====================

      // كفر الشيخ (id: 334)
      {
        id: 1265,
        city_id: 334,
        name_ar: "كفر الشيخ",
        name_en: "Kafr El Sheikh",
      },
      { id: 1266, city_id: 334, name_ar: "الرياض", name_en: "Riyadh" },
      { id: 1267, city_id: 334, name_ar: "سيدي غازي", name_en: "Sidi Ghazi" },

      // وسط البلد كفر الشيخ (id: 335)
      { id: 1268, city_id: 335, name_ar: "وسط البلد", name_en: "Downtown" },
      {
        id: 1269,
        city_id: 335,
        name_ar: "ميدان العاصي",
        name_en: "Al Aassy Square",
      },

      // دسوق (id: 336)
      { id: 1270, city_id: 336, name_ar: "دسوق", name_en: "Desouq" },

      // فوه (id: 337)
      { id: 1271, city_id: 337, name_ar: "فوه", name_en: "Fooh" },

      // مطوبس (id: 338)
      { id: 1272, city_id: 338, name_ar: "مطوبس", name_en: "Metobas" },

      // برج البرلس (id: 339)
      {
        id: 1273,
        city_id: 339,
        name_ar: "برج البرلس",
        name_en: "Burg Al Burullus",
      },

      // بلطيم (id: 340)
      { id: 1274, city_id: 340, name_ar: "بلطيم", name_en: "Baltim" },

      // مصيف بلطيم (id: 341)
      {
        id: 1275,
        city_id: 341,
        name_ar: "مصيف بلطيم",
        name_en: "Masief Baltim",
      },

      // الحامول (id: 342)
      { id: 1276, city_id: 342, name_ar: "الحامول", name_en: "Hamol" },

      // بيلا (id: 343)
      { id: 1277, city_id: 343, name_ar: "بيلا", name_en: "Bella" },

      // الرياض (id: 344)
      { id: 1278, city_id: 344, name_ar: "الرياض", name_en: "Riyadh" },

      // سيدي سالم (id: 345)
      { id: 1279, city_id: 345, name_ar: "سيدي سالم", name_en: "Sidi Salm" },

      // قلين (id: 346)
      { id: 1280, city_id: 346, name_ar: "قلين", name_en: "Qellen" },

      // سيدي غازي (id: 347)
      { id: 1281, city_id: 347, name_ar: "سيدي غازي", name_en: "Sidi Ghazi" },

      // ==================== مطروح (cities 348-357) ====================

      // مرسى مطروح (id: 348)
      {
        id: 1282,
        city_id: 348,
        name_ar: "مرسى مطروح",
        name_en: "Marsa Matrouh",
      },
      { id: 1283, city_id: 348, name_ar: "الكورنيش", name_en: "Corniche" },
      {
        id: 1284,
        city_id: 348,
        name_ar: "شاطئ روميل",
        name_en: "Rommel Beach",
      },
      { id: 1285, city_id: 348, name_ar: "شاطئ عجيبة", name_en: "Agiba Beach" },
      { id: 1286, city_id: 348, name_ar: "شاطئ الليدو", name_en: "Lido Beach" },

      // الحمام (id: 349)
      { id: 1287, city_id: 349, name_ar: "الحمام", name_en: "El Hamam" },

      // العلمين (id: 350)
      { id: 1288, city_id: 350, name_ar: "العلمين", name_en: "Alamein" },
      {
        id: 1289,
        city_id: 350,
        name_ar: "قرية مراسي",
        name_en: "Marassi Village",
      },
      {
        id: 1290,
        city_id: 350,
        name_ar: "قرية سيدي عبد الرحمن",
        name_en: "Sidi Abdel Rahman Village",
      },

      // الضبعة (id: 351)
      { id: 1291, city_id: 351, name_ar: "الضبعة", name_en: "Dabaa" },

      // النجيلة (id: 352)
      { id: 1292, city_id: 352, name_ar: "النجيلة", name_en: "Al-Nagila" },

      // سيدي براني (id: 353)
      { id: 1293, city_id: 353, name_ar: "سيدي براني", name_en: "Sidi Brani" },

      // السلوم (id: 354)
      { id: 1294, city_id: 354, name_ar: "السلوم", name_en: "Salloum" },

      // سيوة (id: 355)
      { id: 1295, city_id: 355, name_ar: "سيوة", name_en: "Siwa" },
      { id: 1296, city_id: 355, name_ar: "شالي", name_en: "Shali" },
      {
        id: 1297,
        city_id: 355,
        name_ar: "جبل الموتى",
        name_en: "Mountain of the Dead",
      },
      {
        id: 1298,
        city_id: 355,
        name_ar: "عين كليوباترا",
        name_en: "Cleopatra Spring",
      },

      // مارينا (id: 356)
      { id: 1299, city_id: 356, name_ar: "مارينا", name_en: "Marina" },

      // الساحل الشمالي (id: 357)
      {
        id: 1300,
        city_id: 357,
        name_ar: "الساحل الشمالي",
        name_en: "North Coast",
      },
      {
        id: 1301,
        city_id: 357,
        name_ar: "سيدي عبد الرحمن",
        name_en: "Sidi Abdel Rahman",
      },
      { id: 1302, city_id: 357, name_ar: "مراسي", name_en: "Marassi" },
      { id: 1303, city_id: 357, name_ar: "هيلوبوليس", name_en: "Heliopolis" },
      { id: 1304, city_id: 357, name_ar: "أمواج", name_en: "Amwaj" },

      // ==================== الأقصر (cities 358-366) ====================

      // الأقصر (id: 358)
      { id: 1305, city_id: 358, name_ar: "الأقصر", name_en: "Luxor" },
      { id: 1306, city_id: 358, name_ar: "الكرنك", name_en: "Karnak" },
      {
        id: 1307,
        city_id: 358,
        name_ar: "معبد الأقصر",
        name_en: "Luxor Temple",
      },
      { id: 1308, city_id: 358, name_ar: "البر الغربي", name_en: "West Bank" },
      {
        id: 1309,
        city_id: 358,
        name_ar: "وادي الملوك",
        name_en: "Valley of the Kings",
      },
      {
        id: 1310,
        city_id: 358,
        name_ar: "وادي الملكات",
        name_en: "Valley of the Queens",
      },
      {
        id: 1311,
        city_id: 358,
        name_ar: "الدير البحري",
        name_en: "Deir Al Bahari",
      },
      { id: 1312, city_id: 358, name_ar: "البر الشرقي", name_en: "East Bank" },
      {
        id: 1313,
        city_id: 358,
        name_ar: "جزيرة الموز",
        name_en: "Banana Island",
      },
      {
        id: 1314,
        city_id: 358,
        name_ar: "كورنيش النيل",
        name_en: "Nile Corniche",
      },
      {
        id: 1315,
        city_id: 358,
        name_ar: "شارع التلفزيون",
        name_en: "Telfazion Street",
      },
      {
        id: 1316,
        city_id: 358,
        name_ar: "شارع المحطة",
        name_en: "Al Mahatta Street",
      },

      // الأقصر الجديدة (id: 359)
      {
        id: 1317,
        city_id: 359,
        name_ar: "الأقصر الجديدة",
        name_en: "New Luxor",
      },
      {
        id: 1318,
        city_id: 359,
        name_ar: "الحي الأول - الأقصر الجديدة",
        name_en: "First District - New Luxor",
      },
      {
        id: 1319,
        city_id: 359,
        name_ar: "الحي الثاني - الأقصر الجديدة",
        name_en: "Second District - New Luxor",
      },
      {
        id: 1320,
        city_id: 359,
        name_ar: "الحي الثالث - الأقصر الجديدة",
        name_en: "Third District - New Luxor",
      },

      // إسنا (id: 360)
      { id: 1321, city_id: 360, name_ar: "إسنا", name_en: "Esna" },

      // طيبة الجديدة (id: 361)
      { id: 1322, city_id: 361, name_ar: "طيبة الجديدة", name_en: "New Tiba" },

      // الزينية (id: 362)
      { id: 1323, city_id: 362, name_ar: "الزينية", name_en: "Al ziynia" },

      // البياضية (id: 363)
      { id: 1324, city_id: 363, name_ar: "البياضية", name_en: "Al Bayadieh" },

      // القرنة (id: 364)
      { id: 1325, city_id: 364, name_ar: "القرنة", name_en: "Al Qarna" },

      // أرمنت (id: 365)
      { id: 1326, city_id: 365, name_ar: "أرمنت", name_en: "Armant" },

      // الطود (id: 366)
      { id: 1327, city_id: 366, name_ar: "الطود", name_en: "Al Tud" },

      // ==================== قنا (cities 367-376) ====================

      // قنا (id: 367)
      { id: 1328, city_id: 367, name_ar: "قنا", name_en: "Qena" },
      {
        id: 1329,
        city_id: 367,
        name_ar: "كورنيش النيل",
        name_en: "Nile Corniche",
      },
      {
        id: 1330,
        city_id: 367,
        name_ar: "شارع سعد زغلول",
        name_en: "Saad Zaghloul Street",
      },

      // قنا الجديدة (id: 368)
      { id: 1331, city_id: 368, name_ar: "قنا الجديدة", name_en: "New Qena" },
      {
        id: 1332,
        city_id: 368,
        name_ar: "الحي الأول - قنا الجديدة",
        name_en: "First District - New Qena",
      },
      {
        id: 1333,
        city_id: 368,
        name_ar: "الحي الثاني - قنا الجديدة",
        name_en: "Second District - New Qena",
      },
      {
        id: 1334,
        city_id: 368,
        name_ar: "الحي الثالث - قنا الجديدة",
        name_en: "Third District - New Qena",
      },

      // أبو طشت (id: 369)
      { id: 1335, city_id: 369, name_ar: "أبو طشت", name_en: "Abu Tesht" },

      // نجع حمادي (id: 370)
      { id: 1336, city_id: 370, name_ar: "نجع حمادي", name_en: "Nag Hammadi" },

      // دشنا (id: 371)
      { id: 1337, city_id: 371, name_ar: "دشنا", name_en: "Deshna" },

      // الوقف (id: 372)
      { id: 1338, city_id: 372, name_ar: "الوقف", name_en: "Alwaqf" },

      // قفط (id: 373)
      { id: 1339, city_id: 373, name_ar: "قفط", name_en: "Qaft" },

      // نقادة (id: 374)
      { id: 1340, city_id: 374, name_ar: "نقادة", name_en: "Naqada" },

      // فرشوط (id: 375)
      { id: 1341, city_id: 375, name_ar: "فرشوط", name_en: "Farshout" },

      // قوص (id: 376)
      { id: 1342, city_id: 376, name_ar: "قوص", name_en: "Quos" },

      // ==================== شمال سيناء (cities 377-382) ====================

      // العريش (id: 377)
      { id: 1343, city_id: 377, name_ar: "العريش", name_en: "Arish" },
      {
        id: 1344,
        city_id: 377,
        name_ar: "كورنيش العريش",
        name_en: "Arish Corniche",
      },
      {
        id: 1345,
        city_id: 377,
        name_ar: "شاطئ العريش",
        name_en: "Arish Beach",
      },

      // الشيخ زويد (id: 378)
      {
        id: 1346,
        city_id: 378,
        name_ar: "الشيخ زويد",
        name_en: "Sheikh Zowaid",
      },

      // نخل (id: 379)
      { id: 1347, city_id: 379, name_ar: "نخل", name_en: "Nakhl" },

      // رفح (id: 380)
      { id: 1348, city_id: 380, name_ar: "رفح", name_en: "Rafah" },

      // بئر العبد (id: 381)
      { id: 1349, city_id: 381, name_ar: "بئر العبد", name_en: "Bir al-Abed" },

      // الحسنة (id: 382)
      { id: 1350, city_id: 382, name_ar: "الحسنة", name_en: "Al Hasana" },

      // ==================== سوهاج (cities 383-396) ====================

      // سوهاج (id: 383)
      { id: 1351, city_id: 383, name_ar: "سوهاج", name_en: "Sohag" },
      {
        id: 1352,
        city_id: 383,
        name_ar: "شارع الجمهورية",
        name_en: "Al Gomhoreya Street",
      },
      {
        id: 1353,
        city_id: 383,
        name_ar: "كورنيش النيل",
        name_en: "Nile Corniche",
      },
      {
        id: 1354,
        city_id: 383,
        name_ar: "جامعة سوهاج",
        name_en: "Sohag University",
      },

      // سوهاج الجديدة (id: 384)
      {
        id: 1355,
        city_id: 384,
        name_ar: "سوهاج الجديدة",
        name_en: "Sohag El Gedida",
      },
      {
        id: 1356,
        city_id: 384,
        name_ar: "الحي الأول - سوهاج الجديدة",
        name_en: "First District - New Sohag",
      },
      {
        id: 1357,
        city_id: 384,
        name_ar: "الحي الثاني - سوهاج الجديدة",
        name_en: "Second District - New Sohag",
      },
      {
        id: 1358,
        city_id: 384,
        name_ar: "الحي الثالث - سوهاج الجديدة",
        name_en: "Third District - New Sohag",
      },
      {
        id: 1359,
        city_id: 384,
        name_ar: "المنطقة الصناعية - سوهاج الجديدة",
        name_en: "Industrial Zone - New Sohag",
      },

      // أخميم (id: 385)
      { id: 1360, city_id: 385, name_ar: "أخميم", name_en: "Akhmeem" },

      // أخميم الجديدة (id: 386)
      {
        id: 1361,
        city_id: 386,
        name_ar: "أخميم الجديدة",
        name_en: "Akhmim El Gedida",
      },

      // البلينا (id: 387)
      { id: 1362, city_id: 387, name_ar: "البلينا", name_en: "Albalina" },

      // المراغة (id: 388)
      { id: 1363, city_id: 388, name_ar: "المراغة", name_en: "El Maragha" },

      // المنشأة (id: 389)
      { id: 1364, city_id: 389, name_ar: "المنشأة", name_en: "almunsha'a" },

      // دار السلام (id: 390)
      {
        id: 1365,
        city_id: 390,
        name_ar: "دار السلام",
        name_en: "Dar AISalaam",
      },

      // جرجا (id: 391)
      { id: 1366, city_id: 391, name_ar: "جرجا", name_en: "Gerga" },

      // جهينة الغربية (id: 392)
      {
        id: 1367,
        city_id: 392,
        name_ar: "جهينة الغربية",
        name_en: "Jahina Al Gharbia",
      },

      // ساقلته (id: 393)
      { id: 1368, city_id: 393, name_ar: "ساقلته", name_en: "Saqilatuh" },

      // طما (id: 394)
      { id: 1369, city_id: 394, name_ar: "طما", name_en: "Tama" },

      // طهطا (id: 395)
      { id: 1370, city_id: 395, name_ar: "طهطا", name_en: "Tahta" },

      // الكوثر (id: 396)
      { id: 1371, city_id: 396, name_ar: "الكوثر", name_en: "Alkawthar" },
    ],
    skipDuplicates: true,
  });
  await prisma.categories.createMany({
    data: [
      { id: 1, name_en: "Apartments", name_ar: "شقق" },
      { id: 2, name_en: "Villas", name_ar: "فلل" },
      { id: 3, name_en: "Commercial", name_ar: "تجاري" },
      { id: 4, name_en: "Buildings & Lands", name_ar: "مباني وأراضي" },
    ],
    skipDuplicates: true,
  });
  await prisma.subCategories.createMany({
    data: [
      // Apartments
      { name_en: "Apartment", name_ar: "شقة", category_id: 1 },
      { name_en: "Studio", name_ar: "استوديو", category_id: 1 },
      { name_en: "Duplex", name_ar: "دوبلكس", category_id: 1 },
      { name_en: "Penthouse", name_ar: "بنتهاوس", category_id: 1 },
      { name_en: "Serviced Apartment", name_ar: "شقة فندقية", category_id: 1 },

      // Villas
      { name_en: "Standalone Villa", name_ar: "فيلا مستقلة", category_id: 2 },
      { name_en: "Twin House", name_ar: "توين هاوس", category_id: 2 },
      { name_en: "Townhouse", name_ar: "تاون هاوس", category_id: 2 },
      { name_en: "Duplex Villa", name_ar: "فيلا دوبلكس", category_id: 2 },

      // Commercial
      { name_en: "Office Space", name_ar: "مكتب إداري", category_id: 3 },
      { name_en: "Retail Shop", name_ar: "محل تجاري", category_id: 3 },
      { name_en: "Restaurant / Cafe", name_ar: "مطعم / كافيه", category_id: 3 },
      { name_en: "Warehouse", name_ar: "مخزن", category_id: 3 },
      {
        name_en: "Clinic / Medical Center",
        name_ar: "عيادة / مركز طبي",
        category_id: 3,
      },
      {
        name_en: "Administrative Building",
        name_ar: "مبنى إداري",
        category_id: 3,
      },

      // Buildings & Lands
      { name_en: "Residential Building", name_ar: "مبنى سكني", category_id: 4 },
      { name_en: "Commercial Building", name_ar: "مبنى تجاري", category_id: 4 },
      {
        name_en: "Mixed-Use Building",
        name_ar: "مبنى متعدد الاستخدام",
        category_id: 4,
      },
      { name_en: "Residential Land", name_ar: "أرض سكنية", category_id: 4 },
      { name_en: "Commercial Land", name_ar: "أرض تجارية", category_id: 4 },
      { name_en: "Agricultural Land", name_ar: "أرض زراعية", category_id: 4 },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Seed completed successfully");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
