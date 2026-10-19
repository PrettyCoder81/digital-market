// Product type matching the Solidity contract's Product struct
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // wei (uint256)
  imageURI: string;
  owner: string; // address
  listed: boolean;
  createdAt: number; // unix timestamp
}

export interface CreateProductData {
  name: string;
  description: string;
  price: string; // in TONY (will be converted to wei)
  image: File;
}

export interface TransactionData {
  to: string;
  data: string;
  value?: string;
  gasLimit?: string;
  gasPrice?: string;
  nonce?: number;
  chainId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AdminStats {
  totalProducts: number;
  totalSales: number;
  accruedPlatformFees: string; // wei
  listingFee: string; // wei
  platformFeeBps: number; // basis points
}

// Contract configuration
export const CONTRACT_CONFIG = {
  FEE_DENOMINATOR: 10000,
  MAX_FEE_BPS: 10000,
  DEFAULT_PLATFORM_FEE_BPS: 500, // 5%
  DEFAULT_LISTING_FEE: '10000000000000000000', // 10 * 10^18 (10 TONY)
  TOKEN_DECIMALS: 18,
};
