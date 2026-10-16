export interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // in ETH
  image: string;
  category: string;
  owner: string;
  isForSale: boolean;
  ipfsHash?: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  productId: string;
  from: string;
  to: string;
  price: string;
  type: 'purchase' | 'transfer' | 'listing';
  timestamp: number;
}

export interface MarketplaceState {
  products: Product[];
  transactions: Transaction[];
  platformFee: number;
  contractBalance: string;
  owner: string;
  connectedAccount: string | null;
  isConnected: boolean;
}
