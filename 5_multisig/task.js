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
    AccountId,
    TransactionReceiptQuery,
    ScheduleId,
    Timestamp,
    ScheduleSignTransaction
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const ACCOUNT = utils.loadAccountCredentials();
const ACCOUNT1 = utils.loadCreds("ACCOUNT1");
const ACCOUNT2 = utils.loadCreds("ACCOUNT2");
const ACCOUNT3 = utils.loadCreds("ACCOUNT3");

const SCHEDULE_ID = process.env['SCHEDULE_ID'];

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT.ACCOUNT_ID, ACCOUNT.PRIVATE_KEY);

    const nodeId = [];
    nodeId.push(new AccountId.fromString(ACCOUNT3.ACCOUNT_ID));

    //Create a transaction to schedule
    const transaction = new TransferTransaction()
        .addHbarTransfer(ACCOUNT1.ACCOUNT_ID, Hbar.fromTinybars(-100))
        .addHbarTransfer(ACCOUNT2.ACCOUNT_ID, Hbar.fromTinybars(100))
        .setNodeAccountIds(nodeId)
        .freezeWith(client)

    //Schedule a transaction
    const scheduleTransaction = await new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)
        .setScheduleMemo("Scheduled TX test" + (Math.floor(Math.random() * 100)))
        .setAdminKey(PrivateKey.fromString(ACCOUNT.PRIVATE_KEY))
        .execute(client);

    //Get the receipt of the transaction
    const receipt = await scheduleTransaction.getReceipt(client);

    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.log("The schedule ID is " +scheduleId);

    //Get the scheduled transaction ID
    const scheduledTxId = receipt.scheduledTransactionId;
    console.log("The scheduled transaction ID is " +scheduledTxId);

    console.log("Status:", receipt.status.toString());

    //Create the query
    let query = new ScheduleInfoQuery()
    .setScheduleId(scheduleId);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    let info = await query.execute(client);
    console.log("The scheduledId you queried for is: ", new ScheduleId(info.scheduleId).toString());
    console.log("The memo for it is: ", info.scheduleMemo);
    console.log("It was created by: ", new AccountId(info.creatorAccountId).toString());
    console.log("It was payed by: ", new AccountId(info.payerAccountId).toString());
    console.log("The expiration time of the scheduled tx is: ", new Timestamp(info.expirationTime).toDate());
    if(new Timestamp(info.executed).toDate().getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()) {
        console.log("The transaction has not been executed yet. (for the cert)");
    } else {
        console.log("The time of execution of the scheduled tx is: ", new Timestamp(info.executed).toDate());
    }

    //Create the transaction
    const transaction1 = await new ScheduleSignTransaction()
    .setScheduleId(scheduleId)
    .freezeWith(client)
    .sign(PrivateKey.fromString(ACCOUNT1.PRIVATE_KEY));

    //Sign with the client operator key to pay for the transaction and submit to a Hedera network
    const txResponse = await transaction1.execute(client);

    //Get the receipt of the transaction
    const signReceipt = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus = receipt.status;
    console.log("The transaction consensus status is " +transactionStatus);

    //Create the query
    query = new ScheduleInfoQuery()
    .setScheduleId(scheduleId);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    info = await query.execute(client);
    console.log("The scheduledId you queried for is: ", new ScheduleId(info.scheduleId).toString());
    console.log("The memo for it is: ", info.scheduleMemo);
    console.log("It was created by: ", new AccountId(info.creatorAccountId).toString());
    console.log("It was payed by: ", new AccountId(info.payerAccountId).toString());
    console.log("The expiration time of the scheduled tx is: ", new Timestamp(info.expirationTime).toDate());
    if(new Timestamp(info.executed).toDate().getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()) {
        console.log("The transaction has not been executed yet. (for the cert)");
    } else {
        console.log("The time of execution of the scheduled tx is: ", new Timestamp(info.executed).toDate());
    }

    // 2
    const transaction2 = await new ScheduleSignTransaction()
    .setScheduleId(scheduleId)
    .freezeWith(client)
    .sign(PrivateKey.fromString(ACCOUNT1.PRIVATE_KEY));

    //Sign with the client operator key to pay for the transaction and submit to a Hedera network
    const txResponse2 = await transaction2.execute(client);

    //Get the receipt of the transaction
    const signReceipt2 = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus2 = receipt.status;
    console.log("The transaction consensus status is " +transactionStatus2);

    //Create the query
    query = new ScheduleInfoQuery()
    .setScheduleId(scheduleId);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    info = await query.execute(client);
    console.log("The scheduledId you queried for is: ", new ScheduleId(info.scheduleId).toString());
    console.log("The memo for it is: ", info.scheduleMemo);
    console.log("It was created by: ", new AccountId(info.creatorAccountId).toString());
    console.log("It was payed by: ", new AccountId(info.payerAccountId).toString());
    console.log("The expiration time of the scheduled tx is: ", new Timestamp(info.expirationTime).toDate());
    if(new Timestamp(info.executed).toDate().getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()) {
        console.log("The transaction has not been executed yet. (for the cert)");
    } else {
        console.log("The time of execution of the scheduled tx is: ", new Timestamp(info.executed).toDate());
    }
      


    process.exit();
}

main();



