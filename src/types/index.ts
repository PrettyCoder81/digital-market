export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageURI: string;
  owner: string;
  isListed: boolean;
  seller: string;
  createdAt?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: string;
  image: File;
}

export interface TransactionData {
  to: string;
  data: string;
  value?: string;
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
  platformFeesAccrued: string;
  listingFee: string;
  platformFeePercent: number;
}
