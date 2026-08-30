/** Splits a raw stored module title ("MODULE 3.5 — Some Title" or "OPERATOR MODULE — Some Title")
 *  into a short numeral/eyebrow and a clean display title, so the UI never has to render the
 *  stored separator character directly. */
export function parseModuleTitle(raw: string): { num: string; cleanTitle: string } {
  const regular  = raw.match(/^MODULE\s+([\d.]+)\s*[—–:-]\s*(.+)$/);
  const operator = raw.match(/^OPERATOR MODULE\s*[—–:-]\s*(.+)$/);
  if (regular)  return { num: regular[1],  cleanTitle: regular[2].trim() };
  if (operator) return { num: "OPS",        cleanTitle: operator[1].trim() };
  return { num: "?", cleanTitle: raw };
}
