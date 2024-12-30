import {
    Client,
    PrivateKey,
    TopicCreateTransaction,
} from "@hashgraph/sdk";

const HEDERA_ACCOUNT_ID = "0.0.5115181"; // Your Hedera Testnet Account ID
const HEDERA_PRIVATE_KEY = PrivateKey.fromString("302e020100300506032b657004220420fdeedc3027360de6dd4f48b68f81fab002dd4e1d5bd73cec64dedae3a3176a03");

const client = Client.forTestnet();
client.setOperator(HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY);

// Create a new topic
let txResponse = await new TopicCreateTransaction().execute(client);

// Grab the newly generated topic ID
let receipt = await txResponse.getReceipt(client);
let topicId = receipt.topicId;
console.log(`Your topic ID is: ${topicId}`);

// Wait 5 seconds between consensus topic creation and subscription creation
await new Promise((resolve) => setTimeout(resolve, 5000));