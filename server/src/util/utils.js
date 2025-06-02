export const removeDuplicates = (doc, fields) => {
  fields.forEach((field) => {
    if (Array.isArray(doc[field])) {
      doc[field] = [...new Set(doc[field])];
    }
  });
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0));
export const endOfToday = () => new Date(new Date().setHours(23, 59, 59, 999));

/**
 *
 * This is used to  escape special characters in user input
 * before using it in a regular expression.
 * This prevents regex injection and ensures that the input is treated
 * as plain text, not as a regex pattern.
 */
export const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
