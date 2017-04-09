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

export const findPath = (forest, uid) => {

    // put trees in stack
    let s = [];
    for (let i = 0; i < forest.length; i++) {
        s.push([[i], forest[i]]);
    }

    // DFS forest to get path to requested node
    let finalPath;
    while (s.length > 0 && !finalPath) {
        const n = s.pop(),
            path = n[0],
            node = n[1];

        if (node.uid === uid) {
            finalPath = path;
            break;
        }

        const childs = node.children || node.sources || [];
        for (let i = 0; i < childs.length; i++) {
            s.push([path.concat([i]), childs[i]]);
        }
    }

    // reconstruct real nodes from indexes
    let path = [];
    if (finalPath) {
        let level = forest;
        for (let i = 0; i < finalPath.length; i++) {
            const idx = finalPath[i],
                node = level[idx];
            path.push(node);
            level = node.children || node.sources;
        }
    }

    return path;
};