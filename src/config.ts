export * from './theme';

export const config = {
  current_schema_version: 4,
};

export const CURRENT_SCHEMA_VERSION = config.current_schema_version;
// @ts-ignore
export const DEFAULT_API_ORIGIN = process.env.EXPO_PUBLIC_API_ORIGIN || '';

export default config;
