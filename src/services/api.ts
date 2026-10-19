import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Product endpoints
export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
};

// IPFS endpoints
export const ipfsApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/ipfs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Blockchain endpoints
export const blockchainApi = {
  // Read methods
  getNextProductId: () => api.get('/blockchain/next-product-id'),
  getProduct: (id: number) => api.get(`/blockchain/product/${id}`),
  getAllProducts: () => api.get('/blockchain/products'),
  getListingFee: () => api.get('/blockchain/listing-fee'),
  getPlatformFeeBps: () => api.get('/blockchain/platform-fee-bps'),
  getAccruedFees: () => api.get('/blockchain/accrued-fees'),

  /**
   * Transaction data builders (for frontend signing).
   * 
   * ERC20 APPROVE FLOW:
   * Before createProduct or buyProduct, the user must approve the marketplace
   * contract to spend TonysCoin on their behalf.
   * 
   * For createProduct: approve(listingFee)
   * For buyProduct: approve(product.price)
   */
  getApproveData: (amount: string, spender: string) =>
    api.post('/blockchain/approve-data', { amount, spender }),

  // Create product (requires prior approve of listingFee)
  getCreateProductData: (name: string, description: string, price: string, imageURI: string) =>
    api.post('/blockchain/create-product-data', { name, description, price, imageURI }),

  // Buy product (requires prior approve of product.price)
  getBuyProductData: (productId: number) =>
    api.post('/blockchain/buy-product-data', { productId }),

  // Transfer ownership (no approve needed, just owner signature)
  getTransferData: (productId: number, newOwner: string) =>
    api.post('/blockchain/transfer-data', { productId, newOwner }),

  // Set listing status (owner only, no approve needed)
  getSetListingData: (productId: number, isListed: boolean) =>
    api.post('/blockchain/set-listing-data', { productId, isListed }),

  // Update product (owner only, no approve needed)
  getUpdateProductData: (productId: number, name: string, description: string, price: string, imageURI: string) =>
    api.post('/blockchain/update-product-data', { productId, name, description, price, imageURI }),

  // Broadcast a signed transaction to the network
  broadcastTransaction: (signedTx: string) =>
    api.post('/blockchain/broadcast', { signedTransaction: signedTx }),

  // Admin endpoints (backend signs with ADMIN_PRIVATE_KEY)
  setListingFee: (newFee: string) =>
    api.post('/admin/set-listing-fee', { newFee }),
  setPlatformFee: (newFeeBps: number) =>
    api.post('/admin/set-platform-fee', { newFeeBps }),
  /**
   * withdrawPlatformFees(address recipient, uint256 amount)
   * Backend admin signs this directly.
   */
  withdrawFees: (recipient: string, amount: string) =>
    api.post('/admin/withdraw', { recipient, amount }),
  getStats: () => api.get('/admin/stats'),
};

export default api;
