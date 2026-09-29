// Lower case and without accents, so "xiaomi" finds "Xiaomí".
function normalize(text) {
  return String(text ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

// Every word of the query must appear in brand + model, in any order: "samsung s21" narrows,
// "samsung iphone" finds nothing.
export function filterProducts(products, query) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return products;
  return products.filter((product) => {
    const haystack = normalize(`${product.brand ?? ''} ${product.model ?? ''}`);
    return terms.every((term) => haystack.includes(term));
  });
}
