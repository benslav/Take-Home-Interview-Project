const HTML_ENTITIES = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: "\u00a0",
  quot: '"',
};

export function decodeHtmlEntities(value) {
  return String(value).replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (entity, code) => {
    if (code[0] !== "#") {
      return HTML_ENTITIES[code.toLowerCase()] ?? entity;
    }

    const radix = code[1].toLowerCase() === "x" ? 16 : 10;
    const offset = radix === 16 ? 2 : 1;
    const codePoint = Number.parseInt(code.slice(offset), radix);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
      return entity;
    }
    return String.fromCodePoint(codePoint);
  });
}
