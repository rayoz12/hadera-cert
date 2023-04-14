const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ContractFunctionParameters,
    ContractCallQuery
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const { ACCOUNT_ID, PRIVATE_KEY, PUBLIC_KEY } = utils.loadCreds("ACCOUNT2");
const SMART_CONTRACT_ID = process.env['SMART_CONTRACT_ID'];

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);

    //Create the transaction
    const transaction = new ContractCallQuery()
        .setContractId(SMART_CONTRACT_ID)
        .setGas(100_000_000)
        .setFunction("function1", new ContractFunctionParameters().addUint16(5).addUint16(6))

    //Sign with the client operator private key to pay for the transaction and submit the query to a Hedera network
    let txResponse; 
    try {
        txResponse = await transaction.execute(client);
    }
    catch (e) {
        console.error("Failed to call contract", e);
        process.exit();
    }

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    const result = txResponse.getUint48(0);

    console.log("The transaction consensus status is " + transactionStatus);
    console.log("The transaction result is", result);


    process.exit();
}

main();



