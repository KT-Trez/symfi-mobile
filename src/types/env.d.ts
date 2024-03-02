// noinspection JSUnusedGlobalSymbols

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;

      EXPO_PUBLIC_DEVELOPMENT: string;
    }
  }
}
