import React from 'react';
import Web3 from 'web3';

export function getWeb3(): Web3 {
  return window.web3;
}

export const GlobalContext = React.createContext<{
    web3: any,
  }>({
    web3: null,
  });