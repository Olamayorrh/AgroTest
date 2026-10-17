// African Geographic Data
// Structure: Country → State/Region → LGA/District/Sub-County
// Used for proximity-based equipment discovery and location filtering

export const AFRICA_GEO = {
  NG: {
    name: "Nigeria",
    currency: "NGN",
    symbol: "₦",
    states: {
      LA: {
        name: "Lagos",
        lgas: [
          "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
          "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye",
          "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
          "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"
        ]
      },
      OY: {
        name: "Oyo",
        lgas: [
          "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda",
          "Ibadan North", "Ibadan North-East", "Ibadan North-West",
          "Ibadan South-East", "Ibadan South-West", "Ibarapa Central",
          "Ibarapa East", "Ibarapa North", "Ido", "Irepo",
          "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu",
          "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo",
          "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East",
          "Oyo West", "Saki East", "Saki West", "Surulere"
        ]
      },
      OG: {
        name: "Ogun",
        lgas: [
          "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Egbado North",
          "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North",
          "Ijebu North-East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia",
          "Obafemi-Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North",
          "Sagamu", "Shagamu"
        ]
      },
      KD: {
        name: "Kaduna",
        lgas: [
          "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara",
          "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South",
          "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau",
          "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga",
          "Soba", "Zangon Kataf", "Zaria"
        ]
      },
      KN: {
        name: "Kano",
        lgas: [
          "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi",
          "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa",
          "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam",
          "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo",
          "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso",
          "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir",
          "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono",
          "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa",
          "Tudun Wada", "Ungogo", "Warawa", "Wudil"
        ]
      },
      RI: {
        name: "Rivers",
        lgas: [
          "Abua-Odual", "Ahoada East", "Ahoada West", "Akuku-Toru",
          "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme",
          "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana",
          "Obio-Akpor", "Ogba-Egbema-Ndoni", "Ogu-Bolo", "Okrika",
          "Omuma", "Opobo-Nkoro", "Oyigbo", "Port Harcourt",
          "Tai"
        ]
      },
      KE: {
        name: "Kebbi",
        lgas: [
          "Aleiro", "Arewa", "Argungu", "Augie", "Bagudo",
          "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu",
          "Jega", "Kalgo", "Koko-Besse", "Maiyama", "Ngaski",
          "Sakaba", "Shanga", "Suru", "Wasagu-Danko", "Yauri",
          "Zuru"
        ]
      },
      AN: {
        name: "Anambra",
        lgas: [
          "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North",
          "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North",
          "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South",
          "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North",
          "Orumba South", "Oyi"
        ]
      },
      EN: {
        name: "Enugu",
        lgas: [
          "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South",
          "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South",
          "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka",
          "Oji River", "Udenu", "Udi", "Uzo Uwani"
        ]
      },
      KW: {
        name: "Kwara",
        lgas: [
          "Asa", "Baruten", "Edu", "Ekiti", "Ifelodun",
          "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun",
          "Isin", "Kaiama", "Moro", "Offa", "Oke Ero",
          "Oyun", "Pategi"
        ]
      },
      NA: {
        name: "Nasarawa",
        lgas: [
          "Akwanga", "Awe", "Doma", "Karu", "Keana",
          "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon",
          "Obi", "Toto", "Wamba"
        ]
      },
      TA: {
        name: "Taraba",
        lgas: [
          "Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol",
          "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau",
          "Sardauna", "Takum", "Ussa", "Wukari", "Yorro",
          "Zing"
        ]
      },
      BY: {
        name: "Bayelsa",
        lgas: [
          "Brass", "Ekeremor", "Kolokuma-Opokuma", "Nembe",
          "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"
        ]
      },
      BN: {
        name: "Benue",
        lgas: [
          "Ado", "Agatu", "Apa", "Buruku", "Gboko",
          "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha",
          "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo",
          "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka",
          "Ukum", "Ushongo", "Vandeikya"
        ]
      },
      PL: {
        name: "Plateau",
        lgas: [
          "Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North",
          "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South",
          "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom",
          "Shendam", "Wase"
        ]
      },
      SO: {
        name: "Sokoto",
        lgas: [
          "Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo",
          "Gudu", "Gwadabawa", "Illela", "Isa", "Kware",
          "Kebbe", "Rabah", "Sabon Birni", "Shagari", "Silame",
          "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza",
          "Tureta", "Wamako", "Wurno", "Yabo"
        ]
      }
    }
  },
  GH: {
    name: "Ghana",
    currency: "GHS",
    symbol: "₵",
    states: {
      AS: {
        name: "Ashanti",
        lgas: [
          "Kumasi Metropolitan", "Obuasi Municipal", "Asante Akim Central",
          "Asante Akim North", "Asante Akim South", "Bekwai Municipal",
          "Bosome Freho", "Bosomtwe", "Ejisu Municipal", "Ejura-Sekyedumase",
          "Juaben Municipal", "Kwabre East", "Mampong Municipal",
          "Sekyere Afram Plains", "Sekyere Central", "Sekyere East",
          "Sekyere Kumawu", "Sekyere South"
        ]
      },
      BA: {
        name: "Brong-Ahafo",
        lgas: [
          "Sunyani Municipal", "Berekum East", "Dormaa Central",
          "Kintampo North", "Nkoranza North", "Techiman Municipal",
          "Wenchi Municipal"
        ]
      },
      NO: {
        name: "Northern",
        lgas: [
          "Tamale Metropolitan", "Savelugu Municipal", "Tolon",
          "Kumbungu", "East Mamprusi", "West Mamprusi", "Mion",
          "Nanumba North", "Nanumba South", "Zabzugu"
        ]
      },
      EA: {
        name: "Eastern",
        lgas: [
          "New Juaben Municipal", "Koforidua", "Birim Central",
          "Fanteakwa North", "Kwahu West", "Lower Manya Krobo",
          "Upper Manya Krobo"
        ]
      },
      WE: {
        name: "Western",
        lgas: [
          "Sekondi-Takoradi Metropolitan", "Ahanta West", "Aowin",
          "Bia East", "Bia West", "Bibiani-Anhwiaso-Bekwai",
          "Effia-Kwesimintsim Municipal", "Ellembelle", "Jomoro",
          "Mpohor", "Nzema East Municipal", "Prestea-Huni Valley",
          "Shama", "Tarkwa-Nsuaem Municipal", "Wassa Amenfi Central"
        ]
      },
      VO: {
        name: "Volta",
        lgas: [
          "Ho Municipal", "Hohoe Municipal", "Keta Municipal",
          "Ketu North", "Ketu South", "Nkwanta North", "Nkwanta South"
        ]
      },
      CE: {
        name: "Central",
        lgas: [
          "Cape Coast Metropolitan", "Abura-Asebu-Kwamankese",
          "Agona East", "Agona West Municipal", "Ajumako-Enyan-Essiam",
          "Asikuma-Odoben-Brakwa", "Assin Central", "Assin North",
          "Assin South", "Awutu Senya East Municipal", "Effutu Municipal",
          "Ekumfi", "Gomoa Central", "Gomoa East", "Gomoa West",
          "Hemang Lower Denkyira", "Komenda-Edina-Eguafo-Abirem",
          "Mfantsiman Municipal", "Upper Denkyira East", "Upper Denkyira West"
        ]
      }
    }
  },
  KE: {
    name: "Kenya",
    currency: "KES",
    symbol: "KSh",
    states: {
      RV: {
        name: "Rift Valley",
        lgas: [
          "Uasin Gishu", "Trans Nzoia", "Nandi", "Kericho",
          "Bomet", "Nakuru", "Baringo", "Laikipia", "Samburu",
          "Turkana", "West Pokot", "Elgeyo-Marakwet", "Narok"
        ]
      },
      NY: {
        name: "Nyanza",
        lgas: [
          "Kisumu", "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira"
        ]
      },
      EA2: {
        name: "Eastern",
        lgas: [
          "Meru", "Embu", "Machakos", "Kitui", "Makueni",
          "Tharaka-Nithi", "Isiolo", "Marsabit"
        ]
      },
      CE2: {
        name: "Central",
        lgas: [
          "Kiambu", "Nyeri", "Kirinyaga", "Muranga", "Nyandarua"
        ]
      },
      CO: {
        name: "Coast",
        lgas: [
          "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta"
        ]
      },
      WE2: {
        name: "Western",
        lgas: [
          "Kakamega", "Vihiga", "Bungoma", "Busia"
        ]
      },
      NA2: {
        name: "Nairobi",
        lgas: [
          "Westlands", "Dagoretti North", "Dagoretti South", "Lang'ata",
          "Kibra", "Roysambu", "Kasarani", "Ruaraka", "Embakasi South",
          "Embakasi North", "Embakasi Central", "Embakasi East", "Embakasi West",
          "Makadara", "Kamukunji", "Starehe", "Mathare"
        ]
      }
    }
  },
  ET: {
    name: "Ethiopia",
    currency: "ETB",
    symbol: "Br",
    states: {
      OR: {
        name: "Oromia",
        lgas: [
          "Arsi", "Bale", "Borena", "East Hararghe", "East Shewa",
          "East Wellega", "Guji", "Horo Guduru Wellega", "Illubabor",
          "Jimma", "Kelam Wellega", "Kofele", "West Arsi",
          "West Hararghe", "West Shewa", "West Wellega"
        ]
      },
      AM: {
        name: "Amhara",
        lgas: [
          "Awi", "Central Gondar", "East Gojjam", "Himora",
          "North Gondar", "North Shewa", "North Wollo",
          "Oromia Special Zone", "South Gondar", "South Wollo",
          "Waghimra", "West Gojjam"
        ]
      },
      TI: {
        name: "Tigray",
        lgas: [
          "Central Tigray", "Eastern Tigray", "Mekelle",
          "North Western Tigray", "South Eastern Tigray",
          "Southern Tigray", "Western Tigray"
        ]
      },
      SN: {
        name: "SNNPR",
        lgas: [
          "Bench Sheko", "Dawro", "Gedeo", "Gamo", "Gofa",
          "Hadiya", "Kembata Tembaro", "Sidama", "Silte",
          "Wolayita", "Wolaita"
        ]
      }
    }
  },
  UG: {
    name: "Uganda",
    currency: "UGX",
    symbol: "USh",
    states: {
      CE3: {
        name: "Central",
        lgas: [
          "Kampala", "Wakiso", "Mukono", "Buikwe", "Kayunga",
          "Luwero", "Nakaseke", "Nakasongola", "Masaka", "Kalungu",
          "Bukomansimbi", "Lwengo"
        ]
      },
      EA3: {
        name: "Eastern",
        lgas: [
          "Jinja", "Kamuli", "Bugiri", "Mayuge", "Namayingo",
          "Butaleja", "Palisa", "Tororo", "Busia", "Manafwa",
          "Mbale", "Sironko", "Bulambuli", "Kween", "Kapchorwa"
        ]
      },
      NO3: {
        name: "Northern",
        lgas: [
          "Gulu", "Omoro", "Nwoya", "Amuru", "Kitgum",
          "Pader", "Agago", "Lamwo", "Lira", "Dokolo",
          "Alebtong", "Amolatar", "Apac", "Kole", "Oyam"
        ]
      },
      WE3: {
        name: "Western",
        lgas: [
          "Mbarara", "Rwampara", "Isingiro", "Kiruhura", "Ntungamo",
          "Kabale", "Rubanda", "Rukiga", "Kisoro", "Bundibugyo",
          "Kasese", "Kabarole", "Fort Portal", "Kamwenge"
        ]
      }
    }
  }
};

