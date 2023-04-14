const dotenv = require("dotenv");
dotenv.config();

const {
  TokenCreateTransaction,
  Client,
  TokenType,
  TokenInfoQuery,
  TokenAssociateTransaction,
  TokenGrantKycTransaction,
  TransferTransaction,
  AccountBalanceQuery, 
  PrivateKey, 
  Wallet
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const ACCOUNT2 = utils.loadCreds("ACCOUNT2");
const ACCOUNT3 = utils.loadCreds("ACCOUNT3");

const account2Id = ACCOUNT2.ACCOUNT_ID
const account2PrivateKey = PrivateKey.fromString(ACCOUNT2.PRIVATE_KEY)

const account3Id = ACCOUNT3.ACCOUNT_ID
const account3PrivateKey = PrivateKey.fromString(ACCOUNT3.PRIVATE_KEY)

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const account2Client = Client.forTestnet();

account2Client.setOperator(account2Id, account2PrivateKey);

const account2Wallet = new Wallet(
  account2Id,
  account2PrivateKey
)

const account3Wallet = new Wallet(
  account3Id,
  account3PrivateKey
)

console.log(account2Wallet.publicKey)

async function main() {
  //Create the transaction and freeze for manual signing
  const createTransaction = await new TokenCreateTransaction()
      .setTokenName("Certified Brilliant Token")
      .setTokenSymbol("CBT")
      .setTokenType(TokenType.FungibleCommon)
      .setTreasuryAccountId(account2Id)
      .setInitialSupply(1000)
      .setAdminKey(account2Wallet.publicKey)
      .setSupplyKey(account2Wallet.publicKey)
      .setKycKey(account2Wallet.publicKey)
      .freezeWith(account2Client);

  //Sign the transaction with the client, who is set as admin and treasury account
  const signedCreateTransaction = await createTransaction.sign(account2PrivateKey);

  //Submit to a Hedera network
  const createTransactionResponse = await signedCreateTransaction.execute(account2Client);

  //Get the receipt of the transaction
  const createTransactionReceipt = await createTransactionResponse.getReceipt(account2Client);

  //Get the token ID from the receipt
  const tokenId = createTransactionReceipt.tokenId;

  console.log("The new token ID is " + tokenId);

  // Setting up a client for account 3
  const account3Client = Client.forTestnet()
  account3Client.setOperator(account3Id, account3PrivateKey)

  // Here we associate account 3 with the token, so they are eligible for airdrops
  const associateTransaction = await new TokenAssociateTransaction()
    .setAccountId(account3Id)
    .setTokenIds([tokenId])
    .freezeWith(account3Client)

  const signedAssociateTransaction = await associateTransaction.sign(account3PrivateKey)
  const associateTransactionResponse = await signedAssociateTransaction.execute(account3Client)
  const associateTransactionReceipt = await associateTransactionResponse.getReceipt(account3Client)

  // We can see the result was successful
  console.log("status", associateTransactionReceipt.status)

  // Now that the account is associated, we attempt to transfer it some tokens
  let transferTransaction = await new TransferTransaction()
    .addTokenTransfer(tokenId, account2Id, -12.99)
    .addTokenTransfer(tokenId, account3Id, 12.99)
    .freezeWith(account2Client)

  let signedTransferTx, transferTxResponse, transferTxReceipt
  try {
  signedTransferTx = await transferTransaction.sign(account2PrivateKey)
  transferTxResponse = await signedTransferTx.execute(account2Client)
  tranferTxReceipt = await transferTxResponse.getReceipt(account2Client)
  const transferStatus = receipt.status
  } catch (err) {
    // Alas, we forgot to KYC account 3!
    console.log("Didn't KYC account 3!")
  }


  // We don't want account 3 to be disappointed, and since they're a good friend, we certainly know this customer
  // So let's tell Hedera that!

  const kycTransaction = await new TokenGrantKycTransaction()
    .setAccountId(account3Id)
    .setTokenId(tokenId)
    .freezeWith(account2Client)
  
  const signedKycTransaction = await kycTransaction.sign(account2PrivateKey)
  const kycResponse = await signedKycTransaction.execute(account2Client)
  const kycReceipt = await kycResponse.getReceipt(account2Client)

  // Fantastic, account 3 has passed our KYC check! Now to finally finish that transfer
  console.log('kyc status:', kycReceipt.status)

  transferTransaction = await new TransferTransaction()
    .addTokenTransfer(tokenId, account2Id, -12.99)
    .addTokenTransfer(tokenId, account3Id, 12.99)
    .freezeWith(account2Client)
  signedTransferTx = await transferTransaction.sign(account2PrivateKey)
  transferTxResponse = await signedTransferTx.execute(account2Client)
  transferTxReceipt = await transferTxResponse.getReceipt(account2Client)

  // A successful status code! We've succeeded in transferring the tokens.
  console.log('transfer status, attempt 2:', transferTxReceipt.status)

  console.log("successfully transferred tokens to account 3!");

  process.exit();
}

main();
