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

export const fetchSources = (cb) => Fetcher('sources/hierarchy', cb);
export const fetchTags = (cb) => Fetcher('tags/hierarchy', cb);