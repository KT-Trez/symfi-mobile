/**
 * Returns `s` if objects count not equal to 1.
 * @param objectsCount - number of objects
 * @returns `s` if objectsCount !== 1
 * @deprecated
 */
function usePluralForm(objectsCount: number) {
  return objectsCount !== 1 ? 's' : '';
}

/**
 * Returns `s` if objects count not equal to 1.
 * @example const { s } = usePluralForm(2);
 * @param count - number of objects
 * @returns `s` if count !== 1
 */
export const usePluralFormV2 = (count: number) => {
  const s = count === 1 ? '' : 's';

  return { s };
};

export default usePluralForm;
