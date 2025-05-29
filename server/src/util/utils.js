export const removeDuplicates = (doc, fields) => {
  fields.forEach((field) => {
    if (Array.isArray(doc[field])) {
      doc[field] = [...new Set(doc[field])];
    }
  });
};

export const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0));
export const endOfToday = () => new Date(new Date().setHours(23, 59, 59, 999));
