import { useCallback, useEffect, useState } from 'react';
import { CHAIN_ID } from '../lib/contract.js';

const BRADBURY_PARAMS = {
  chainId: '0x107D',
  chainName: 'GenLayer Bradbury Testnet',
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrls: ['https://rpc-bradbury.genlayer.com'],
  blockExplorerUrls: ['https://explorer-bradbury.genlayer.com/'],
};

function getEth() {
  if (typeof window === 'undefined') return null;
  return window.ethereum ?? null;
}

export function useWallet() {
  const [state, setState] = useState({
    address: null,
    chainId: null,
    connecting: false,
    hasProvider: false,
    error: null,
  });

  useEffect(() => {
    setState((s) => ({ ...s, hasProvider: !!getEth() }));
  }, []);

  const refreshChain = useCallback(async () => {
    const eth = getEth();
    if (!eth) return;
    try {
      const cid = await eth.request({ method: 'eth_chainId' });
      setState((s) => ({ ...s, chainId: parseInt(cid, 16) }));
    } catch {
      /* ignore */
    }
  }, []);

  const connect = useCallback(async () => {
    const eth = getEth();
    if (!eth) {
      setState((s) => ({ ...s, error: 'No wallet detected' }));
      return;
    }
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      try {
        await eth.request({ method: 'wallet_addEthereumChain', params: [BRADBURY_PARAMS] });
      } catch {
        /* chain may already exist */
      }
      try {
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BRADBURY_PARAMS.chainId }],
        });
      } catch {
        /* user may decline switch */
      }
      const cid = await eth.request({ method: 'eth_chainId' });
      setState((s) => ({
        ...s,
        address: accounts[0] ?? null,
        chainId: parseInt(cid, 16),
        connecting: false,
      }));
    } catch (e) {
      const msg = /user rejected|denied/i.test(String(e))
        ? 'Connection request was declined'
        : 'Could not connect wallet';
      setState((s) => ({ ...s, connecting: false, error: msg }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState((s) => ({ ...s, address: null }));
  }, []);

  useEffect(() => {
    const eth = getEth();
    if (!eth?.on) return;
    const onAccounts = (accts) => {
      setState((s) => ({ ...s, address: accts && accts.length ? accts[0] : null }));
    };
    const onChain = () => refreshChain();
    eth.on('accountsChanged', onAccounts);
    eth.on('chainChanged', onChain);
    return () => {
      eth.removeListener?.('accountsChanged', onAccounts);
      eth.removeListener?.('chainChanged', onChain);
    };
  }, [refreshChain]);

  const onRightChain = state.chainId === CHAIN_ID;
  return { ...state, onRightChain, connect, disconnect };
}
