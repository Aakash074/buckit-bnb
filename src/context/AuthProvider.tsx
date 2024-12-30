/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

//@ts-ignore
const AuthProvider = ({children}) => {  
    const evmNetworks = [
        {
            blockExplorerUrls: ['https://hashscan.io/#/testnet'],
            chainId: 296,
            chainName: 'Hedera Testnet',
            iconUrls: [
                'https://avatars.githubusercontent.com/u/31002956?s=200&v=4'  // HBAR icon
            ],
            name: 'Hedera',
            nativeCurrency: {
                decimals: 8,
                name: 'HBAR',
                symbol: 'HBAR',
                iconUrl: 'https://avatars.githubusercontent.com/u/31002956?s=200&v=4',
            },
            networkId: 296,
            rpcUrls: ['https://testnet.hashio.io/api'],
            vanityName: 'Hedera Testnet',
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
