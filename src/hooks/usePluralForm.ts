/**
 * Returns `s` if objects count not equal to 1.
 * @example const s = usePluralForm(2);
 * @param count - number of objects
 * @returns `s` if count !== 1
 */
export const usePluralFormV3 = (count: number) => {
  return count === 1 ? '' : 's';
};
