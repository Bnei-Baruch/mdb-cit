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

export const ARTIFACT_TYPES = [
    {text: "תוכן מרכזי", value: "main"},
    {text: "קטעי מקור", value: "kitei_makor"},
];

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
export const CT_EVENT_PART = "EVENT_PART";
export const CT_FULL_LESSON = "FULL_LESSON";
export const CT_TEXT = "TEXT";

export const CT_UNKNOWN = "UNKNOWN";

export const CONTENT_TYPE_BY_ID = {
    1: CT_DAILY_LESSON,
    2: CT_SATURDAY_LESSON,
    3: CT_WEEKLY_FRIENDS_GATHERING,
    4: CT_CONGRESS,
    5: CT_VIDEO_PROGRAM,
    6: CT_LECTURE_SERIES,
    7: CT_MEALS,
    8: CT_HOLIDAY,
    9: CT_PICNIC,
    10: CT_UNITY_DAY,
    11: CT_LESSON_PART,
    12: CT_LECTURE,
    13: CT_CHILDREN_LESSON_PART,
    14: CT_WOMEN_LESSON_PART,
    15: CT_CAMPUS_LESSON,
    16: CT_LC_LESSON,
    17: CT_VIRTUAL_LESSON,
    18: CT_FRIENDS_GATHERING,
    19: CT_MEAL,
    20: CT_VIDEO_PROGRAM_CHAPTER,
    21: CT_FULL_LESSON,
    22: CT_TEXT,
    23: CT_SATURDAY_LESSON,
    24: CT_WEEKLY_FRIENDS_GATHERING,
    25: CT_PICNIC,
    26: CT_FRIENDS_GATHERING,
    27: CT_UNKNOWN,
};

export const COLLECTION_TYPES = {
    [CT_LESSON_PART]: CT_DAILY_LESSON,
    [CT_FULL_LESSON]: CT_DAILY_LESSON,
    [CT_VIDEO_PROGRAM_CHAPTER]: CT_VIDEO_PROGRAM,
    [CT_FRIENDS_GATHERING]: CT_WEEKLY_FRIENDS_GATHERING,
    [CT_MEAL]: CT_MEALS,
    [CT_LECTURE]: CT_LECTURE_SERIES,
    [CT_CHILDREN_LESSON_PART]: CT_LECTURE_SERIES,
    [CT_WOMEN_LESSON_PART]: CT_LECTURE_SERIES,
    [CT_CAMPUS_LESSON]: CT_LECTURE_SERIES,
    [CT_LC_LESSON]: CT_LECTURE_SERIES,
    [CT_VIRTUAL_LESSON]: CT_LECTURE_SERIES,
};

export const EVENT_CONTENT_TYPES = [CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY];
