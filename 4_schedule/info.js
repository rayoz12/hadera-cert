const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    TransferTransaction,
    ScheduleCreateTransaction,
    Hbar,
    PrivateKey,
    ScheduleInfoQuery,
    AccountId
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const ACCOUNT1 = utils.loadCreds("ACCOUNT1");
const ACCOUNT2 = utils.loadCreds("ACCOUNT2");

const SCHEDULE_ID = process.env['SCHEDULE_ID'];


async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT1.ACCOUNT_ID, ACCOUNT1.PRIVATE_KEY);
    //Create the query
    const query = new ScheduleInfoQuery()
    .setScheduleId(SCHEDULE_ID);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    const info = await query.execute(client);
    console.log(info);

    new TransactionReceiptQuery()
    .setTransactionId(transactionId)
    .execute(client)

    


    process.exit();
}

main();



