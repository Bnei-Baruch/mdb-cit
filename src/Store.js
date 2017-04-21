import {extractI18n} from "./utils";

const API_BACKEND = process.env.NODE_ENV !== 'production' ?
    process.env.REACT_APP_MDB_URL :
    'http://app.mdb.bbdomain.org/';

const Fetcher = (path, cb) => fetch(`${API_BACKEND}${path}`)
    .then(response => {
        if (response.ok) {
            return response.json().then(data => cb(data));
        }
        throw new Error('Network response was not ok.');
    })
    .catch(ex => console.log(`get ${path}`, ex));

export const fetchSources = (cb) => Fetcher('hierarchy/sources/', cb);

export const fetchTags = (cb) => Fetcher('hierarchy/tags/', cb);

export const fetchCollections = (cb) => {
    const contentTypes = ['VIDEO_PROGRAM', 'CONGRESS'].map(x => `content_type=${x}`).join("&");
    return Fetcher('rest/collections/?page_size=1000&' + contentTypes, data => {
        let byType = {};
        data.data.forEach(x => {
            let langOrder = ['he', 'en', 'ru'];
            if (!!x.properties.default_language) {
                langOrder.unshift(x.properties.default_language);
            }
            x['name'] = extractI18n(x['i18n'], langOrder, ['name'])[0];
            if (!byType.hasOwnProperty(x.type_id)) {
                byType[x.type_id] = [];
            }
                byType[x.type_id].push(x);
        });

        byType[4] = [
            {
                uid: '12345678',
                type_id: 4,
                name: 'כנס קייב 2017',
                properties: {
                    active: false,
                    pattern: "congress-kiev-2017",
                }
            },
            {
                uid: '12345679',
                type_id: 4,
                name: 'כנס צילה 2017',
                properties: {
                    active: true,
                    pattern: "congress-chile-2017",
                }
            },
            {
                uid: '12345677',
                type_id: 4,
                name: 'כנס ברזיל 2017',
                properties: {
                    active: true,
                    pattern: "congress-brazil-2017",
                }
            },
            {
                uid: '12345676',
                type_id: 4,
                name: 'כנס מקסיקו 2017',
                properties: {
                    active: true,
                    pattern: "congress-mexico-2017",
                }
            },
        ];
        byType[8] = [
            {
                uid: '12345671',
                type_id: 8,
                name: 'פסח 2017',
                properties: {
                    active: false,
                    pattern: "holidays-pesach-2017",
                }
            },
            {
                uid: '12345672',
                type_id: 8,
                name: 'יום העצמאות 2017',
                properties: {
                    active: true,
                    pattern: "holidays-yom-atzamut-2017",
                }
            },
        ];
        cb(byType);
    });
};

export const activateCollection = (id, cb) => {
    fetch(`${API_BACKEND}rest/collections/${id}/activate`, {method:"POST"})
        .then(response => {
            if (response.ok) {
                return response.json().then(data => cb(data));
            }
            throw new Error('Network response was not ok.');
        })
        .catch(ex => console.log("activate collection", id, ex));
};