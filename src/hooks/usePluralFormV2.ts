export const usePluralFormV2 = (count: number) => {
  const s = count === 1 ? '' : 's';

  return { s };
};
