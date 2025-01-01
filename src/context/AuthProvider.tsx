/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

//@ts-ignore
const AuthProvider = ({children}) => {  
    const evmNetworks = [
      {
        blockExplorerUrls: ['https://testnet.bscscan.com'], // BSC Testnet Explorer
        chainId: 97, // BSC Testnet Chain ID
        chainName: 'BNB Smart Chain Testnet',
        iconUrls: [
            'https://cryptologos.cc/logos/binance-coin-bnb-logo.png' // BNB icon URL
        ],
        name: 'BNB Smart Chain Testnet',
        nativeCurrency: {
            decimals: 18,
            name: 'BNB',
            symbol: 'tBNB', // Testnet BNB
            iconUrl: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
        },
        networkId: 97, // Same as Chain ID for EVM networks
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'], // BSC Testnet RPC
        vanityName: 'BNB Smart Chain Testnet',
    }
    ]
  return (<DynamicContextProvider
    settings={{
      environmentId: '168d7673-a035-4a74-99eb-f0cbcbb5da42',
      walletConnectors: [ EthereumWalletConnectors ],
      overrides: { evmNetworks },
    }}>
    {children}
  </DynamicContextProvider>
);
}

export default AuthProvider;
