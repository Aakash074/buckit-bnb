/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    Client,
    PrivateKey,
    TokenCreateTransaction,
    TokenMintTransaction,
    TokenAssociateTransaction,
    TokenId,
    Hbar,
    TokenType,
    TokenSupplyType,
    AccountId,
    TopicMessageSubmitTransaction,
  } from "@hashgraph/sdk";
import axios from 'axios';

const topicId = "0.0.5138179"

// Initialize Hedera client
const client = Client.forTestnet(); // Use Client.forMainnet() for mainnet
//@ts-ignore
client.setOperator(import.meta.env.VITE_HEDERA_TESTNET_ACCOUNT_ID, PrivateKey.fromStringDer(import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY));

const createNonFungibleToken = async (
    treasuryAccountId: string | AccountId,
    supplyKey: PrivateKey,
    treasuryAccountPrivateKey: PrivateKey,
    _initialSupply: number,
    tokenName: string,
    tokenSymbol: string
  ): Promise<{ tokenId: TokenId; supplyKey: PrivateKey }> => {
    console.log(treasuryAccountPrivateKey)
    // Create a token creation transaction
    const createTokenTx = await new TokenCreateTransaction()
     .setTokenName(tokenName)
     .setTokenSymbol(tokenSymbol)
     .setTokenType(TokenType.NonFungibleUnique)
     .setDecimals(0)
     .setInitialSupply(0)
     .setTreasuryAccountId(treasuryAccountId)
     .setSupplyType(TokenSupplyType.Finite)
     .setMaxSupply(1) //@ts-ignore
     .setSupplyKey(PrivateKey.fromStringDer(import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY)) //@ts-ignore
     .setAdminKey(PrivateKey.fromStringDer(import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY))
     .setMaxTransactionFee(new Hbar(30))
     .freezeWith(client); //freeze tx from from any further mods.
  
    // Sign the transaction
    //@ts-ignore
    const signedTx = await createTokenTx.sign(PrivateKey.fromStringDer(import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY));
    // Submit the transaction to the Hedera network
    const response = await signedTx.execute(client);
    // Request the receipt of the transaction
    const receipt = await response.getReceipt(client);
    const tokenId = receipt.tokenId;
  
    if (tokenId === null || tokenId === undefined) {
      throw new Error("Somehow tokenId is null.");
    }
  
    console.log(`Token created with ID: ${tokenId}`);
    return { tokenId, supplyKey };
  };

const mintToken = async (
tokenId: TokenId,
metadata: Buffer[],
) => {
// Create a token mint transaction
const mintTokenTxn = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata(metadata)
    .freezeWith(client); // Freeze the transaction

// Sign the transaction with the supply key
//@ts-ignore
const mintTokenTxnSigned = await mintTokenTxn.sign(PrivateKey.fromStringDer(import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY));

// Submit the transaction to the Hedera network
const txnResponse = await mintTokenTxnSigned.execute(client);
// Request the receipt of the transaction
const mintTokenRx = await txnResponse.getReceipt(client);
const mintTokenStatus = mintTokenRx.status.toString();

console.log(`Token mint was a ${mintTokenStatus}`, mintTokenRx);
return mintTokenRx;
};

//@ts-ignore
export const mintNFT = async (ipfsHash, userAccount, nftData, videoId) => { //@ts-ignore
    const treasuryAccountId = import.meta.env.VITE_HEDERA_TESTNET_ACCOUNT_ID; // Replace with your treasury account ID
    //@ts-ignore
    const treasuryAccountPrivateKey = import.meta.env.VITE_HEDERA_TESTNET_PRIVATE_KEY; // Replace with your treasury account private key
  
    // Generate supply key
    const supplyKey = PrivateKey.generate();
    console.log(supplyKey, "supply")
  
    // Dynamic token name and symbol based on user-provided location name
    const tokenName = `${nftData?.videoDetails?.channelTitle} NFT`;
    const tokenSymbol = `${nftData?.videoDetails?.channelTitle.split(' ') // @ts-ignore
      .map(word => {
        // Keep the first character of the word and remove vowels from the rest
        return word[0] + word.slice(1).replace(/[aeiouAEIOU]/g, '');
      })
      .join('') // Join the words back together without spaces
      .toUpperCase()}`;
  
    // 1. Create NFT Collection
    const { tokenId } = await createNonFungibleToken(
      treasuryAccountId,
      supplyKey,
      treasuryAccountPrivateKey,
      0, // Set initial supply to 0 for NFTs
      tokenName,
      tokenSymbol
    );
  
    console.log("NFT Collection Created with Token ID:", tokenId.toString());
  
    // 2. Prepare metadata
    // const metadata = Buffer.from(
    //   JSON.stringify({
    //     ipfsHash,
    //     // coordinates,
    //   })
    // );
  //@ts-ignore
    const JWT = import.meta.env.VITE_PINATA_JWT;
  // @ts-ignore
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  //@ts-ignore
  const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
  
    const mdJson = {
      "name": tokenName,
      "description": nftData?.videoDetails?.title,
      "image": "ipfs://" + ipfsHash,
    //   "attributes": [
    //         { trait_type: "buckets", value: nftData?.result },
    //     ],
      "properties": {
            "creator": userAccount.accountId,
            "creatorName": nftData?.videoDetails?.channelTitle,
            "videoId": videoId,
            "buckets": nftData?.result
      }
    }
  
    const metadataBlob = new Blob([JSON.stringify(mdJson)], { type: 'application/json' });
    const formData = new FormData();
          formData.append('file', metadataBlob, 'nft_metadata.json');
  
          const pinataOptions = JSON.stringify({
            cidVersion: 0
        });
        formData.append('pinataOptions', pinataOptions);
  
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, { //@ts-ignore
          maxBodyLength: 'Infinity', // Support for large files
          headers: {
              'Authorization': `Bearer ${JWT}`,
              pinata_api_key: PINATA_API_KEY,
              pinata_secret_api_key: PINATA_SECRET_KEY
          }
      });
  
      // Get the IPFS hash from the response
      const ipfsHashMD = response.data.IpfsHash;
  
    const metadata = [
      Buffer.from("ipfs://" + ipfsHashMD  // Replace with your IPFS hash
        // attributes: [
        //     { trait_type: "Latitude", value: coordinates?.lat },
        //     { trait_type: "Longitude", value: coordinates?.lon }
        // ]
    )
  ];
  
    // 3. Mint the NFT with the metadata
    //@ts-ignore
    await mintToken(tokenId, metadata, supplyKey);
  
    console.log("NFT Minted with IPFS Hash and Coordinates.");
  
    // 4. Associate NFT with user's account
    const associateTx = new TokenAssociateTransaction()
      .setAccountId(userAccount.accountId)
      .setTokenIds([tokenId])
      .freezeWith(client);
  
    const associateTxSigned = await associateTx.sign(PrivateKey.fromStringDer(userAccount.accountPvtKey));
    const associateSubmit = await associateTxSigned.execute(client);
    const associateReceipt = await associateSubmit.getReceipt(client);
    console.log(`NFT Associated with User Account: ${userAccount.accountId}`, associateReceipt);
    const sendResponse = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: `${tokenName} (${tokenId}) is explored and minted.`,
    }).execute(client);
    const getReceipt = await sendResponse.getReceipt(client);
  
  // Get the status of the transaction
  const transactionStatus = getReceipt.status
  console.log("The message transaction status " + transactionStatus.toString())
    // window.location.reload()
  };