export function count(value) {
  if (!value) throw new Error('Value is undefuned or null');
  if (!Array.isArray(value)) throw new Error('It is not array');
  return value.length;
}
