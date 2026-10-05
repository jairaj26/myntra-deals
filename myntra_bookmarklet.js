/**
 * Myntra Deal Sentinel - Interactive Bookmarklet
 * Version: 2.12.0
 * 
 * Injects a floating deal-hunting panel directly on Myntra.
 * Fetches server-filtered deals for curated brands sorted by highest discount.
 */

(function () {
  const PANEL_ID = 'myntra-deal-sentinel-panel';

  // Toggle panel if already open
  const existing = document.getElementById(PANEL_ID);
  if (existing) {
    existing.style.display = existing.style.display === 'none' ? 'block' : 'none';
    return;
  }

  const DEFAULT_PINCODE = '560032';

  // Embedded Curated Brand Lists (Modular by Category)
  const CATEGORY_DATA = {
    "Haircare": {
        "displayName": "Haircare",
        "basePath": "personal-care",
        "brands": [
            "&honey",
            "2.Oh!",
            "ARATA",
            "Bare Anatomy",
            "BBLUNT",
            "Biolage",
            "BIOTOP PROFESSIONAL",
            "BRILLARE",
            "Dabur",
            "Dove",
            "Dr. Batras",
            "Earth Rhythm",
            "Fix My Curls",
            "Garnier",
            "Head & Shoulders",
            "indulekha",
            "Kesh King",
            "Khadi Natural",
            "LOreal",
            "LOreal Professionnel",
            "Mamaearth",
            "MATRIX",
            "MOROCCANOIL",
            "Nat Habit",
            "Neutrogena",
            "OGX",
            "OLAPLEX",
            "Pantene",
            "Pilgrim",
            "Plum",
            "Schwarzkopf",
            "Schwarzkopf PROFESSIONAL",
            "Streax",
            "Streax Professional",
            "Sunsilk",
            "THE BODY SHOP",
            "TRESemme",
            "TRICHUP",
            "VEDIX",
            "WELLA PROFESSIONALS",
            "WishCare",
            "WOW SKIN SCIENCE"
        ],
        "brandDetails": [
            {
                "brand": "&honey",
                "productCount": 14
            },
            {
                "brand": "2.Oh!",
                "productCount": 44
            },
            {
                "brand": "ARATA",
                "productCount": 46
            },
            {
                "brand": "Bare Anatomy",
                "productCount": 95
            },
            {
                "brand": "BBLUNT",
                "productCount": 96
            },
            {
                "brand": "Biolage",
                "productCount": 29
            },
            {
                "brand": "BIOTOP PROFESSIONAL",
                "productCount": 53
            },
            {
                "brand": "BRILLARE",
                "productCount": 129
            },
            {
                "brand": "Dabur",
                "productCount": 51
            },
            {
                "brand": "Dove",
                "productCount": 225
            },
            {
                "brand": "Dr. Batras",
                "productCount": 122
            },
            {
                "brand": "Earth Rhythm",
                "productCount": 83
            },
            {
                "brand": "Fix My Curls",
                "productCount": 49
            },
            {
                "brand": "Garnier",
                "productCount": 177
            },
            {
                "brand": "Head & Shoulders",
                "productCount": 65
            },
            {
                "brand": "indulekha",
                "productCount": 17
            },
            {
                "brand": "Kesh King",
                "productCount": 27
            },
            {
                "brand": "Khadi Natural",
                "productCount": 264
            },
            {
                "brand": "LOreal",
                "productCount": 330
            },
            {
                "brand": "LOreal Professionnel",
                "productCount": 49
            },
            {
                "brand": "Mamaearth",
                "productCount": 457
            },
            {
                "brand": "MATRIX",
                "productCount": 26
            },
            {
                "brand": "MOROCCANOIL",
                "productCount": 154
            },
            {
                "brand": "Nat Habit",
                "productCount": 384
            },
            {
                "brand": "Neutrogena",
                "productCount": 28
            },
            {
                "brand": "OGX",
                "productCount": 8
            },
            {
                "brand": "OLAPLEX",
                "productCount": 17
            },
            {
                "brand": "Pantene",
                "productCount": 50
            },
            {
                "brand": "Pilgrim",
                "productCount": 265
            },
            {
                "brand": "Plum",
                "productCount": 314
            },
            {
                "brand": "Schwarzkopf",
                "productCount": 37
            },
            {
                "brand": "Schwarzkopf PROFESSIONAL",
                "productCount": 110
            },
            {
                "brand": "Streax",
                "productCount": 80
            },
            {
                "brand": "Streax Professional",
                "productCount": 32
            },
            {
                "brand": "Sunsilk",
                "productCount": 23
            },
            {
                "brand": "THE BODY SHOP",
                "productCount": 189
            },
            {
                "brand": "TRESemme",
                "productCount": 106
            },
            {
                "brand": "TRICHUP",
                "productCount": 52
            },
            {
                "brand": "VEDIX",
                "productCount": 75
            },
            {
                "brand": "WELLA PROFESSIONALS",
                "productCount": 124
            },
            {
                "brand": "WishCare",
                "productCount": 103
            },
            {
                "brand": "WOW SKIN SCIENCE",
                "productCount": 56
            }
        ],
        "productTypes": {
            "Shampoo": [
                "Shampoo",
                "Dry Shampoo",
                "Baby Shampoo and Conditioner"
            ],
            "Conditioner": [
                "Conditioner"
            ],
            "Hair Oil": [
                "Hair Oil",
                "Baby Hair Oil"
            ],
            "Hair Serum": [
                "Hair Serum"
            ],
            "Hair Mask": [
                "Hair Masks"
            ],
            "Hair Styling & Treatment": [
                "Hair Gels and Wax",
                "Hair Spray",
                "Hair Spa",
                "Hair Cream and Mask",
                "Hair Tonic"
            ],
            "Hair Color": [
                "Hair Colour",
                "Hair Color",
                "Beard Colour"
            ]
        }
    },
    "Skincare": {
        "displayName": "Skincare",
        "basePath": "personal-care",
        "brands": [
            "Anua",
            "Aqualogica",
            "Aroma Magic",
            "Aveeno",
            "Aveeno Baby",
            "Avene",
            "Axis-Y",
            "AYUR HERBALS",
            "Be Bodywise",
            "Beauty of Joseon",
            "Bella Vita Organic",
            "BIODERMA",
            "Biotique",
            "Blue Nectar",
            "BOROLINE",
            "BOROPLUS",
            "Burt's Bees",
            "Celimax",
            "CeraVe",
            "Cetaphil",
            "Chemist at Play",
            "CLARINS",
            "Clinique",
            "Conscious Chemist",
            "COSRX",
            "deconstruct",
            "Dermalogica",
            "Dettol",
            "DOT & KEY",
            "DR. SHETHS",
            "Earth Rhythm",
            "Elizabeth Arden",
            "Estee Lauder",
            "ETUDE",
            "Eucerin",
            "Eveline Cosmetics",
            "everyuth Naturals",
            "FIXDERMA",
            "Forest Essentials",
            "FoxTale",
            "Garnier",
            "GHAR SOAPS",
            "Haruharu Wonder",
            "Himalaya",
            "Innisfree",
            "ISNTREE",
            "Jovees",
            "JOY",
            "Just Herbs",
            "KAMA AYURVEDA",
            "Khadi Natural",
            "Lakme",
            "LANEIGE",
            "Lotus Botanicals",
            "Lotus Herbals",
            "Love Beauty & Planet",
            "Mamaearth",
            "MCaffeine",
            "Minimalist",
            "Neutrogena",
            "Nivea",
            "Olay",
            "Origins Nutra",
            "Pears",
            "Pilgrim",
            "Plum",
            "Ponds",
            "Sanfe",
            "Sebamed",
            "Simple",
            "SKINFOOD",
            "Sulwhasoo",
            "THE BODY SHOP",
            "The Derma co.",
            "The Face Shop",
            "THE ORDINARY",
            "Torriden",
            "Vaseline",
            "VLCC",
            "WishCare",
            "WOW SKIN SCIENCE"
        ],
        "brandDetails": [
            {
                "brand": "Anua",
                "productCount": 18
            },
            {
                "brand": "Aqualogica",
                "productCount": 98
            },
            {
                "brand": "Aroma Magic",
                "productCount": 3
            },
            {
                "brand": "Aveeno",
                "productCount": 2
            },
            {
                "brand": "Aveeno Baby",
                "productCount": 9
            },
            {
                "brand": "Avene",
                "productCount": 29
            },
            {
                "brand": "Axis-Y",
                "productCount": 16
            },
            {
                "brand": "AYUR HERBALS",
                "productCount": 49
            },
            {
                "brand": "Be Bodywise",
                "productCount": 153
            },
            {
                "brand": "Beauty of Joseon",
                "productCount": 35
            },
            {
                "brand": "Bella Vita Organic",
                "productCount": 298
            },
            {
                "brand": "BIODERMA",
                "productCount": 68
            },
            {
                "brand": "Biotique",
                "productCount": 196
            },
            {
                "brand": "Blue Nectar",
                "productCount": 203
            },
            {
                "brand": "BOROLINE",
                "productCount": 30
            },
            {
                "brand": "BOROPLUS",
                "productCount": 55
            },
            {
                "brand": "Burt's Bees",
                "productCount": 14
            },
            {
                "brand": "Celimax",
                "productCount": 24
            },
            {
                "brand": "CeraVe",
                "productCount": 46
            },
            {
                "brand": "Cetaphil",
                "productCount": 92
            },
            {
                "brand": "Chemist at Play",
                "productCount": 85
            },
            {
                "brand": "CLARINS",
                "productCount": 48
            },
            {
                "brand": "Clinique",
                "productCount": 348
            },
            {
                "brand": "Conscious Chemist",
                "productCount": 73
            },
            {
                "brand": "COSRX",
                "productCount": 4
            },
            {
                "brand": "deconstruct",
                "productCount": 63
            },
            {
                "brand": "Dermalogica",
                "productCount": 16
            },
            {
                "brand": "Dettol",
                "productCount": 17
            },
            {
                "brand": "DOT & KEY",
                "productCount": 176
            },
            {
                "brand": "DR. SHETHS",
                "productCount": 73
            },
            {
                "brand": "Earth Rhythm",
                "productCount": 83
            },
            {
                "brand": "Elizabeth Arden",
                "productCount": 74
            },
            {
                "brand": "Estee Lauder",
                "productCount": 181
            },
            {
                "brand": "ETUDE",
                "productCount": 129
            },
            {
                "brand": "Eucerin",
                "productCount": 26
            },
            {
                "brand": "Eveline Cosmetics",
                "productCount": 99
            },
            {
                "brand": "everyuth Naturals",
                "productCount": 34
            },
            {
                "brand": "FIXDERMA",
                "productCount": 142
            },
            {
                "brand": "Forest Essentials",
                "productCount": 243
            },
            {
                "brand": "FoxTale",
                "productCount": 204
            },
            {
                "brand": "Garnier",
                "productCount": 177
            },
            {
                "brand": "GHAR SOAPS",
                "productCount": 29
            },
            {
                "brand": "Haruharu Wonder",
                "productCount": 30
            },
            {
                "brand": "Himalaya",
                "productCount": 226
            },
            {
                "brand": "Innisfree",
                "productCount": 107
            },
            {
                "brand": "ISNTREE",
                "productCount": 35
            },
            {
                "brand": "Jovees",
                "productCount": 158
            },
            {
                "brand": "JOY",
                "productCount": 158
            },
            {
                "brand": "Just Herbs",
                "productCount": 184
            },
            {
                "brand": "KAMA AYURVEDA",
                "productCount": 136
            },
            {
                "brand": "Khadi Natural",
                "productCount": 264
            },
            {
                "brand": "Lakme",
                "productCount": 1005
            },
            {
                "brand": "LANEIGE",
                "productCount": 70
            },
            {
                "brand": "Lotus Botanicals",
                "productCount": 110
            },
            {
                "brand": "Lotus Herbals",
                "productCount": 426
            },
            {
                "brand": "Love Beauty & Planet",
                "productCount": 64
            },
            {
                "brand": "Mamaearth",
                "productCount": 457
            },
            {
                "brand": "MCaffeine",
                "productCount": 151
            },
            {
                "brand": "Minimalist",
                "productCount": 119
            },
            {
                "brand": "Neutrogena",
                "productCount": 28
            },
            {
                "brand": "Nivea",
                "productCount": 280
            },
            {
                "brand": "Olay",
                "productCount": 45
            },
            {
                "brand": "Origins Nutra",
                "productCount": 38
            },
            {
                "brand": "Pears",
                "productCount": 40
            },
            {
                "brand": "Pilgrim",
                "productCount": 265
            },
            {
                "brand": "Plum",
                "productCount": 314
            },
            {
                "brand": "Ponds",
                "productCount": 165
            },
            {
                "brand": "Sanfe",
                "productCount": 187
            },
            {
                "brand": "Sebamed",
                "productCount": 43
            },
            {
                "brand": "Simple",
                "productCount": 31
            },
            {
                "brand": "SKINFOOD",
                "productCount": 39
            },
            {
                "brand": "Sulwhasoo",
                "productCount": 23
            },
            {
                "brand": "THE BODY SHOP",
                "productCount": 189
            },
            {
                "brand": "The Derma co.",
                "productCount": 155
            },
            {
                "brand": "The Face Shop",
                "productCount": 103
            },
            {
                "brand": "THE ORDINARY",
                "productCount": 66
            },
            {
                "brand": "Torriden",
                "productCount": 4
            },
            {
                "brand": "Vaseline",
                "productCount": 109
            },
            {
                "brand": "VLCC",
                "productCount": 240
            },
            {
                "brand": "WishCare",
                "productCount": 103
            },
            {
                "brand": "WOW SKIN SCIENCE",
                "productCount": 56
            }
        ],
        "productTypes": {
            "Facewash & Cleanser": [
                "Face Wash and Cleanser",
                "Facial Wipes",
                "Face Cleanser"
            ],
            "Serum & Essence": [
                "Serum",
                "Serum and Gel",
                "Facial Oil"
            ],
            "Sunscreen": [
                "Sunscreen",
                "Face Sunscreen",
                "Body Sunscreen",
                "Baby Sunscreen"
            ],
            "Moisturizer & Day Cream": [
                "Day Cream",
                "Moisturiser",
                "Face Moisturiser",
                "BB and CC Cream"
            ],
            "Night Cream": [
                "Night Cream"
            ],
            "Toner & Mist": [
                "Toner",
                "Face Mist",
                "Toner and Mist"
            ],
            "Face Scrub & Exfoliator": [
                "Face Scrub and Exfoliator",
                "Scrub"
            ],
            "Face Mask & Sheet Mask": [
                "Sheet Masks",
                "Mask and Peel",
                "Face Pack",
                "Eye Mask and Patches"
            ],
            "Lip Balm & Treatment": [
                "Lip Balm",
                "Lip Care",
                "Lip Mask",
                "Lip Scrub",
                "Lip Oil"
            ],
            "Eye Cream & Serum": [
                "Under Eye Cream",
                "Under Eye Creams and Serums"
            ],
            "Body Lotion & Cream": [
                "Body Cream and Lotion",
                "Baby Lotions and Creams",
                "Hand Cream",
                "Foot Cream and Scrubs"
            ],
            "Body Wash & Shower Gel": [
                "Body Wash and Shower Gel",
                "Baby Body Wash and Soap",
                "Bath Salt and Bubble Bath",
                "Soap"
            ]
        },
        "minDiscount": 70,
        "botMinDiscount": 70,
        "bookmarkletMinDiscount": 70
    },
    "Perfumes": {
        "displayName": "Perfumes",
        "basePath": "personal-care",
        "brands": [
            "4711",
            "ADIDAS",
            "Afnan",
            "AHMED AL MAGHRIBI",
            "Ajmal",
            "AL Hubb",
            "Al-Nuaim",
            "Arabiyat Prestige",
            "Archies",
            "Armaf",
            "AXE",
            "Azzaro",
            "Bath & Body Works",
            "BEARDO",
            "Bella Vita Organic",
            "Bombay Shaving Company",
            "BRUT",
            "Calvin Klein",
            "Carolina Herrera",
            "Coach",
            "DAVIDOFF",
            "Denver",
            "DIESEL",
            "Elizabeth Arden",
            "EM5",
            "Envy",
            "Fastrack",
            "Fogg",
            "Forest Essentials",
            "Franck Olivier",
            "FRENCH ESSENCE",
            "GUESS",
            "HE",
            "Hugo Boss",
            "Issey Miyake",
            "JAGUAR",
            "Jimmy Choo",
            "KAMA AYURVEDA",
            "Lacoste",
            "Lattafa",
            "Marks & Spencer",
            "Nautica",
            "Nike Fragrances",
            "Old Spice",
            "Paco Rabanne",
            "Park Avenue",
            "Police",
            "Prada",
            "Ralph Lauren",
            "Ramsons",
            "Rasasi",
            "SKINN",
            "THE BODY SHOP",
            "THE MAN COMPANY",
            "Ustraa",
            "Versace",
            "Victoria's Secret",
            "Wild stone",
            "Yves Saint Laurent"
        ],
        "brandDetails": [
            {
                "brand": "4711",
                "productCount": 19
            },
            {
                "brand": "ADIDAS",
                "productCount": 64
            },
            {
                "brand": "Afnan",
                "productCount": 51
            },
            {
                "brand": "AHMED AL MAGHRIBI",
                "productCount": 90
            },
            {
                "brand": "Ajmal",
                "productCount": 144
            },
            {
                "brand": "AL Hubb",
                "productCount": 49
            },
            {
                "brand": "Al-Nuaim",
                "productCount": 329
            },
            {
                "brand": "Arabiyat Prestige",
                "productCount": 49
            },
            {
                "brand": "Archies",
                "productCount": 106
            },
            {
                "brand": "Armaf",
                "productCount": 54
            },
            {
                "brand": "AXE",
                "productCount": 78
            },
            {
                "brand": "Azzaro",
                "productCount": 30
            },
            {
                "brand": "Bath & Body Works",
                "productCount": 398
            },
            {
                "brand": "BEARDO",
                "productCount": 342
            },
            {
                "brand": "Bella Vita Organic",
                "productCount": 298
            },
            {
                "brand": "Bombay Shaving Company",
                "productCount": 76
            },
            {
                "brand": "BRUT",
                "productCount": 7
            },
            {
                "brand": "Calvin Klein",
                "productCount": 58
            },
            {
                "brand": "Carolina Herrera",
                "productCount": 67
            },
            {
                "brand": "Coach",
                "productCount": 15
            },
            {
                "brand": "DAVIDOFF",
                "productCount": 33
            },
            {
                "brand": "Denver",
                "productCount": 292
            },
            {
                "brand": "DIESEL",
                "productCount": 22
            },
            {
                "brand": "Elizabeth Arden",
                "productCount": 74
            },
            {
                "brand": "EM5",
                "productCount": 136
            },
            {
                "brand": "Envy",
                "productCount": 117
            },
            {
                "brand": "Fastrack",
                "productCount": 33
            },
            {
                "brand": "Fogg",
                "productCount": 22
            },
            {
                "brand": "Forest Essentials",
                "productCount": 243
            },
            {
                "brand": "Franck Olivier",
                "productCount": 60
            },
            {
                "brand": "FRENCH ESSENCE",
                "productCount": 104
            },
            {
                "brand": "GUESS",
                "productCount": 119
            },
            {
                "brand": "HE",
                "productCount": 25
            },
            {
                "brand": "Hugo Boss",
                "productCount": 43
            },
            {
                "brand": "Issey Miyake",
                "productCount": 13
            },
            {
                "brand": "JAGUAR",
                "productCount": 30
            },
            {
                "brand": "Jimmy Choo",
                "productCount": 24
            },
            {
                "brand": "KAMA AYURVEDA",
                "productCount": 136
            },
            {
                "brand": "Lacoste",
                "productCount": 14
            },
            {
                "brand": "Lattafa",
                "productCount": 147
            },
            {
                "brand": "Marks & Spencer",
                "productCount": 100
            },
            {
                "brand": "Nautica",
                "productCount": 37
            },
            {
                "brand": "Nike Fragrances",
                "productCount": 170
            },
            {
                "brand": "Old Spice",
                "productCount": 17
            },
            {
                "brand": "Paco Rabanne",
                "productCount": 98
            },
            {
                "brand": "Park Avenue",
                "productCount": 78
            },
            {
                "brand": "Police",
                "productCount": 108
            },
            {
                "brand": "Prada",
                "productCount": 24
            },
            {
                "brand": "Ralph Lauren",
                "productCount": 16
            },
            {
                "brand": "Ramsons",
                "productCount": 159
            },
            {
                "brand": "Rasasi",
                "productCount": 43
            },
            {
                "brand": "SKINN",
                "productCount": 94
            },
            {
                "brand": "THE BODY SHOP",
                "productCount": 189
            },
            {
                "brand": "THE MAN COMPANY",
                "productCount": 214
            },
            {
                "brand": "Ustraa",
                "productCount": 106
            },
            {
                "brand": "Versace",
                "productCount": 47
            },
            {
                "brand": "Victoria's Secret",
                "productCount": 299
            },
            {
                "brand": "Wild stone",
                "productCount": 146
            },
            {
                "brand": "Yves Saint Laurent",
                "productCount": 34
            }
        ],
        "productTypes": {
            "Perfume (EDP / EDT)": [
                "Perfume and EDT",
                "Perfume"
            ],
            "Deodorant & Body Spray": [
                "Deodorant",
                "Body Spray"
            ],
            "Body Mist": [
                "Body Mist"
            ],
            "Attar": [
                "Attar"
            ]
        },
        "minDiscount": 80,
        "botMinDiscount": 80,
        "bookmarkletMinDiscount": 80
    },
    "Makeup": {
        "displayName": "Makeup",
        "basePath": "personal-care",
        "brands": [
            "ANASTASIA BEVERLY HILLS",
            "bareMinerals",
            "Blue Heaven",
            "Bobbi Brown",
            "Chambor",
            "Character",
            "Colorbar",
            "Coloressence",
            "Colors Queen",
            "Daily Life Forever52",
            "e.l.f.",
            "ELLE 18",
            "essence",
            "Estee Lauder",
            "ETUDE",
            "FACES CANADA",
            "FAE BEAUTY",
            "FOCALLURE",
            "Huda Beauty",
            "Insight Cosmetics",
            "L.A. Girl",
            "Lakme",
            "M.A.C",
            "Makeup Revolution London",
            "MARS",
            "MATTLOOK",
            "Maybelline",
            "MILANI",
            "MyGlamm",
            "PAC",
            "Plum",
            "Recode",
            "Renee",
            "Revlon",
            "Smashbox",
            "SUGAR",
            "SWISS BEAUTY",
            "Wet n Wild"
        ],
        "brandDetails": [
            {
                "brand": "ANASTASIA BEVERLY HILLS",
                "productCount": 161
            },
            {
                "brand": "bareMinerals",
                "productCount": 66
            },
            {
                "brand": "Blue Heaven",
                "productCount": 180
            },
            {
                "brand": "Bobbi Brown",
                "productCount": 197
            },
            {
                "brand": "Chambor",
                "productCount": 23
            },
            {
                "brand": "Character",
                "productCount": 273
            },
            {
                "brand": "Colorbar",
                "productCount": 195
            },
            {
                "brand": "Coloressence",
                "productCount": 345
            },
            {
                "brand": "Colors Queen",
                "productCount": 1168
            },
            {
                "brand": "Daily Life Forever52",
                "productCount": 558
            },
            {
                "brand": "e.l.f.",
                "productCount": 173
            },
            {
                "brand": "ELLE 18",
                "productCount": 317
            },
            {
                "brand": "essence",
                "productCount": 138
            },
            {
                "brand": "Estee Lauder",
                "productCount": 181
            },
            {
                "brand": "ETUDE",
                "productCount": 129
            },
            {
                "brand": "FACES CANADA",
                "productCount": 614
            },
            {
                "brand": "FAE BEAUTY",
                "productCount": 111
            },
            {
                "brand": "FOCALLURE",
                "productCount": 122
            },
            {
                "brand": "Huda Beauty",
                "productCount": 157
            },
            {
                "brand": "Insight Cosmetics",
                "productCount": 234
            },
            {
                "brand": "L.A. Girl",
                "productCount": 228
            },
            {
                "brand": "Lakme",
                "productCount": 1005
            },
            {
                "brand": "M.A.C",
                "productCount": 634
            },
            {
                "brand": "Makeup Revolution London",
                "productCount": 508
            },
            {
                "brand": "MARS",
                "productCount": 794
            },
            {
                "brand": "MATTLOOK",
                "productCount": 536
            },
            {
                "brand": "Maybelline",
                "productCount": 504
            },
            {
                "brand": "MILANI",
                "productCount": 139
            },
            {
                "brand": "MyGlamm",
                "productCount": 3
            },
            {
                "brand": "PAC",
                "productCount": 444
            },
            {
                "brand": "Plum",
                "productCount": 314
            },
            {
                "brand": "Recode",
                "productCount": 193
            },
            {
                "brand": "Renee",
                "productCount": 602
            },
            {
                "brand": "Revlon",
                "productCount": 355
            },
            {
                "brand": "Smashbox",
                "productCount": 104
            },
            {
                "brand": "SUGAR",
                "productCount": 173
            },
            {
                "brand": "SWISS BEAUTY",
                "productCount": 694
            },
            {
                "brand": "Wet n Wild",
                "productCount": 17
            }
        ],
        "productTypes": {
            "Lipstick & Lip Tint": [
                "Lipstick",
                "Liquid Lipstick",
                "Lip Gloss",
                "Lip Tint",
                "Lip Liner"
            ],
            "Foundation & Concealer": [
                "Foundation",
                "Concealer",
                "BB and CC Cream"
            ],
            "Kajal & Eyeliner": [
                "Eyeliner",
                "Kajal and Kohl"
            ],
            "Mascara & Brows": [
                "Mascara",
                "Eyebrow Enhancer",
                "False Eyelashes"
            ],
            "Compact & Setting Powder": [
                "Compact",
                "Loose Powder",
                "Setting Powder"
            ],
            "Blush, Highlighter & Bronzer": [
                "Blush",
                "Highlighter",
                "Bronzer",
                "Contour"
            ],
            "Eyeshadow & Palettes": [
                "Eyeshadow",
                "Makeup Palette"
            ],
            "Nail Care & Polish": [
                "Nail Polish",
                "Nail Polish Remover",
                "Nail Care"
            ]
        },
        "minDiscount": 80,
        "botMinDiscount": 80,
        "bookmarkletMinDiscount": 80
    },
    "Men Innerwear": {
        "displayName": "Men Innerwear",
        "basePath": "men-innerwear",
        "brands": [
            "ADIDAS",
            "AMUL COMFY",
            "Bodycare",
            "Calvin Klein Underwear",
            "Chromozome",
            "COLORS by Rupa Frontline",
            "Dollar",
            "Dollar Bigboss",
            "FCUK",
            "Force NXT",
            "French Connection",
            "H&M",
            "Jack & Jones",
            "Jockey",
            "Kook N Keech",
            "Levis",
            "Lux Cozi",
            "LUX NITRO",
            "Macroman",
            "Marks & Spencer",
            "Mast & Harbour",
            "Monte Carlo",
            "ONN",
            "Park Avenue",
            "Pepe Jeans",
            "Peter England",
            "Puma",
            "Red Tape",
            "Roadster",
            "Rupa",
            "Rupa Frontline",
            "Rupa Jon",
            "Sporto by Macho",
            "Tommy Hilfiger",
            "U.S. Polo Assn.",
            "UnderJeans by Spykar",
            "Van Heusen",
            "VIP",
            "WROGN",
            "XYXX"
        ],
        "brandDetails": [
            {
                "brand": "ADIDAS",
                "productCount": 15
            },
            {
                "brand": "AMUL COMFY",
                "productCount": 1634
            },
            {
                "brand": "Bodycare",
                "productCount": 11
            },
            {
                "brand": "Calvin Klein Underwear",
                "productCount": 445
            },
            {
                "brand": "Chromozome",
                "productCount": 93
            },
            {
                "brand": "COLORS by Rupa Frontline",
                "productCount": 5549
            },
            {
                "brand": "Dollar",
                "productCount": 521
            },
            {
                "brand": "Dollar Bigboss",
                "productCount": 1090
            },
            {
                "brand": "FCUK",
                "productCount": 122
            },
            {
                "brand": "Force NXT",
                "productCount": 1251
            },
            {
                "brand": "French Connection",
                "productCount": 18
            },
            {
                "brand": "H&M",
                "productCount": 65
            },
            {
                "brand": "Jack & Jones",
                "productCount": 135
            },
            {
                "brand": "Jockey",
                "productCount": 2329
            },
            {
                "brand": "Kook N Keech",
                "productCount": 7
            },
            {
                "brand": "Levis",
                "productCount": 738
            },
            {
                "brand": "Lux Cozi",
                "productCount": 958
            },
            {
                "brand": "LUX NITRO",
                "productCount": 134
            },
            {
                "brand": "Macroman",
                "productCount": 153
            },
            {
                "brand": "Marks & Spencer",
                "productCount": 70
            },
            {
                "brand": "Mast & Harbour",
                "productCount": 424
            },
            {
                "brand": "Monte Carlo",
                "productCount": 75
            },
            {
                "brand": "ONN",
                "productCount": 314
            },
            {
                "brand": "Park Avenue",
                "productCount": 162
            },
            {
                "brand": "Pepe Jeans",
                "productCount": 576
            },
            {
                "brand": "Peter England",
                "productCount": 49
            },
            {
                "brand": "Puma",
                "productCount": 143
            },
            {
                "brand": "Red Tape",
                "productCount": 58
            },
            {
                "brand": "Roadster",
                "productCount": 2100
            },
            {
                "brand": "Rupa",
                "productCount": 184
            },
            {
                "brand": "Rupa Frontline",
                "productCount": 171
            },
            {
                "brand": "Rupa Jon",
                "productCount": 135
            },
            {
                "brand": "Sporto by Macho",
                "productCount": 1672
            },
            {
                "brand": "Tommy Hilfiger",
                "productCount": 135
            },
            {
                "brand": "U.S. Polo Assn.",
                "productCount": 1226
            },
            {
                "brand": "UnderJeans by Spykar",
                "productCount": 674
            },
            {
                "brand": "Van Heusen",
                "productCount": 198
            },
            {
                "brand": "VIP",
                "productCount": 410
            },
            {
                "brand": "WROGN",
                "productCount": 44
            },
            {
                "brand": "XYXX",
                "productCount": 1241
            }
        ],
        "productTypes": {
            "Boxers": [
                "Boxers"
            ],
            "Briefs & Trunks": [
                "Briefs",
                "Trunk"
            ],
            "Innerwear Vests": [
                "Innerwear Vests"
            ],
            "Thermals & Winterwear": [
                "Thermal Set",
                "Thermal Bottoms",
                "Thermal Tops"
            ]
        },
        "minDiscount": 80,
        "botMinDiscount": 80,
        "bookmarkletMinDiscount": 80
    },
    "Men Sportswear": {
        "displayName": "Men Sportswear",
        "basePath": "men-sports-wear",
        "brands": [
            "ADIDAS",
            "ADIDAS Originals",
            "Alcis",
            "ASICS",
            "Columbia",
            "Decathlon",
            "FILA",
            "HRX by Hrithik Roshan",
            "hummel",
            "Kappa",
            "Lotto",
            "New Balance",
            "Nike",
            "Puma",
            "Red Tape",
            "Reebok",
            "Roadster",
            "Skechers",
            "Speedo",
            "Technosport",
            "UNDER ARMOUR",
            "VECTOR X",
            "Wildcraft",
            "WROGN",
            "WROGN ACTIVE"
        ],
        "brandDetails": [
            {
                "brand": "ADIDAS",
                "productCount": 948
            },
            {
                "brand": "ADIDAS Originals",
                "productCount": 55
            },
            {
                "brand": "Alcis",
                "productCount": 611
            },
            {
                "brand": "ASICS",
                "productCount": 991
            },
            {
                "brand": "Columbia",
                "productCount": 371
            },
            {
                "brand": "Decathlon",
                "productCount": 616
            },
            {
                "brand": "FILA",
                "productCount": 4
            },
            {
                "brand": "HRX by Hrithik Roshan",
                "productCount": 6580
            },
            {
                "brand": "hummel",
                "productCount": 63
            },
            {
                "brand": "Kappa",
                "productCount": 157
            },
            {
                "brand": "Lotto",
                "productCount": 40
            },
            {
                "brand": "New Balance",
                "productCount": 353
            },
            {
                "brand": "Nike",
                "productCount": 400
            },
            {
                "brand": "Puma",
                "productCount": 2322
            },
            {
                "brand": "Red Tape",
                "productCount": 59
            },
            {
                "brand": "Reebok",
                "productCount": 892
            },
            {
                "brand": "Roadster",
                "productCount": 64
            },
            {
                "brand": "Skechers",
                "productCount": 108
            },
            {
                "brand": "Speedo",
                "productCount": 67
            },
            {
                "brand": "Technosport",
                "productCount": 1594
            },
            {
                "brand": "UNDER ARMOUR",
                "productCount": 1322
            },
            {
                "brand": "VECTOR X",
                "productCount": 73
            },
            {
                "brand": "Wildcraft",
                "productCount": 255
            },
            {
                "brand": "WROGN",
                "productCount": 37
            },
            {
                "brand": "WROGN ACTIVE",
                "productCount": 11
            }
        ],
        "productTypes": {
            "Track Pants & Joggers": [
                "Track Pants",
                "Tights"
            ],
            "Sports T-Shirts": [
                "Tshirts",
                "Tops"
            ],
            "Tracksuits & Sets": [
                "Tracksuits",
                "Clothing Set"
            ],
            "Sports Shorts": [
                "Shorts"
            ],
            "Sports Jackets & Windcheaters": [
                "Jackets",
                "Sweatshirts"
            ],
            "Swimwear": [
                "Swimwear",
                "Swim Bottoms",
                "Swim Tops"
            ]
        },
        "minDiscount": 80,
        "botMinDiscount": 80,
        "bookmarkletMinDiscount": 80
    },
    "Beauty Appliances": {
        "displayName": "Beauty Appliances",
        "basePath": "beauty-appliances",
        "brands": [
            "Agaro",
            "Alan Truman",
            "beurer",
            "Bombay Shaving Company",
            "Braun",
            "dyson",
            "GUBB",
            "Havells",
            "Ikonic",
            "KEMEI",
            "Lifelong",
            "Morphy Richards",
            "NOVA",
            "Philips",
            "Remington",
            "VEGA",
            "VEGA PROFESSIONAL",
            "VGR",
            "WAHL"
        ],
        "brandDetails": [
            {
                "brand": "Agaro",
                "productCount": 27
            },
            {
                "brand": "Alan Truman",
                "productCount": 34
            },
            {
                "brand": "beurer",
                "productCount": 3
            },
            {
                "brand": "Bombay Shaving Company",
                "productCount": 15
            },
            {
                "brand": "Braun",
                "productCount": 11
            },
            {
                "brand": "dyson",
                "productCount": 11
            },
            {
                "brand": "GUBB",
                "productCount": 7
            },
            {
                "brand": "Havells",
                "productCount": 9
            },
            {
                "brand": "Ikonic",
                "productCount": 60
            },
            {
                "brand": "KEMEI",
                "productCount": 8
            },
            {
                "brand": "Lifelong",
                "productCount": 5
            },
            {
                "brand": "Morphy Richards",
                "productCount": 2
            },
            {
                "brand": "NOVA",
                "productCount": 10
            },
            {
                "brand": "Philips",
                "productCount": 40
            },
            {
                "brand": "Remington",
                "productCount": 1
            },
            {
                "brand": "VEGA",
                "productCount": 52
            },
            {
                "brand": "VEGA PROFESSIONAL",
                "productCount": 35
            },
            {
                "brand": "VGR",
                "productCount": 158
            },
            {
                "brand": "WAHL",
                "productCount": 6
            }
        ],
        "productTypes": {
            "Hair Dryers": [
                "Dryers"
            ],
            "Hair Straighteners & Multi-Stylers": [
                "Straighteners",
                "Multi-Styler"
            ],
            "Hair Curlers & Crimpers": [
                "Curling Iron and Crimpers"
            ],
            "Trimmers & Shavers": [
                "Trimmer",
                "Shavers",
                "Body Groomer",
                "Bikini Trimmers"
            ],
            "Epilators & Massagers": [
                "Epilator",
                "Face Epilator",
                "Cleansing Tools and Massagers"
            ]
        },
        "minDiscount": 80,
        "botMinDiscount": 80,
        "bookmarkletMinDiscount": 80
    },
    "Baby Care": {
        "displayName": "Baby Care",
        "basePath": "personal-care",
        "brands": [
            "Aveeno Baby",
            "Baby Dove",
            "Babyhug",
            "Cetaphil",
            "Chicco",
            "Dabur",
            "Himalaya Baby",
            "Johnsons",
            "Mamaearth",
            "MeeMee",
            "mothercare",
            "Mylo",
            "Pigeon",
            "Sebamed",
            "Softsens",
            "SuperBottoms",
            "Tedibar"
        ],
        "brandDetails": [
            {
                "brand": "Aveeno Baby",
                "productCount": 9
            },
            {
                "brand": "Baby Dove",
                "productCount": 1
            },
            {
                "brand": "Babyhug",
                "productCount": 39
            },
            {
                "brand": "Cetaphil",
                "productCount": 18
            },
            {
                "brand": "Chicco",
                "productCount": 32
            },
            {
                "brand": "Dabur",
                "productCount": 2
            },
            {
                "brand": "Himalaya Baby",
                "productCount": 91
            },
            {
                "brand": "Johnsons",
                "productCount": 39
            },
            {
                "brand": "Mamaearth",
                "productCount": 14
            },
            {
                "brand": "MeeMee",
                "productCount": 51
            },
            {
                "brand": "mothercare",
                "productCount": 14
            },
            {
                "brand": "Mylo",
                "productCount": 52
            },
            {
                "brand": "Pigeon",
                "productCount": 1
            },
            {
                "brand": "Sebamed",
                "productCount": 8
            },
            {
                "brand": "Softsens",
                "productCount": 43
            },
            {
                "brand": "SuperBottoms",
                "productCount": 407
            },
            {
                "brand": "Tedibar",
                "productCount": 56
            }
        ],
        "productTypes": {
            "Diapers & Wipes": [
                "Diapers",
                "Baby Wipes and Buds"
            ],
            "Baby Bath & Wash": [
                "Baby Body Wash and Soap",
                "Baby Shampoo and Conditioner"
            ],
            "Baby Skin Care & Lotions": [
                "Baby Lotions and Creams",
                "Baby Body Oil",
                "Baby Powder",
                "Rash Cream"
            ],
            "Baby Health & Sunscreen": [
                "Baby Sunscreen",
                "Baby Care Kit",
                "Baby Hair Oil"
            ]
        }
    },
    "Gadgets": {
        "displayName": "Gadgets",
        "basePath": "gadgets",
        "minDiscount": 80,
        "botMinDiscount": 80,
        "bookmarkletMinDiscount": 80,
        "brands": [
            "Fastrack",
            "Fire-Boltt",
            "GOBOULT",
            "JBL",
            "NOISE",
            "OnePlus",
            "Portronics",
            "Realme",
            "Sennheiser",
            "Skullcandy",
            "Sony",
            "Timex",
            "ZEBRONICS",
            "boAt"
        ],
        "productTypes": {
            "Smart Watches & Bands": [
                "Smart Watches",
                "Fitness Bands"
            ],
            "Headphones & Earphones": [
                "Headphones"
            ],
            "Speakers": [
                "Speakers"
            ]
        }
    },
    "Watches": {
        "displayName": "Watches",
        "basePath": "watches",
        "minDiscount": 85,
        "botMinDiscount": 85,
        "bookmarkletMinDiscount": 85,
        "brands": [
            "Titan",
            "CASIO",
            "Fossil",
            "Tommy Hilfiger",
            "Michael Kors",
            "Daniel Wellington",
            "Timex",
            "TISSOT",
            "Armani Exchange",
            "Calvin Klein",
            "GUESS",
            "ANNE KLEIN",
            "Citizen",
            "Fastrack",
            "Daniel Klein",
            "DIESEL",
            "Emporio Armani",
            "French Connection",
            "GIORDANO",
            "Kenneth Cole",
            "Lacoste",
            "Nautica",
            "Police",
            "Sonata",
            "Ted Baker"
        ]
    },
    "Handbags & Bags": {
        "displayName": "Handbags & Bags",
        "basePath": "handbags-and-bags",
        "minDiscount": 85,
        "botMinDiscount": 85,
        "bookmarkletMinDiscount": 85,
        "brands": [
            "Hidesign",
            "Da Milano",
            "Caprese",
            "Lino Perros",
            "MIRAGGIO",
            "ZOUK",
            "Fossil",
            "Tommy Hilfiger",
            "Calvin Klein",
            "ALDO",
            "GUESS",
            "MANGO",
            "Chumbak",
            "MOKOBARA",
            "AMERICAN TOURISTER",
            "Skybags",
            "Safari",
            "Baggit",
            "Lavie",
            "Allen Solly",
            "Van Heusen",
            "Puma",
            "Nike",
            "ADIDAS",
            "Wildcraft",
            "LAVIE SPORT",
            "Accessorize",
            "Metro",
            "DailyObjects",
            "VIP"
        ]
    },
    "Sunglasses": {
        "displayName": "Sunglasses",
        "basePath": "sunglasses",
        "minDiscount": 85,
        "botMinDiscount": 85,
        "bookmarkletMinDiscount": 85,
        "brands": [
            "Ray-Ban",
            "OAKLEY",
            "Polaroid",
            "Carrera",
            "Vogue Eyewear",
            "Fastrack",
            "Tommy Hilfiger",
            "Calvin Klein",
            "IDEE",
            "Vincent Chase",
            "John Jacobs",
            "Police",
            "Puma",
            "Voyage",
            "GUESS",
            "Titan"
        ]
    },
    "Men Personal Care": {
        "displayName": "Men Personal Care",
        "basePath": "men-personal-care",
        "minDiscount": 80,
        "botMinDiscount": 80,
        "bookmarkletMinDiscount": 80,
        "brands": [
            "AXE",
            "BEARDO",
            "Biotique",
            "Bombay Shaving Company",
            "CINTHOL",
            "Denver",
            "Dettol",
            "Fogg",
            "Gillette",
            "Himalaya",
            "Khadi Natural",
            "LOreal",
            "Mamaearth",
            "Man Matters",
            "Nivea",
            "Old Spice",
            "Park Avenue",
            "Pears",
            "Set Wet",
            "THE MAN COMPANY",
            "Ustraa",
            "Vaseline",
            "Wild stone"
        ],
        "productTypes": {
            "Beard Grooming & Shaving": [
                "Beard Serum and Oil",
                "Beard Wash",
                "Shaving Cream and Foam",
                "After Shave Lotion and Balm",
                "Razors and Cartridges"
            ],
            "Men Deodorants & Perfumes": [
                "Deodorant",
                "Perfume",
                "Body Mist and Spray",
                "Attar"
            ],
            "Men Hair & Face Care": [
                "Hair Gels and Wax",
                "Hair Oil",
                "Shampoo",
                "Face Wash and Cleanser"
            ],
            "Men Bath & Shower": [
                "Soap",
                "Body Wash and Shower Gel"
            ]
        }
    },
    "Men Accessories": {
        "displayName": "Men Accessories",
        "basePath": "men-accessories",
        "minDiscount": 85,
        "botMinDiscount": 85,
        "bookmarkletMinDiscount": 85,
        "brands": [
            "Allen Solly",
            "AMERICAN TOURISTER",
            "Arrow",
            "Calvin Klein",
            "Fastrack",
            "Flying Machine",
            "Fossil",
            "Hidesign",
            "HRX by Hrithik Roshan",
            "Jack & Jones",
            "Levis",
            "Louis Philippe",
            "Nautica",
            "Nike",
            "Park Avenue",
            "Peter England",
            "Polaroid",
            "Police",
            "Puma",
            "Ray-Ban",
            "Red Tape",
            "Roadster",
            "Safari",
            "Skybags",
            "Titan",
            "Tommy Hilfiger",
            "U.S. Polo Assn.",
            "Van Heusen",
            "Wildcraft",
            "WildHorn",
            "Woodland",
            "WROGN"
        ],
        "productTypes": {
            "Wallets & Card Holders": [
                "Wallets",
                "Card Holder"
            ],
            "Belts": [
                "Belts"
            ],
            "Sunglasses & Eyewear": [
                "Sunglasses",
                "Eye Glasses"
            ],
            "Bags, Backpacks & Luggage": [
                "Backpacks",
                "Trolley Bag",
                "Duffle Bag",
                "Messenger Bag"
            ],
            "Caps & Hats": [
                "Caps",
                "Hats"
            ],
            "Ties & Cufflinks": [
                "Ties",
                "Cufflinks",
                "Pocket Square"
            ]
        }
    },
    "Bedding": {
        "displayName": "Bedding",
        "basePath": "bedding",
        "minDiscount": 70,
        "botMinDiscount": 70,
        "bookmarkletMinDiscount": 70,
        "brands": [
            "Arrabi",
            "Aura",
            "BIANCA",
            "BOMBAY DYEING",
            "Boutique Living India",
            "CHHAVI INDIA",
            "Cortina",
            "DDecor",
            "DECENT HOME",
            "FABINALIV",
            "Fabindia",
            "H&M",
            "Home Centre",
            "Huesland",
            "IWS",
            "JAIPUR FABRIC",
            "JC HOME",
            "KLOTTHE",
            "Layers",
            "MAFATLAL",
            "MASPAR",
            "MYTRIDENT",
            "Monte Carlo",
            "Portico",
            "Pure Decor",
            "Raymond Home",
            "SPACES",
            "SWAYAM",
            "Saral Home",
            "Stoa Paris",
            "Story@home",
            "Trance Home Linen",
            "URBAN SPACE",
            "Welspun",
            "haus & kinder"
        ],
        "productTypes": {
            "Bedsheets & Sets": [
                "Bedsheets",
                "Bedding Set",
                "Bed Covers",
                "Duvet Cover"
            ],
            "Blankets & Quilts": [
                "Blankets",
                "Quilts",
                "Dohars",
                "Comforters"
            ],
            "Pillows & Protectors": [
                "Pillows",
                "Pillow Covers",
                "Mattress Protector"
            ]
        }
    },
    "Bath": {
        "displayName": "Bath",
        "basePath": "home-furnishing-menu?f=Categories%3ABath%20Robe%2CBath%20Rugs%2CBath%20Towels%2CBathroom%20Accessories%2CBeach%20Towels%2CFace%20Towels%2CHand%20Towels%2CShower%20Curtains%2CTowel%20Set",
        "minDiscount": 70,
        "botMinDiscount": 70,
        "bookmarkletMinDiscount": 70,
        "brands": [
            "Arrabi",
            "Athom Living",
            "Athom Trendz",
            "Aura",
            "BIANCA",
            "BOMBAY DYEING",
            "CASA-NEST",
            "DEMARK",
            "Decathlon",
            "Doctor Towels",
            "Fabindia",
            "Fezora",
            "H&M",
            "Himeya",
            "Home Centre",
            "KLOTTHE",
            "Kuber Industries",
            "Layers",
            "MARKET99",
            "MASPAR",
            "MYTRIDENT",
            "Monte Carlo",
            "OBSESSIONS",
            "QUARCK",
            "Raymond Home",
            "SPACES",
            "Saral Home",
            "Softspun Microfiber",
            "UMAI",
            "Welspun",
            "haus & kinder"
        ],
        "productTypes": {
            "Towels": [
                "Bath Towels",
                "Towel Set",
                "Hand Towels",
                "Face Towels",
                "Beach Towels"
            ],
            "Bath Robes & Mats": [
                "Bath Robe and Wraps",
                "Bath Rugs",
                "Bath Mats"
            ],
            "Bathroom Accessories": [
                "Bathroom Accessories",
                "Shower Curtains",
                "Bath Sets"
            ]
        }
    },
    "Curtains & Furnishings": {
        "basePath": "home-furnishing-menu?f=Categories%3ACurtains%20and%20Sheers%2CCushion%20Covers%2CCushions%2CSofa%20Covers%2CDiwan%20Set%2CThrows",
        "minDiscount": 70,
        "botMinDiscount": 70,
        "brands": [
            "DDecor",
            "SPACES",
            "SWAYAM",
            "Portico",
            "BOMBAY DYEING",
            "URBAN SPACE",
            "ROMEE",
            "Cortina",
            "SEJ by Nisha Gupta",
            "Saral Home",
            "MASPAR",
            "Chumbak",
            "Fabindia",
            "Home Centre",
            "Aura",
            "JC HOME",
            "KLOTTHE",
            "Pure Decor",
            "Arrabi",
            "CHHAVI INDIA",
            "FABINALIV",
            "The Furnishing Tree",
            "Kuber Industries",
            "VAASINI",
            "Yellow Weaves",
            "STITCHNEST",
            "THROWPILLOW",
            "HOMEMONDE",
            "Story@home"
        ]
    },
    "Lamps & Lighting": {
        "basePath": "lamps-and-lighting",
        "minDiscount": 70,
        "botMinDiscount": 70,
        "brands": [
            "Philips",
            "Homesake",
            "ExclusiveLane",
            "Chumbak",
            "Pure Home and Living",
            "Havells",
            "Wipro",
            "Fos Lighting",
            "Home Centre",
            "Iris",
            "SOMIL",
            "Tu Casa",
            "eCraftIndia",
            "HOSLEY",
            "Artisyn",
            "DeoDap",
            "TAYHAA"
        ]
    },
    "Kitchen & Dining": {
        "basePath": "kitchen-and-dining",
        "minDiscount": 70,
        "botMinDiscount": 70,
        "brands": [
            "BOROSIL",
            "Prestige",
            "Hawkins",
            "Milton",
            "Wonderchef",
            "MEYER",
            "Corelle",
            "Cello",
            "SignoraWare",
            "BERGNER",
            "Vinod",
            "CLAY CRAFT",
            "Laopala",
            "Servewell",
            "Femora",
            "MIAH Decor",
            "VarEesha",
            "ExclusiveLane",
            "Fabindia",
            "Home Centre",
            "Kuber Industries",
            "Aapno Rajasthan",
            "DeoDap",
            "NFI essentials",
            "Dynore",
            "Unravel India"
        ]
    },
    "Home Decor": {
        "basePath": "home-decor",
        "minDiscount": 70,
        "botMinDiscount": 70,
        "brands": [
            "Titan",
            "Ajanta",
            "ExclusiveLane",
            "Chumbak",
            "Pure Home and Living",
            "ellementry",
            "SEJ by Nisha Gupta",
            "Nestasia",
            "The Wishing Chair",
            "Home Centre",
            "Art Street",
            "RANDOM",
            "eCraftIndia",
            "TAYHAA",
            "Fabindia",
            "Whats Your Kick",
            "1ST TIME",
            "Devansh",
            "SAF",
            "999Store",
            "Wallpics",
            "Kotart",
            "Myntra Elegant Homes",
            "DeoDap",
            "UNIVERSITY TRENDZ",
            "HOSLEY",
            "Artisyn",
            "Indianshelf"
        ]
    },
    "Floor Covering & Organisers": {
        "basePath": "floor-mats-dhurries-carpets",
        "minDiscount": 70,
        "botMinDiscount": 70,
        "brands": [
            "Saral Home",
            "Status",
            "OBSESSIONS",
            "Chumbak",
            "Home Centre",
            "Ekam",
            "SPACES",
            "Mona B",
            "HOUSE OF QUIRK",
            "prettykrafts",
            "Safiya Carpet",
            "HOMEMONDE",
            "Stylista",
            "PnF",
            "Kuber Industries",
            "COATCASE",
            "HOKIPO",
            "Lushomes",
            "DeoDap"
        ]
    },
    "Footwear": {
        "basePath": "footwear",
        "minDiscount": 89,
        "botMinDiscount": 89,
        "brands": [
            "Nike",
            "ADIDAS",
            "Puma",
            "Reebok",
            "Skechers",
            "ASICS",
            "New Balance",
            "UNDER ARMOUR",
            "Woodland",
            "Crocs",
            "Bata",
            "Hush Puppies",
            "Clarks",
            "Metro",
            "Mochi",
            "Red Chief",
            "U.S. Polo Assn.",
            "Birkenstock",
            "ALDO",
            "Cole Haan",
            "Geox",
            "Tommy Hilfiger",
            "Calvin Klein",
            "Saint G",
            "Inc 5",
            "Carlton London",
            "CHARLES & KEITH",
            "Catwalk",
            "mothercare",
            "Campus",
            "Sparx",
            "Liberty",
            "Khadims",
            "Action",
            "Provogue",
            "Shoetopia",
            "Denill",
            "Marc Loire",
            "London Rag",
            "ERIDANI",
            "Moda Rapido",
            "DressBerry",
            "CORSICA",
            "Anouk",
            "House of Pataudi",
            "LOUIS STITCH",
            "Stylestry",
            "SZN",
            "Try Me",
            "Fulkari",
            "Dollphin"
        ]
    },
    "Clothing": {
        "basePath": "clothing",
        "minDiscount": 89,
        "botMinDiscount": 89,
        "brands": [
            "Tommy Hilfiger",
            "Calvin Klein",
            "Levis",
            "Marks & Spencer",
            "United Colors of Benetton",
            "H&M",
            "GAP",
            "U.S. Polo Assn.",
            "Pepe Jeans",
            "French Connection",
            "MANGO",
            "Forever New",
            "Jack & Jones",
            "Vero Moda",
            "ONLY",
            "Arrow",
            "Van Heusen",
            "Louis Philippe",
            "Peter England",
            "Allen Solly",
            "Blackberrys",
            "Park Avenue",
            "Raymond",
            "ColorPlus",
            "Snitch",
            "RARE RABBIT",
            "Biba",
            "W",
            "AURELIA",
            "Global Desi",
            "Fabindia",
            "Soch",
            "AND",
            "Gini and Jony",
            "mothercare",
            "Flying Machine",
            "SPYKAR",
            "Monte Carlo",
            "Mufti",
            "Libas",
            "Varanga",
            "Indo Era",
            "max",
            "V-Mart",
            "Crimsoune Club",
            "WROGN",
            "Chemistry",
            "Sztori",
            "Outzidr",
            "House of Pataudi"
        ]
    },
    "Bath & Body": {
        "basePath": "bath-and-body",
        "minDiscount": 70,
        "botMinDiscount": 70,
        "brands": [
            "Bath & Body Works",
            "Victoria's Secret",
            "THE BODY SHOP",
            "Plum",
            "Nivea",
            "Dove",
            "Vaseline",
            "Forest Essentials",
            "KAMA AYURVEDA",
            "MCaffeine",
            "Kimirica",
            "The Derma co.",
            "DOT & KEY",
            "Cetaphil",
            "Sebamed",
            "Palmolive",
            "Pears",
            "St. Ives",
            "Biotique",
            "Sirona",
            "Real Techniques",
            "VEGA",
            "PAC",
            "Colorbar",
            "Fiama",
            "Old Spice",
            "LUX",
            "Dettol",
            "Lifebuoy",
            "JOY",
            "Khadi Natural",
            "Mamaearth",
            "WOW SKIN SCIENCE",
            "Simple",
            "Gillette"
        ]
    }
};
  // State
  let currentProducts = [];
  let isFetching = false;

  // Build Floating UI Panel - Myntra Theme (Right Drawer with Single-Column Categories)
  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <style>
      #${PANEL_ID} {
        position: fixed;
        top: 0;
        right: 0;
        width: 640px;
        max-width: 96vw;
        height: 100vh;
        background: #ffffff;
        color: #282c3f;
        box-shadow: -6px 0 30px rgba(40,44,63,0.18);
        font-family: Whitney, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 13px;
        z-index: 99999999;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        -webkit-font-smoothing: antialiased;
      }
      #${PANEL_ID} * { box-sizing: border-box; }
      #${PANEL_ID} ::-webkit-scrollbar { width: 5px; height: 5px; }
      #${PANEL_ID} ::-webkit-scrollbar-track { background: transparent; }
      #${PANEL_ID} ::-webkit-scrollbar-thumb { background: #d4d5d9; border-radius: 4px; }
      #${PANEL_ID} ::-webkit-scrollbar-thumb:hover { background: #b0b1b8; }

      /* Top Header */
      #${PANEL_ID} .mds-hdr {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 20px;
        background: #ffffff;
        border-bottom: 1px solid #eaeaec;
        flex-shrink: 0;
      }
      #${PANEL_ID} .mds-logo-box {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      #${PANEL_ID} .mds-logo-icon {
        background: #ff3e6c;
        color: #ffffff;
        font-weight: 900;
        font-size: 14px;
        padding: 3px 8px;
        border-radius: 4px;
        letter-spacing: 0.5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      #${PANEL_ID} .mds-logo-title {
        font-size: 14px;
        font-weight: 700;
        color: #282c3f;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }
      #${PANEL_ID} .mds-logo-sub {
        font-size: 11px;
        color: #7e818c;
        font-weight: 500;
      }
      #${PANEL_ID} .mds-close-btn {
        background: none;
        border: none;
        color: #535766;
        font-size: 26px;
        cursor: pointer;
        padding: 2px 8px;
        line-height: 1;
        border-radius: 50%;
        transition: all 0.15s ease;
      }
      #${PANEL_ID} .mds-close-btn:hover {
        color: #ff3e6c;
        background: #fff0f4;
      }

      /* Main Body: 2 Columns */
      #${PANEL_ID} .mds-body {
        flex: 1;
        display: flex;
        overflow: hidden;
      }

      /* Left Column: Single Column of Categories */
      #${PANEL_ID} .mds-cat-sidebar {
        width: 195px;
        flex-shrink: 0;
        background: #f9f9fa;
        border-right: 1px solid #eaeaec;
        display: flex;
        flex-direction: column;
      }
      #${PANEL_ID} .mds-cat-search-box {
        padding: 10px;
        border-bottom: 1px solid #eaeaec;
        background: #ffffff;
      }
      #${PANEL_ID} .mds-cat-search-input {
        width: 100%;
        padding: 7px 10px;
        font-size: 11.5px;
        border: 1px solid #d4d5d9;
        border-radius: 4px;
        outline: none;
        font-family: inherit;
        color: #282c3f;
        background: #fdfdfd;
        transition: border-color 0.2s;
      }
      #${PANEL_ID} .mds-cat-search-input:focus {
        border-color: #ff3e6c;
      }
      #${PANEL_ID} .mds-cat-header-lbl {
        padding: 10px 14px 4px;
        font-size: 10.5px;
        font-weight: 700;
        color: #7e818c;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #${PANEL_ID} .mds-cat-list {
        flex: 1;
        overflow-y: auto;
        padding: 4px 0;
      }
      #${PANEL_ID} .cat-item {
        padding: 10px 14px;
        font-size: 12px;
        font-weight: 600;
        color: #282c3f;
        cursor: pointer;
        border-left: 3px solid transparent;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
      }
      #${PANEL_ID} .cat-item:hover {
        background: #f0f1f3;
        color: #ff3e6c;
      }
      #${PANEL_ID} .cat-item.active {
        background: #ffffff;
        border-left-color: #ff3e6c;
        color: #ff3e6c;
        font-weight: 700;
      }
      #${PANEL_ID} .cat-brand-pill {
        font-size: 10px;
        font-weight: 600;
        color: #7e818c;
        background: #f0f1f3;
        padding: 1px 6px;
        border-radius: 10px;
        margin-left: 6px;
      }
      #${PANEL_ID} .cat-item.active .cat-brand-pill {
        background: #fff0f4;
        color: #ff3e6c;
      }

      /* Right Column: Controls & Feed */
      #${PANEL_ID} .mds-main-panel {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        background: #f5f5f6;
      }
      #${PANEL_ID} .mds-controls-card {
        background: #ffffff;
        border-bottom: 1px solid #eaeaec;
        padding: 14px 18px;
        flex-shrink: 0;
      }
      #${PANEL_ID} .mds-cat-title-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 10px;
      }
      #${PANEL_ID} .mds-active-cat-name {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: #282c3f;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      #${PANEL_ID} .mds-active-cat-sub {
        font-size: 11.5px;
        color: #7e818c;
        font-weight: 500;
      }
      #${PANEL_ID} .mds-filters-row {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 10px;
      }
      #${PANEL_ID} .mds-filter-group {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
      }
      #${PANEL_ID} .mds-filter-label {
        font-size: 10px;
        font-weight: 700;
        color: #535766;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      #${PANEL_ID} .mds-select, #${PANEL_ID} .mds-input {
        width: 100%;
        padding: 7px 10px;
        border: 1px solid #d4d5d9;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #282c3f;
        background: #ffffff;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
      }
      #${PANEL_ID} .mds-select:focus, #${PANEL_ID} .mds-input:focus {
        border-color: #ff3e6c;
      }
      #${PANEL_ID} .mds-fetch-btn {
        width: 100%;
        padding: 11px;
        background: #ff3e6c;
        border: none;
        border-radius: 4px;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s;
        font-family: inherit;
      }
      #${PANEL_ID} .mds-fetch-btn:hover {
        background: #e6355f;
        box-shadow: 0 4px 12px rgba(255,62,108,0.25);
      }
      #${PANEL_ID} .mds-fetch-btn:disabled {
        background: #d4d5d9;
        cursor: not-allowed;
        box-shadow: none;
      }

      /* Status Strip */
      #${PANEL_ID} .mds-status-bar {
        background: #fcfcfd;
        border-bottom: 1px solid #eaeaec;
        padding: 7px 18px;
        font-size: 11.5px;
        color: #535766;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }
      #${PANEL_ID} .mds-status-text {
        color: #535766;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #${PANEL_ID} .mds-count-badge {
        font-weight: 700;
        color: #282c3f;
        flex-shrink: 0;
        margin-left: 10px;
      }

      /* Results Feed */
      #${PANEL_ID} .results-container {
        flex: 1;
        overflow-y: auto;
        padding: 14px 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: #f5f5f6;
      }
      #${PANEL_ID} .card {
        display: flex;
        gap: 12px;
        background: #ffffff;
        border: 1px solid #eaeaec;
        border-radius: 4px;
        padding: 10px;
        text-decoration: none;
        color: inherit;
        transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
      }
      #${PANEL_ID} .card:hover {
        border-color: #ff3e6c;
        box-shadow: 0 4px 14px rgba(40,44,63,0.12);
        transform: translateY(-1px);
      }
      #${PANEL_ID} .card img {
        width: 72px;
        height: 96px;
        object-fit: cover;
        border-radius: 3px;
        background: #f0f0f2;
        flex-shrink: 0;
      }
      #${PANEL_ID} .card-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      #${PANEL_ID} .card-brand {
        font-size: 12.5px;
        font-weight: 700;
        color: #282c3f;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-bottom: 2px;
      }
      #${PANEL_ID} .card-title {
        font-size: 12px;
        font-weight: 400;
        color: #535766;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 6px;
      }
      #${PANEL_ID} .price-row {
        display: flex;
        align-items: baseline;
        gap: 6px;
        margin: 2px 0 4px;
      }
      #${PANEL_ID} .price-deal {
        font-size: 14px;
        font-weight: 700;
        color: #282c3f;
      }
      #${PANEL_ID} .price-mrp {
        font-size: 11.5px;
        text-decoration: line-through;
        color: #7e818c;
      }
      #${PANEL_ID} .badge-discount {
        font-size: 12px;
        font-weight: 700;
        color: #ff905a;
      }
      #${PANEL_ID} .rating-pill {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 10px;
        font-weight: 700;
        color: #282c3f;
        background: #ffffff;
        border: 1px solid #eaeaec;
        border-radius: 2px;
        padding: 1px 5px;
        width: fit-content;
      }

      /* Footer */
      #${PANEL_ID} .mds-footer {
        padding: 9px 18px;
        background: #ffffff;
        border-top: 1px solid #eaeaec;
        font-size: 11px;
        color: #7e818c;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }
    </style>

    <div class="mds-hdr">
      <div class="mds-logo-box">
        <span class="mds-logo-icon">M</span>
        <div>
          <div class="mds-logo-title">Myntra Deal Sentinel</div>
          <div class="mds-logo-sub">Steepest discounts on curated top brands</div>
        </div>
      </div>
      <button class="mds-close-btn" id="mds-close" title="Close Panel">&times;</button>
    </div>

    <div class="mds-body">
      <!-- Left Column: Single Column of Categories -->
      <div class="mds-cat-sidebar">
        <div class="mds-cat-search-box">
          <input type="text" id="mds-cat-search" class="mds-cat-search-input" placeholder="🔍 Search category..." />
        </div>
        <div class="mds-cat-header-lbl">Categories (${Object.keys(CATEGORY_DATA).length})</div>
        <div class="mds-cat-list" id="mds-categories">
          ${Object.keys(CATEGORY_DATA).map((cat, idx) => `
            <div class="cat-item ${idx === 0 ? 'active' : ''}" data-cat="${cat}">
              <span>${cat}</span>
              <span class="cat-brand-pill">${CATEGORY_DATA[cat]?.brands?.length || 0}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right Column: Controls & Results -->
      <div class="mds-main-panel">
        <div class="mds-controls-card">
          <div class="mds-cat-title-row">
            <h2 class="mds-active-cat-name" id="mds-active-cat-name">${Object.keys(CATEGORY_DATA)[0]}</h2>
            <span class="mds-active-cat-sub" id="mds-cat-sub">${CATEGORY_DATA[Object.keys(CATEGORY_DATA)[0]]?.brands?.length || 0} Curated Brands</span>
          </div>

          <div class="mds-filters-row">
            <div class="mds-filter-group" style="flex: 2;">
              <span class="mds-filter-label">Min Discount</span>
              <select id="mds-discount" class="mds-select">
                <option value="50">50% & Above</option>
                <option value="55">55% & Above</option>
                <option value="60">60% & Above</option>
                <option value="65">65% & Above</option>
                <option value="70" selected>70% & Above</option>
                <option value="75">75% & Above</option>
                <option value="80">80% & Above</option>
                <option value="85">85% & Above</option>
                <option value="89">89% & Above</option>
                <option value="90">90% & Above</option>
                <option value="95">95% & Above</option>
              </select>
            </div>

            <div class="mds-filter-group" style="flex: 1;">
              <span class="mds-filter-label">Delivery Pincode</span>
              <input type="text" id="mds-pincode" class="mds-input" value="${DEFAULT_PINCODE}" />
            </div>
          </div>

          <button class="mds-fetch-btn" id="mds-fetch-btn">⚡ Fetch Highest Discount Deals</button>
        </div>

        <div class="mds-status-bar">
          <span class="mds-status-text" id="mds-status">Ready. Click Fetch to scan Myntra.</span>
          <span class="mds-count-badge" id="mds-count">0 items found</span>
        </div>

        <div class="results-container" id="mds-results">
          <div style="text-align: center; color: #7e818c; padding: 60px 20px;">
            <div style="font-size: 32px; margin-bottom: 10px;">🛍️</div>
            <div style="font-weight: 600; color: #282c3f; margin-bottom: 4px;">No deals loaded yet</div>
            <div style="font-size: 12px; color: #94969f;">Select a category from the left and click Fetch Deals.</div>
          </div>
        </div>

        <div class="mds-footer">
          <span>Delivery context: Pincode <strong id="mds-pin-lbl" style="color: #282c3f;">${DEFAULT_PINCODE}</strong></span>
          <span>Myntra Deal Sentinel v2.13.0</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  // Bind Events
  const closeBtn = panel.querySelector('#mds-close');
  const catItems = panel.querySelectorAll('.cat-item');
  const catSearchInput = panel.querySelector('#mds-cat-search');
  const activeCatNameEl = panel.querySelector('#mds-active-cat-name');
  const activeCatSubEl = panel.querySelector('#mds-cat-sub');
  const fetchBtn = panel.querySelector('#mds-fetch-btn');
  const statusEl = panel.querySelector('#mds-status');
  const resultsEl = panel.querySelector('#mds-results');
  const countEl = panel.querySelector('#mds-count');
  const pincodeInput = panel.querySelector('#mds-pincode');
  const discountSelect = panel.querySelector('#mds-discount');
  const pinLbl = panel.querySelector('#mds-pin-lbl');

  let selectedCategory = Object.keys(CATEGORY_DATA)[0];

  closeBtn.onclick = () => { panel.style.display = 'none'; };

  catItems.forEach(btn => {
    btn.onclick = () => {
      catItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.dataset.cat;
      const catConfig = CATEGORY_DATA[selectedCategory];
      if (activeCatNameEl) activeCatNameEl.textContent = selectedCategory;
      if (activeCatSubEl) activeCatSubEl.textContent = `${catConfig?.brands?.length || 0} Curated Brands`;
      if (catConfig && (catConfig.botMinDiscount || catConfig.minDiscount)) {
        discountSelect.value = String(catConfig.botMinDiscount || catConfig.minDiscount);
      }
    };
  });

  if (catSearchInput) {
    catSearchInput.oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      catItems.forEach(item => {
        const catName = item.dataset.cat.toLowerCase();
        item.style.display = catName.includes(q) ? 'flex' : 'none';
      });
    };
  }

  pincodeInput.onchange = () => {
    pinLbl.textContent = pincodeInput.value.trim() || DEFAULT_PINCODE;
  };

  // Fetch logic
  fetchBtn.onclick = async () => {
    if (isFetching) return;
    isFetching = true;
    fetchBtn.disabled = true;
    fetchBtn.textContent = '⏳ Fetching deals...';

    const pincode = pincodeInput.value.trim() || DEFAULT_PINCODE;
    const minDiscount = parseInt(discountSelect.value, 10);
    const catConfig = CATEGORY_DATA[selectedCategory];

    if (!catConfig || !catConfig.brands.length) {
      statusEl.textContent = 'Category not found or has no brands configured.';
      isFetching = false;
      fetchBtn.disabled = false;
      return;
    }

    statusEl.textContent = `Scanning ${catConfig.brands.length} brands in ${selectedCategory}...`;
    resultsEl.innerHTML = '<div style="text-align: center; padding: 30px; color: #9ca3af;">Scanning Myntra for steepest discounts...</div>';

    try {
      // Chunk brands into batches of 35
      const BATCH_SIZE = 35;
      const brandBatches = [];
      for (let i = 0; i < catConfig.brands.length; i += BATCH_SIZE) {
        brandBatches.push(catConfig.brands.slice(i, i + BATCH_SIZE));
      }

      let allFetchedProducts = [];

      for (let bIdx = 0; bIdx < brandBatches.length; bIdx++) {
        const batch = brandBatches[bIdx];
        const brandsParam = batch.join(',');
        let targetUrl;
        if (catConfig.basePath.includes('?')) {
          const [pathPart, queryPart] = catConfig.basePath.split('?');
          const urlParams = new URLSearchParams(queryPart);
          const existingF = urlParams.get('f');
          urlParams.set('f', existingF ? `${existingF}::Brand:${brandsParam}` : `Brand:${brandsParam}`);
          urlParams.set('sort', 'discount');
          urlParams.set('p', '1');
          targetUrl = `https://www.myntra.com/${pathPart}?${urlParams.toString()}`;
        } else {
          targetUrl = `https://www.myntra.com/${catConfig.basePath}?f=Brand:${encodeURIComponent(brandsParam)}&sort=discount&p=1`;
        }

        statusEl.textContent = `Fetching batch ${bIdx + 1}/${brandBatches.length}...`;

        const resp = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'x-location-context': `pincode=${pincode};source=USER_INPUT`,
            'x-meta-app': 'channel=web',
            'x-myntraweb': 'Yes',
            'x-requested-with': 'browser'
          },
          credentials: 'include'
        });

        if (!resp.ok) {
          console.warn('Batch fetch failed with status:', resp.status);
          continue;
        }

        const html = await resp.text();
        const extracted = extractProductsFromHtml(html);
        if (extracted && extracted.length) {
          allFetchedProducts.push(...extracted);
        }
      }

      // Deduplicate by productId and filter by min discount
      const uniqueMap = new Map();
      allFetchedProducts.forEach(p => {
        if (!uniqueMap.has(p.productId)) {
          const mrp = p.mrp || 0;
          const price = p.price || 0;
          if (mrp > 0 && price > 0) {
            const discountPct = Math.round(((mrp - price) / mrp) * 100);
            if (discountPct >= minDiscount) {
              uniqueMap.set(p.productId, { ...p, calculatedDiscount: discountPct });
            }
          }
        }
      });

      // Sort by discount percentage descending
      const sortedDeals = Array.from(uniqueMap.values()).sort((a, b) => b.calculatedDiscount - a.calculatedDiscount);
      currentProducts = sortedDeals;

      renderDeals(sortedDeals);
      statusEl.textContent = `Done! Found ${sortedDeals.length} deals at ${minDiscount}%+ off.`;
      countEl.textContent = `${sortedDeals.length} items found`;

    } catch (err) {
      console.error('Fetch error:', err);
      statusEl.textContent = 'Error fetching deals: ' + err.message;
      resultsEl.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">Failed to fetch: ${err.message}</div>`;
    } finally {
      isFetching = false;
      fetchBtn.disabled = false;
      fetchBtn.textContent = '⚡ Fetch Highest Discount Deals';
    }
  };

  // Helper to extract JSON objects matching curly braces
  function extractJsonObject(str, startIdx) {
    let braceCount = 0;
    let inString = false;
    let escape = false;

    for (let i = startIdx; i < str.length; i++) {
      const char = str[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            return str.substring(startIdx, i + 1);
          }
        }
      }
    }
    return null;
  }

  // Helper to extract products from either window.__myx or pageStateData
  function extractProductsFromHtml(html) {
    // 1. Try window.__myx (standard for filtered search URLs)
    const myxPrefix = 'window.__myx = ';
    const myxIdx = html.indexOf(myxPrefix);
    if (myxIdx !== -1) {
      try {
        const jsonStr = extractJsonObject(html, myxIdx + myxPrefix.length);
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          const prods = parsed?.searchData?.results?.products;
          if (prods && prods.length) return prods;
        }
      } catch (e) {
        console.warn('myx parse error:', e);
      }
    }

    // 2. Try pageStateData (standard for root category landing pages)
    const psPrefix = 'var pageStateData = { data: ';
    const psIdx = html.indexOf(psPrefix);
    if (psIdx !== -1) {
      try {
        const jsonStr = extractJsonObject(html, psIdx + psPrefix.length);
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          if (parsed?.products?.length) return parsed.products;
        }
      } catch (e) {
        console.warn('pageStateData parse error:', e);
      }
    }

    return [];
  }

  // Render product cards - Myntra Theme
  function renderDeals(products) {
    if (!products.length) {
      resultsEl.innerHTML = `
        <div style="text-align: center; color: #7e818c; padding: 60px 20px;">
          <div style="font-size: 32px; margin-bottom: 10px;">🔍</div>
          <div style="font-weight: 700; color: #282c3f; font-size: 14px; margin-bottom: 4px;">No Deals Found</div>
          <div style="font-size: 12px; color: #94969f;">No products match ${discountSelect.value}%+ discount.<br>Try lowering the discount filter or picking another category.</div>
        </div>
      `;
      return;
    }

    resultsEl.innerHTML = products.map(p => {
      const fullUrl = 'https://www.myntra.com/' + (p.landingPageUrl || '');
      const ratingStr = p.rating ? `<span style="color:#14958f; margin-right: 2px;">★</span>${p.rating.toFixed(1)} <span style="color:#7e818c; font-weight:400;">| ${(p.ratingCount || 0).toLocaleString()}</span>` : '';

      return `
        <a class="card" href="${fullUrl}" target="_blank" rel="noopener">
          <img src="${p.searchImage}" alt="${p.brand}" loading="lazy" />
          <div class="card-info">
            <div class="card-brand">${p.brand}</div>
            <div class="card-title" title="${p.product}">${p.product}</div>
            <div class="price-row">
              <span class="price-deal">₹${(p.price || 0).toLocaleString()}</span>
              <span class="price-mrp">₹${(p.mrp || 0).toLocaleString()}</span>
              <span class="badge-discount">(${p.calculatedDiscount}% OFF)</span>
            </div>
            ${ratingStr ? `<div class="rating-pill">${ratingStr}</div>` : ''}
          </div>
        </a>
      `;
    }).join('');
  }
})();
