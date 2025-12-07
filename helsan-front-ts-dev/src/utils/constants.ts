import i18n from "@/i18n";
export const nationalIdRegex = /^[0-9]{10}$/;
export const phoneRegex = /^09[0-9]{9}$/;
export const numberRegex = /^[0-9]+$/;
export const insurance = [
  i18n.t("mosalah"),
  i18n.t("bimeTaamin"),
  i18n.t("salamatInsu"),
  i18n.t("khadamatDarmani"),
];
export const drugTypes = [
  {
    label: i18n.t("ghors"),
    value: "0",
  },
  {
    label: i18n.t("sharbat"),
    value: "1",
  },
  {
    label: i18n.t("ampul"),
    value: "2",
  },
];
export const prescPeriodRepeat = [
  {
    nameFA: i18n.t("everyday"),
    nameEN: "everyday",
    id: "0",
  },
  {
    nameFA: i18n.t("threedayinweek"),
    nameEN: "threedayinweek",
    id: "1",
  },
  {
    nameFA: i18n.t("everyweek"),
    nameEN: "everyweek",
    id: "2",
  },
  {
    nameFA: i18n.t("everytwoweeks"),
    nameEN: "everytwoweeks",
    id: "3",
  },
  {
    nameFA: i18n.t("everymonth"),
    nameEN: "everymonth",
    id: "4",
  },
  {
    nameFA: i18n.t("everythreemonth"),
    nameEN: "everythreemonth",
    id: "5",
  },
  {
    nameFA: i18n.t("everysixmonth"),
    nameEN: "everysixmonth",
    id: "6",
  },
];
export const healthServices = [
  {
    title: i18n.t("bakhshhayeDarmani"),
    key: "1",
    items: [
      i18n.t("counselingcenter"),
      i18n.t("dentistry"),
      i18n.t("cheshm"),
      i18n.t("dakheli"),
    ],
  },
  {
    title: i18n.t("bakhBastari"),
    key: "2",
    items: ["VIP", i18n.t("khoun")],
  },
  {
    title: i18n.t("tasvirBardari"),
    key: "3",
    items: [
      i18n.t("laboratory"),
      i18n.t("radio"),
      i18n.t("sono"),
      i18n.t("sonoRangi"),
    ],
  },
  {
    title: i18n.t("moraghebathayeVizhe"),
    key: "4",
    items: ["ICU", "NICU", "CCU"],
  },
  {
    title: i18n.t("ambulance"),
    key: "5",
    // items:[''],
  },
  {
    title: i18n.t("drugstore"),
    key: "6",
    // items:[''],
  },
];
export const dataNames = {
  hormonalProblems: i18n.t("HormoneProblem"),
  smoker: i18n.t("Smoker"),
  liverProblems: i18n.t("LiverProblem"),
  kidneyProblems: i18n.t("KidneyProblem"),
  heartProblems: i18n.t("HeartProblem"),
  thyroidProblems: i18n.t("ThyroidProblem"),
  presenceOfMetalInBody: i18n.t("PresenceOfMetalInBody"),
  artificialOrgans: i18n.t("ArtificialOrgans"),
  pregnant: i18n.t("Pregnant"),
  breastfeeding: i18n.t("breastfeeding"),
  cancer: i18n.t("cancer"),
  diabetes: i18n.t("diabetes"),
  gallstones: i18n.t("gallstones"),
  hepatitisB: i18n.t("hepatitisB"),
  hepatitisC: i18n.t("hepatitisC"),
  hypertension: i18n.t("hypertension"),
  ms: i18n.t("ms"),
  rheumaticDiseases: i18n.t("rheumaticDiseases"),
};

export const vaccinationType = [
  i18n.t("panjgane"),
  i18n.t("segane"),
  i18n.t("dogane"),
  i18n.t("doganeBozorgsal"),
  i18n.t("kozaz"),
  i18n.t("btzh"),
  "MMR",
  i18n.t("falajAtfal"),
  i18n.t("hepatitB"),
  i18n.t("anfolanza"),
  i18n.t("Corona"),
];
export const inheritanceDiseases = [
  i18n.t("feshareBala"),
  i18n.t("diabet"),
  i18n.t("saratan"),
  i18n.t("talasemi"),
  i18n.t("khodImeni"),
  i18n.t("chaghi"),
  i18n.t("alzaymer"),
  i18n.t("atroz"),
  i18n.t("kist"),
  i18n.t("else"),
];
export const bloodGroup = [
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  i18n.t("namoshakhas"),
];
export const Rh = [i18n.t("mosbat"), i18n.t("manfi")];

