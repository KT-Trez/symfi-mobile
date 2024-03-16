export * from './theme';

export const config = {
  current_schema_version: 5,
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const DEFAULT_API_ORIGIN = process.env.EXPO_PUBLIC_API_ORIGIN || 'https://symfi-api.was.org.pl';
export const SCHEMA_VERSION = config.current_schema_version;

export default config;
