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