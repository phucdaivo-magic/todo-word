function normalizeContentfulData(response) {
  const { items = [], includes = {} } = response;

  // 1. Map Entry & Asset theo id
  const entryMap = {};
  const assetMap = {};

  items.forEach((item) => {
    entryMap[item.sys.id] = item;
  });

  (includes.Asset || []).forEach((asset) => {
    assetMap[asset.sys.id] = asset;
  });

  // 2. Resolve Link
  function resolveLink(value) {
    // Array
    if (Array.isArray(value)) {
      return value.map(resolveLink);
    }

    // Object
    if (value && typeof value === "object") {
      // Link Entry
      if (value.sys?.type === "Link" && value.sys.linkType === "Entry") {
        const entry = entryMap[value.sys.id];
        return entry ? resolveEntry(entry) : null;
      }

      // Link Asset
      if (value.sys?.type === "Link" && value.sys.linkType === "Asset") {
        return assetMap[value.sys.id] || null;
      }

      // Object thường
      const result = {};
      for (const key in value) {
        result[key] = resolveLink(value[key]);
      }
      return result;
    }

    return value;
  }

  // 3. Resolve Entry
  function resolveEntry(entry) {
    return {
      id: entry.sys.id,
      type: entry.sys.contentType.sys.id,
      ...resolveLink(entry.fields),
    };
  }

  // 4. Group theo contentType
  const result = {};

  items.forEach((item) => {
    const type = item.sys.contentType.sys.id;
    const resolved = resolveEntry(item);

    if (!result[type]) {
      result[type] = [];
    }
    result[type].push(resolved);
  });

  return result;
}

export default normalizeContentfulData;
