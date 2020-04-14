function trimObjValues(obj) {
  return Object.keys(obj).reduce((acc, curr) => {
    if (curr !== "subcategories") {
      acc[curr] = obj[curr].trim();
    }
    return acc;
  }, {});
}

export { trimObjValues }