/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_TOKEN_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
