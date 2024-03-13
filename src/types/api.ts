export type ApiError = {
  http_code: number;
  message: string;
  reason: string;
};

export type CollectionFormat<T> = {
  has_more: boolean;
  objects: T[];
  page: number;
};
