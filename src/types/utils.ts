export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartialByAndOmit<T, K extends keyof T, O extends keyof T> = Omit<T, K | O> & Partial<Pick<T, K>>;
