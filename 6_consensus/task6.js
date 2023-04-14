const dotenv = require("dotenv");
dotenv.config();
const {
  TopicCreateTransaction,
  Client,
  PrivateKey,
  TopicMessageSubmitTransaction
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const ACCOUNT1 = utils.loadCreds("ACCOUNT1");

account1Id = ACCOUNT1.ACCOUNT_ID
account1PrivateKey = ACCOUNT1.PRIVATE_KEY

async function main() {

const client = Client.forTestnet();
client.setOperator(account1Id, account1PrivateKey);

  //Create a new topic
  let txResponse = await new TopicCreateTransaction().execute(client);

  //Get the receipt of the transaction
  let receipt = await txResponse.getReceipt(client);

  //Grab the new topic ID from the receipt
  let topicId = receipt.topicId;

  //Log the topic ID
  console.log(`Your topic ID is: ${topicId}`);

  // Submit a message to the topic that specifies the unix time as of submission
  let sendResponse = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: `Unix time as of submitting this message: ${Date.now()}`,
  }).execute(client);

    //Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);

    //Get the status of the message submission
    const transactionStatus = getReceipt.status;
    console.log("The message transaction status: " + transactionStatus);

  process.exit();
}

main();
