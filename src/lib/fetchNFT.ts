/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';

import { ethers } from "ethers";
import nftMintAbi from "../contracts/nftMintAbi.json";

//@ts-ignore

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
export const fetchMintedNFTs = async () => {
    // console.log(pageToken, "fetchNFT")
    //@ts-ignore



    try { //@ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            // const contractAddress = "0xfd590B760B58733488513e5E4b75130D54Cdc9f8";
            const contractAddress = "0x71d75177f0e105ddcf8628f352981d8e50a0136a"
      
            const contract = new ethers.Contract(contractAddress, nftMintAbi, signer);
      const [tokenIds, owners, metadataURIs] = await contract.allMintedTokens(); //@ts-ignore
      const tokenData = tokenIds.map((id, index) => ({
        tokenId: id.toString(),
        owner: owners[index],
        metadataURI: metadataURIs[index],
      }));
        // console.log(tokenData)
        const MetaDataNFTs = await Promise.all( //@ts-ignore
          tokenData.map(async (token) => {
            // Fetch metadata from IPFS
            const metadata = await fetchNFTMetadataFromIPFS(token.metadataURI);
            return {
              tokenId: token.tokenId,
              owner: token.owner,
              metadata,
            };
          })
        );
        // console.log(MetaDataNFTs);

        return MetaDataNFTs
  } catch (error) {
    console.error(`Error fetching NFTs for account:`, error);
    throw error;
  }

}