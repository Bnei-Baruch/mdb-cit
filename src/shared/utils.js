export const formatDate = (d) => {
  const year  = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const day   = `0${d.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

export const today = () =>
  formatDate(new Date());

export const extractI18n = (i18ns, languages, fields) => {
  // Order i18ns by language
  const orderedI18ns = [];
  for (let i = 0; i < languages.length; i++) {
    const i18n = i18ns[languages[i]];
    if (i18n) {
      orderedI18ns.push(i18n);
    }
  }

  // Coalesce values per field
  return fields.map((x) => {
    let value;
    for (let i = 0; i < orderedI18ns.length; i++) {
      value = orderedI18ns[i][x];
      if (value) {
        break;
      }
    }
    return value;
  });
};

export const isActive = collection =>
  !Object.prototype.hasOwnProperty.call(collection.properties, 'active') || collection.properties.active;

export const findPath = (forest, uid) => {
  // Put trees in stack
  const s = [];
  for (let i = 0; i < forest.length; i++) {
    s.push(forest[i], Number.NaN);
  }

  // DFS forest to find path to requested node.
  // We simulate the recursive nature of such traversal with a marker for branching in.
  // This way we can eliminate the recursion and perform correct bookkeeping of the actual path.
  const path = [];
  while (s.length > 0) {
    const node = s.pop();
    if (Number.isNaN(node)) {  // is marker ?
      path.pop();
      continue; // eslint-disable-line no-continue
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
