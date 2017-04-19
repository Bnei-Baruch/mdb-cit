export const LANGUAGES = [
    {text: "עברית", value: "heb"},
    {text: "אנגלית", value: "eng"},
    {text: "רוסית", value: "rus"},
    {text: "ספרדית", value: "spa"},
    {text: "אוקראינית", value: "ukr"},
    {text: "איטלקית", value: "ita"},
    {text: "גרמנית", value: "ger"},
    {text: "הולנדית", value: "dut"},
    {text: "צרפתית", value: "FRE"},
    {text: "פורטוגזית", value: "por"},
    {text: "טורקית", value: "trk"},
    {text: "פולנית", value: "pol"},
    {text: "ערבית", value: "arb"},
    {text: "הונגרית", value: "hun"},
    {text: "פינית", value: "fin"},
    {text: "ליטאית", value: "lit"},
    {text: "יפנית", value: "jpn"},
    {text: "בולגרית", value: "bul"},
    {text: "גאורגית", value: "geo"},
    {text: "נורבגית", value: "nor"},
    {text: "שבדית", value: "swe"},
    {text: "קרואטית", value: "hrv"},
    {text: "סינית", value: "chn"},
    {text: "פרסית", value: "far"},
    {text: "רומנית", value: "ron"},
    {text: "הינדי", value: "hin"},
    {text: "מקדונית", value: "mkd"},
    {text: "סלובנית", value: "slv"},
    {text: "לטבית", value: "lav"},
    {text: "סלובקית", value: "slk"},
    {text: "צ'כית", value: "cze"},
];

export const MDB_LANGUAGES = {
    "en": "eng",
    "he": "heb",
    "ru": "rus",
    "es": "spa",
    "it": "ita",
    "de": "ger",
    "nl": "dut",
    "fr": "fre",
    "pt": "por",
    "tr": "trk",
    "pl": "pol",
    "ar": "arb",
    "hu": "hun",
    "fi": "fin",
    "lt": "lit",
    "ja": "jpn",
    "bg": "bul",
    "ka": "geo",
    "no": "nor",
    "sv": "swe",
    "hr": "hrv",
    "zh": "chn",
    "fa": "far",
    "ro": "ron",
    "hi": "hin",
    "mk": "mkd",
    "sl": "slv",
    "lv": "lav",
    "sk": "slk",
    "cs": "cze",
    "ua": "ukr",
    "zz": "mlt",
    "xx": "unk",
};

export const LECTURERS = [
    {text: "רב", value: "rav"},
    {text: "בלי רב", value: "norav"},
];

export const COLLECTION_TYPES = {
    "LESSON_PART": "DAILY_LESSON",
    "FULL_LESSON": "DAILY_LESSON",
    "VIDEO_PROGRAM_CHAPTER": "VIDEO_PROGRAM",
    "FRIENDS_GATHERING": "WEEKLY_FRIENDS_GATHERING",
    "MEAL": "MEALS",
    "LECTURE": "LECTURE_SERIES",
    "CHILDREN_LESSON_PART": "LECTURE_SERIES",
    "WOMEN_LESSON_PART": "LECTURE_SERIES",
    "CAMPUS_LESSON": "LECTURE_SERIES",
    "LC_LESSON": "LECTURE_SERIES",
    "VIRTUAL_LESSON": "LECTURE_SERIES",
};

// Collection Types
export const CT_DAILY_LESSON = "DAILY_LESSON";
export const CT_SATURDAY_LESSON = "SATURDAY_LESSON";
export const CT_WEEKLY_FRIENDS_GATHERING = "WEEKLY_FRIENDS_GATHERING";
export const CT_CONGRESS = "CONGRESS";
export const CT_VIDEO_PROGRAM = "VIDEO_PROGRAM";
export const CT_LECTURE_SERIES = "LECTURE_SERIES";
export const CT_MEALS = "MEALS";
export const CT_HOLIDAY = "HOLIDAY";
export const CT_PICNIC = "PICNIC";
export const CT_UNITY_DAY = "UNITY_DAY";

// Content Unit Types
export const CT_LESSON_PART = "LESSON_PART";
export const CT_LECTURE = "LECTURE";
export const CT_CHILDREN_LESSON_PART = "CHILDREN_LESSON_PART";
export const CT_WOMEN_LESSON_PART = "WOMEN_LESSON_PART";
export const CT_CAMPUS_LESSON = "CAMPUS_LESSON";
export const CT_LC_LESSON = "LC_LESSON";
export const CT_VIRTUAL_LESSON = "VIRTUAL_LESSON";
export const CT_FRIENDS_GATHERING = "FRIENDS_GATHERING";
export const CT_MEAL = "MEAL";
export const CT_VIDEO_PROGRAM_CHAPTER = "VIDEO_PROGRAM_CHAPTER";
export const CT_FULL_LESSON = "FULL_LESSON";
export const CT_TEXT = "TEXT";

export const CONTENT_TYPE_IDS = {
    "DAILY_LESSON": 1,
    "SHABBAT_LESSON": 2,
    "WEEKLY_YH": 3,
    "CONGRESS": 4,
    "VIDEO_PROGRAM": 5,
    "LECTURE_SERIES": 6,
    "MEALS": 7,
    "HOLIDAY": 8,
    "PIKNIK": 9,
    "UNITY_DAY": 10,
    "LESSON_PART": 11,
    "LECTURE": 12,
    "CHILDREN_LESSON_PART": 13,
    "WOMEN_LESSON_PART": 14,
    "CAMPUS_LESSON": 15,
    "LC_LESSON": 16,
    "VIRTUAL_LESSON": 17,
    "YESHIVAT_HAVERIM": 18,
    "MEAL": 19,
    "VIDEO_PROGRAM_CHAPTER": 20,
    "FULL_LESSON": 21,
    "TEXT": 22,
    "SATURDAY_LESSON": 23,
    "WEEKLY_FRIENDS_GATHERING": 24,
    "PICNIC": 25,
    "FRIENDS_GATHERING": 26,
    "UNKNOWN": 27,
};