export const days = [
  { value: "6", label: i18n.t("weekDays.shanbe") },
  { value: "0", label: i18n.t("weekDays.yekshanbe") },
  { value: "1", label: i18n.t("weekDays.doshanbe") },
  { value: "2", label: i18n.t("weekDays.seshanbe") },
  { value: "3", label: i18n.t("weekDays.chaharshanbe") },
  { value: "4", label: i18n.t("weekDays.panjshanbe") },
  { value: "5", label: i18n.t("weekDays.jome") },
];

export const genders = [i18n.t("clinicDrDetailsPage.value2"), i18n.t("female")];
export const maritalStatus = [
  i18n.t("mojarad"),
  i18n.t("married"),
  i18n.t("talagh"),
  i18n.t("fotShode"),
  i18n.t("namoshakhas"),
];

export const requestList = {
  newSecretary: i18n.t("newRec"),
  changeAccessLevel: i18n.t("DastresiMonshi"),
  other: i18n.t("else"),
};
export const titleOfRequestsForSecretary = [
  {
    id: 1,
    name: requestList.newSecretary,
    orginalName: requestList.newSecretary,
  },
  {
    id: 2,
    name: requestList.changeAccessLevel,
    orginalName: requestList.changeAccessLevel,
  },
  { id: 3, name: requestList.other, orginalName: requestList.other },
];

export const titleOfRequestsForDoctor = [{ id: 3, name: i18n.t("else") }];

export const insuranceTypes = [i18n.t("ejbari"), i18n.t("ekhtiari")];

export const nezamLetters = [
  { value: "آ" },
  { value: "ا-پ" },
  { value: "ات" },
  { value: "ب" },
  { value: "ت" },
  { value: "د" },
  { value: "ش" },
  { value: "ع-آ" },
  { value: "ف" },
  { value: "ک" },
  { value: "ک-د" },
  { value: "گ" },
  { value: "م" },
  { value: "ن" },
  { value: "-" },
];
export const documentTypes = [
  i18n.t("parvande"),
  i18n.t("radio"),
  i18n.t("ctscan"),
  i18n.t("mri"),
  i18n.t("azmayeshgahi"),
  i18n.t("sono"),
  i18n.t("floroscopy"),
  i18n.t("mamoGraphy"),
  i18n.t("tasvirbardari"),
];
export const documentsFormats = ["DOC", "DOCX", "PDF", "JPEG", "PNG", "JPG"];
export const insurances = {
  taminEjtemaie: i18n.t("insurances.taminInsurances"),
  salamat: i18n.t("insurances.salamatinsurances"),
  sakhad: i18n.t("insurances.sakhadinsurances"),
  free: i18n.t("azad"),
};
export const insurancesEn = {
  taminEjtemaie: "taminEjtemaie",
  salamat: "salamat",
  sakhad: "sakhad",
  free: "free",
};
export const TypesOfInsurances = [
  i18n.t("insurances.taminInsurances"),
  i18n.t("insurances.salamatinsurances"),
  i18n.t("insurances.sakhadinsurances"),
  i18n.t("azad"),
];
export const TypesOfInsurancesWithValue = [
  { value: "taminEjtemaie", label: i18n.t("insurances.taminInsurances") },
  { value: "salamat", label: i18n.t("insurances.salamatinsurances") },
  { value: "sakhad", label: i18n.t("insurances.sakhadinsurances") },
  { value: "free", label: i18n.t("azad") },
];
export const TypesOfInsurancesWithDifferentValues = [
  { value: "taminEjtemaie", label: i18n.t("bimeTaamin") },
  { value: "salamat", label: i18n.t("salamatInsu") },
  { value: "sakhad", label: i18n.t("bime") },
  { value: "free", label: i18n.t("faghedBime") },
];
export const severitydisease = [
  i18n.t("khafif"),
  i18n.t("motevaset"),
  i18n.t("shadid"),
  i18n.t("kheiliShadid"),
];
export const rolesList = {
  doctor: "Doctor",
  customer: "Citizen",
  healthcareCompany: "healthcareCompany",
  healthcareProviders: "healthcareProviders",
  nurse: "nurse",
  physiotherapist: "physiotherapist",
  // pharmacyadmin: 'pharmacyadmin',
  paraclinicadmin: "paraclinicadmin",
  psychologist: "psychologist",
  receptionist: "receptionist",
  admin: "admin",
  clinicAdmin: "clinicAdmin",
};
export const rolesListFa: { [key: string]: string } = {
  Doctor: i18n.t("roles.Doctor"),
  Citizen: i18n.t("roles.Citizen"),
  Psychologist: i18n.t("roles.Psychologist"),
};
export const allRoles = [
  { key: "admin", label: i18n.t("roles.admin") },
  { key: "customer", label: i18n.t("roles.customer") },
  { key: "nurse", label: i18n.t("roles.nurse") },
  { key: "receptionist", label: i18n.t("roles.receptionist") },
  { key: "doctor", label: i18n.t("roles.doctor") },
  { key: "clinicAdmin", label: i18n.t("roles.clinicAdmin") },
  { key: "paraclinicadmin", label: i18n.t("roles.paraclinicAdmin") },
  { key: "other", label: i18n.t("roles.other") },
];
export const searchBaseList = [
  { value: "GTIN", label: i18n.t("GTIN") },
  { value: "ERX", label: i18n.t("ERX") },
  { value: "name", label: i18n.t("drugENgName") },
  { value: "IRC", label: i18n.t("IRC") },
  // { value: 'brand', label: i18n.t('drugBrand') },
];
export const searchBaseBulkList = [
  { value: "GTIN", label: i18n.t("GTIN") },
  // { value: 'ERX', label: i18n.t('ERX') },
  // { value: 'name', label: i18n.t('drugENgName') },
  { value: "IRC", label: i18n.t("IRC") },
  // { value: 'brand', label: i18n.t('drugBrand') },
];
export const sakhadSearchBaseList = [
  { value: "ERX", label: i18n.t("ERX") },
  { value: "name", label: i18n.t("drugENgName") },
];
export const serviceSearchBaseList = [
  { value: "name", label: i18n.t("servName") },
  { value: "srvCode", label: i18n.t("srvCode") },
  // { value: 'srvCode', label: i18n.t('srv') },
  // { value: 'RVU', label: i18n.t('rvu') },
];
export const clinicColors = [
  "#ff99c8",
  "#a6e1fa",
  "#fed9b7",
  "#c8b8db",
  "#a3cef1",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
];

