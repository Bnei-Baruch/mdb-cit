export const today = () => {
    const today = new Date();
    return today.getFullYear() + "-" +
        ("0" + (today.getMonth() + 1)).slice(-2) + "-" +
        ("0" + today.getDate()).slice(-2);
};

export const extractI18n = (i18ns, languages, fields) => {
    // Order i18ns by language
    let orderedI18ns = [];
    for (let i = 0; i < languages.length; i++) {
        const i18n = i18ns[languages[i]];
        if (!!i18n) {
            orderedI18ns.push(i18n);
        }
    }

    // Coalesce values per field
    return fields.map(x => {
        let value;
        for (let i = 0; i < orderedI18ns.length; i++) {
            value = orderedI18ns[i][x];
            if (!!value) {
                break;
            }
        }
        return value;
    })
};

export const isActive = (collection) => {
    return !collection.properties.hasOwnProperty("active") || collection.properties.active;
};

export const findPath = (forest, uid) => {

    // Put trees in stack
    let s = [];
    for (let i = 0; i < forest.length; i++) {
        s.push(forest[i], Number.NaN);
    }

    // DFS forest to find path to requested node.
    // We simulate the recursive nature of such traversal with a marker for branching in.
    // This way we can eliminate the recursion and perform correct bookkeeping of the actual path.
    let path = [];
    while (s.length > 0) {
        const node = s.pop();
        if (Number.isNaN(node)) {  // is marker ?
            path.pop();
            continue
        }

        path.push(node);
        s.push(Number.NaN);
        if (node.uid === uid) {
            return path;
        }

        const childs = node.children || [];
        for (let i = 0; i < childs.length; i++) {
            s.push(childs[i]);
        }
    }

    return [];
};
