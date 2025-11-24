/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