// Common African and international currencies
export const SUPPORTED_CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (₦)' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi (₵)' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling (KSh)' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr (Br)' },
  { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling (USh)' },
  { code: 'RWF', symbol: 'FRw', name: 'Rwandan Franc (FRw)' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling (TSh)' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand (R)' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
];

// Get all countries as array
export const getCountries = () =>
  Object.entries(AFRICA_GEO).map(([code, data]) => ({
    code,
    name: data.name,
    currency: data.currency,
    symbol: data.symbol
  }));

// Get states for a country
export const getStates = (countryCode) => {
  const country = AFRICA_GEO[countryCode];
  if (!country) return [];
  return Object.entries(country.states).map(([code, data]) => ({
    code,
    name: data.name
  }));
};

// Get LGAs for a state
export const getLGAs = (countryCode, stateCode) => {
  const country = AFRICA_GEO[countryCode];
  if (!country) return [];
  const state = country.states[stateCode];
  if (!state) return [];
  return state.lgas.map((lga) => ({ name: lga, value: lga }));
};

// Get country currency info
export const getCountryCurrency = (countryCode) => {
  const country = AFRICA_GEO[countryCode];
  if (!country) return { currency: "NGN", symbol: "₦" };
  return { currency: country.currency, symbol: country.symbol };
};

// Proximity scoring: higher = closer
export const getProximityScore = (equipment, userLocation) => {
  if (!userLocation) return 0;
  let score = 0;
  if (equipment.country === userLocation.country) score += 10;
  if (equipment.state === userLocation.state) score += 20;
  if (equipment.lga === userLocation.lga) score += 40;
  return score;
};

// Sort equipment by proximity to user
export const sortByProximity = (equipmentList, userLocation) => {
  if (!userLocation) return equipmentList;
  return [...equipmentList].sort(
    (a, b) => getProximityScore(b, userLocation) - getProximityScore(a, userLocation)
  );
};

export default AFRICA_GEO;
