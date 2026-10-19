/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_TOKEN_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// MetaMask / Ethereum Provider types
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

interface Window {
  ethereum?: EthereumProvider;
}
