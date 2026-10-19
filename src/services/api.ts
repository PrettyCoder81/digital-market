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
  create: (data: FormData) => api.post('/products/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  buy: (productId: number, buyerAddress: string) =>
    api.post('/products/buy', { productId, buyerAddress }),
  confirmBuy: (productId: number, signature: string) =>
    api.post('/products/buy/confirm', { productId, signature }),
  transfer: (productId: number, fromAddress: string, toAddress: string) =>
    api.post('/products/transfer', { productId, fromAddress, toAddress }),
  confirmTransfer: (productId: number, signature: string) =>
    api.post('/products/transfer/confirm', { productId, signature }),
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
  getProductCount: () => api.get('/blockchain/product-count'),
  getProduct: (id: number) => api.get(`/blockchain/product/${id}`),
  getListingFee: () => api.get('/blockchain/listing-fee'),
  getPlatformFee: () => api.get('/blockchain/platform-fee'),
  getApproveData: (amount: string, spender: string) =>
    api.post('/blockchain/approve-data', { amount, spender }),
  getCreateProductData: (name: string, description: string, price: string, imageURI: string) =>
    api.post('/blockchain/create-product-data', { name, description, price, imageURI }),
  getBuyProductData: (productId: number) =>
    api.post('/blockchain/buy-product-data', { productId }),
  getTransferData: (productId: number, newOwner: string) =>
    api.post('/blockchain/transfer-data', { productId, newOwner }),
  broadcastTransaction: (signedTx: string) =>
    api.post('/blockchain/broadcast', { signedTx }),
  // Admin endpoints
  setListingFee: (newFee: string) =>
    api.post('/admin/set-listing-fee', { newFee }),
  setPlatformFee: (newFee: number) =>
    api.post('/admin/set-platform-fee', { newFee }),
  withdrawFees: () => api.post('/admin/withdraw'),
  getStats: () => api.get('/admin/stats'),
};

export default api;