export const paraColors = [
  "#FFCCCB", // Light Red
  "#b185db", // purple
  "#FFFACD", // Lemon Chiffon
  "#EEDDFF", // Light Lavender
  "#BFEFFF", // Baby Blue
  "#FFDB4D", // Mustard Yellow
  "#4D88FF", // Soft Blue
  "#CCCC99", // Olive Green
  "#CCFFCC", // Light Mint
  "#FF6666", // Soft Red
  "#CCFF99", // Pale Lime Green
  "#CCCC4D", // Khaki
  "#FFCCCC", // Pink Lace
  "#99CCFF", // Sky Blue
  "#CCFF66", // Yellow Green
  "#FF99CC", // Pink
  "#FFFF66", // Laser Lemon
  "#FF5050", // Coral Red
  "#FF704D", // Salmon Red
  "#66FFCC", // Aqua Marine
];
export const sectionsColors = [
  "#d4b483", // Light Pink
  "#6290c8", // Pale Green
  "#FFF3CD", // Light Yellow
  "#D1ECF1", // Soft Cyan
  "#FEEFC3", // Pale Gold
  "#FFD4D4", // Light Coral
  "#ADD8E6", // Light Blue
  "#FAFAD2", // Light Goldenrod
  "#E2F0D9", // Very Pale Green
  "#FFB6C1", // Light Pink
  "#E6E6FA", // Lavender
  "#FAEBD7", // Antique White
  "#FFE4E1", // Misty Rose
  "#D3D3D3", // Light Grey
  "#FFEFD5", // Papaya Whip
  "#FFF0F5", // Lavender Blush
  "#FFF5EE", // Sea Shell
  "#FFE4C4", // Bisque
  "#F0FFF0", // Honeydew
  "#FFFACD", // Lemon Chiffon
];
// export const privileges = {
//     places_priv: 'مراکز درمانی',
//     appointmentTimeTable_priv: 'تقویم نوبت دهی پزشک',
//     edit_emr_priv: 'ویزیت بیمار',
//     prescList_priv: 'فهرست نسخه های صادر شده',
//     appointmentList_priv: 'فهرست نوبت های بیماران',
//     repetitivePresc_priv: 'نسخه های پرتکرار',

//     delete_AllAppointment_priv: 'حذف تمام نوبت ها',
//     create_setAppointment_priv: 'ثبت تقویم نوبت دهی',

//     edit_places_priv: 'ویرایش مرکز درمانی',
//     delete_places_priv: 'حذف مرکز درمانی',
//     edit_defaultPlaces_priv: 'ویرایش مرکز درمانی پیش فرض',
//     create_places_priv: 'ثبت مرکز درمانی جدید',

//     edit_freeAppointment_priv: 'آزادسازی نوبت بیمار',
//     edit_ChangeAppointment_priv: 'جابه جایی نوبت بیمار',
//     delete_OneAppointment_priv: 'حذف نوبت پزشک',
//     create_reserveAppointment_priv: 'رزرو نوبت برای بیمار',

//     edit_repetitivePresc_priv: 'ویرایش نسخه های پر تکرار',
//     delete_repetitivePresc_priv: 'حذف نسخه های پر تکرار',
//     create_repetitivePresc_priv: 'ایجاد نسخه های پر تکرار',
// };
