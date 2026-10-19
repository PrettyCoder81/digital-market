import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// Sepolia chain ID
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToSepolia: () => Promise<void>;
  shortAddress: string;
  balance: string;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  chainId: null,
  isCorrectNetwork: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  switchToSepolia: async () => {},
  shortAddress: '',
  balance: '0',
});

export const useWallet = () => useContext(WalletContext);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState('0');

  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;
  const isConnected = !!address;
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const getBalance = useCallback(async (addr: string) => {
    if (typeof window.ethereum === 'undefined') return;
    try {
      // Get TonysCoin balance via contract call
      // For demo, we'll use a simple ETH balance check
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest'],
      });
      const balanceEth = Number(BigInt(balanceHex)) / 1e18;
      setBalance(balanceEth.toFixed(4));
    } catch (err) {
      console.error('Failed to get balance:', err);
    }
  }, []);

  const connect = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application!');
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        await getBalance(accounts[0]);

        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        }) as string;
        setChainId(currentChainId);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        console.log('User rejected connection');
      } else {
        console.error('Connection error:', err);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [getBalance]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setBalance('0');
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (err: any) {
      // If the chain hasn't been added, add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            }],
          });
        } catch (addErr) {
          console.error('Failed to add Sepolia network:', addErr);
        }
      } else {
        console.error('Failed to switch network:', err);
      }
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
        getBalance(accounts[0]);
      }
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId);
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [disconnect, getBalance]);

  // Auto-connect if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum === 'undefined') return;
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        }) as string[];
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          await getBalance(accounts[0]);
          const currentChainId = await window.ethereum.request({
            method: 'eth_chainId',
          }) as string;
          setChainId(currentChainId);
        }
      } catch (err) {
        console.error('Auto-connect error:', err);
      }
    };
    checkConnection();
  }, [getBalance]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        chainId,
        isCorrectNetwork,
        isConnecting,
        connect,
        disconnect,
        switchToSepolia,
        shortAddress,
        balance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export default WalletContext;
