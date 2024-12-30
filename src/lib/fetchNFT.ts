/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import { AccountId } from '@hashgraph/sdk';

// Replace with your mirror node URL (Testnet or Mainnet)
const MIRROR_NODE_API = "https://testnet.mirrornode.hedera.com";

//@ts-ignore
const decodeBase64 = (data) => Buffer.from(data, 'base64').toString('utf8');

//@ts-ignore
const fetchNFTMetadataFromIPFS = async (ipfsHash) => {
    try {
      const ipfsGatewayUrl = `https://peach-accused-eel-595.mypinata.cloud/ipfs/${ipfsHash.split('ipfs://')[1]}`;
      const response = await axios.get(ipfsGatewayUrl);
      return response.data
    } catch (error) {
      console.error(`Error fetching metadata from IPFS hash: ${ipfsHash}`, error);
      // throw error;
      return null
    }
  };
//@ts-ignore
export const fetchMintedNFTs = async (pageToken) => {
    console.log(pageToken, "fetchNFT")
    //@ts-ignore
  const accountIdString = import.meta.env.VITE_HEDERA_TESTNET_ACCOUNT_ID;
  const accountId = AccountId.fromString(accountIdString);

  try {
    // Get token associations for this account from the mirror node
    const response = await axios.get(pageToken ? MIRROR_NODE_API + pageToken : `${MIRROR_NODE_API}/api/v1/accounts/${accountId}/tokens`);

    if (response.data.tokens && response.data.tokens.length > 0) {
      const tokens = response.data.tokens;
      console.log(tokens)

      // Filter out non-NFT tokens (keep only Non-Fungible Unique tokens)
    //   const nftTokens = tokens.filter(token => token.type === 'NON_FUNGIBLE_UNIQUE');

      // For each NFT, fetch its metadata from IPFS
      const nfts = await Promise.all( //@ts-ignore
        tokens.map(async (nft) => {
          // Fetch all NFTs (serial numbers) for the given token ID
          const nftsResponse = await axios.get(`${MIRROR_NODE_API}/api/v1/tokens/${nft.token_id}/nfts`);
          const nftsList = nftsResponse.data.nfts;

          // Map through the NFT serial numbers and fetch the metadata for each one
          const nftDetails = await Promise.all( //@ts-ignore
            nftsList.map(async (nftItem) => {
              const metadataBase64 = nftItem.metadata; // Metadata is base64-encoded
              const metadata = decodeBase64(metadataBase64); // Decode the metadata
            //   console.log(metadata, nftItem)
              // Fetch the actual metadata from Pinata (assumes metadata contains an IPFS hash)
              const metadataIPFS = await fetchNFTMetadataFromIPFS(metadata);

              return {
                serial_number: nftItem.serial_number,
                metadata: metadataIPFS,
                token_id: nft.token_id,
                account_id: nftItem.account_id
              };
            })
          );
        //   console.log(nftDetails)

          return nftDetails;
        })
      );
    //   console.log(nfts.flat()?.filter((item) => item?.metadata?.properties?.videoId))

      return { nfts: nfts.flat()?.filter((item) => item?.metadata?.properties?.videoId), next: response?.data?.links?.next}; // Flatten the array of arrays
    } else {
      console.log(`No NFTs found for account: ${accountIdString}`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching NFTs for account ${accountIdString}:`, error);
    throw error;
  }
};