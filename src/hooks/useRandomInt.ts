export default function useRandomInt(min: number, max: number, inclusive?: boolean) {
  min = Math.ceil(min);
  max = Math.floor(max);
  if (inclusive) return Math.floor(Math.random() * (max - min + 1) + min);
  else return Math.floor(Math.random() * (max - min) + min);
}
