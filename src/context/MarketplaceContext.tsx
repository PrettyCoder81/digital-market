import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, Transaction } from '../types';
import { initialProducts } from '../data/products';

interface MarketplaceContextType {
  products: Product[];
  transactions: Transaction[];
  platformFee: number;
  contractBalance: string;
  owner: string;
  connectedAccount: string | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  purchaseProduct: (productId: string) => Promise<void>;
  transferOwnership: (productId: string, newOwner: string) => Promise<void>;
  withdrawFunds: () => Promise<void>;
  updatePlatformFee: (newFee: number) => void;
  listForSale: (productId: string, price: string) => void;
  delistProduct: (productId: string) => void;
  isOwner: boolean;
  isProductOwner: (productId: string) => boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const MARKETPLACE_OWNER = '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18';

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [platformFee, setPlatformFee] = useState<number>(5);
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  const isConnected = connectedAccount !== null;
  const isOwner = connectedAccount?.toLowerCase() === MARKETPLACE_OWNER.toLowerCase();

  const connectWallet = useCallback(async () => {
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockAddress = MARKETPLACE_OWNER;
    setConnectedAccount(mockAddress);
  }, []);

  const disconnectWallet = useCallback(() => {
    setConnectedAccount(null);
  }, []);

  const purchaseProduct = useCallback(async (productId: string) => {
    if (!connectedAccount) throw new Error('Wallet not connected');
    
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    if (!product.isForSale) throw new Error('Product not for sale');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const feeAmount = (parseFloat(product.price) * platformFee) / 100;
    const ownerAmount = parseFloat(product.price) - feeAmount;

    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, owner: connectedAccount, isForSale: false } : p
    ));

    setContractBalance(prev => (parseFloat(prev) + feeAmount).toFixed(4));

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      productId,
      from: connectedAccount,
      to: product.owner,
      price: product.price,
      type: 'purchase',
      timestamp: Date.now(),
    };
    setTransactions(prev => [tx, ...prev]);
  }, [connectedAccount, products, platformFee]);

  const transferOwnership = useCallback(async (productId: string, newOwner: string) => {
    if (!connectedAccount) throw new Error('Wallet not connected');

    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    if (product.owner.toLowerCase() !== connectedAccount.toLowerCase()) {
      throw new Error('You are not the owner of this product');
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, owner: newOwner, isForSale: false } : p
    ));

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      productId,
      from: connectedAccount,
      to: newOwner,
      price: '0',
      type: 'transfer',
      timestamp: Date.now(),
    };
    setTransactions(prev => [tx, ...prev]);
  }, [connectedAccount, products]);

  const withdrawFunds = useCallback(async () => {
    if (!isOwner) throw new Error('Only owner can withdraw');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setContractBalance('0');
  }, [isOwner]);

  const updatePlatformFee = useCallback((newFee: number) => {
    if (!isOwner) throw new Error('Only owner can update fee');
    if (newFee < 0 || newFee > 25) throw new Error('Fee must be between 0 and 25%');
    setPlatformFee(newFee);
  }, [isOwner]);

  const listForSale = useCallback((productId: string, price: string) => {
    if (!connectedAccount) throw new Error('Wallet not connected');
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    if (product.owner.toLowerCase() !== connectedAccount.toLowerCase()) {
      throw new Error('Only the owner can list this product');
    }
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isForSale: true, price } : p
    ));
  }, [connectedAccount, products]);

  const delistProduct = useCallback((productId: string) => {
    if (!connectedAccount) throw new Error('Wallet not connected');
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    if (product.owner.toLowerCase() !== connectedAccount.toLowerCase()) {
      throw new Error('Only the owner can delist this product');
    }
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isForSale: false } : p
    ));
  }, [connectedAccount, products]);

  const isProductOwner = useCallback((productId: string) => {
    if (!connectedAccount) return false;
    const product = products.find(p => p.id === productId);
    return product?.owner.toLowerCase() === connectedAccount.toLowerCase();
  }, [connectedAccount, products]);

  return (
    <MarketplaceContext.Provider value={{
      products,
      transactions,
      platformFee,
      contractBalance,
      owner: MARKETPLACE_OWNER,
      connectedAccount,
      isConnected,
      connectWallet,
      disconnectWallet,
      purchaseProduct,
      transferOwnership,
      withdrawFunds,
      updatePlatformFee,
      listForSale,
      delistProduct,
      isOwner,
      isProductOwner,
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
}
