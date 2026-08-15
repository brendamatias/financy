/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_GRAPHQL_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
