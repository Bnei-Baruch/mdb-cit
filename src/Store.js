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

export const fetchTVShows = (cb) => Fetcher('rest/collections/?content_type=VIDEO_PROGRAM&page_size=1000', data => {
    data.data.forEach(x => {
        let langOrder = ['he', 'en', 'ru'];
        if (!!x.properties.default_language) {
            langOrder.unshift(x.properties.default_language);
        }
        x['name'] = extractI18n(x['i18n'], langOrder, ['name'])[0];
    });
    cb(data.data);
});

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