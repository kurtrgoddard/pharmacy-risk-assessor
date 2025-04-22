
export const scrubMedisca = (obj: any) =>
  typeof obj === "string"
    ? obj.replace(/medisca/gi, "")
    : Array.isArray(obj)
      ? obj.map(scrubMedisca)
      : (Object.keys(obj||{}).forEach(k => obj[k] = scrubMedisca(obj[k])), obj);
