import {
    Client,
    PrivateKey,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType
} from "@hashgraph/sdk";

const HEDERA_ACCOUNT_ID = "0.0.5115181"; // Your Hedera Testnet Account ID
const HEDERA_PRIVATE_KEY = PrivateKey.fromString("302e020100300506032b657004220420fdeedc3027360de6dd4f48b68f81fab002dd4e1d5bd73cec64dedae3a3176a03");

const client = Client.forTestnet();
client.setOperator(HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY);

const treasuryId = HEDERA_ACCOUNT_ID;

const treasuryKey = HEDERA_PRIVATE_KEY;

const supplyKey = PrivateKey.generate();

let tokenCreateTx = await new TokenCreateTransaction()
	.setTokenName("Buck")
	.setTokenSymbol("BCK")
	.setTokenType(TokenType.FungibleCommon)
	.setDecimals(2)
	.setInitialSupply(1000000)
	.setTreasuryAccountId(treasuryId)
	.setSupplyType(TokenSupplyType.Infinite)
	.setSupplyKey(supplyKey)
	.freezeWith(client);

//SIGN WITH TREASURY KEY
let tokenCreateSign = await tokenCreateTx.sign(treasuryKey);

//SUBMIT THE TRANSACTION
let tokenCreateSubmit = await tokenCreateSign.execute(client);

//GET THE TRANSACTION RECEIPT
let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

//GET THE TOKEN ID
let tokenId = tokenCreateRx.tokenId;

//LOG THE TOKEN ID TO THE CONSOLE
console.log(`- Created token with ID: ${tokenId} \n`);