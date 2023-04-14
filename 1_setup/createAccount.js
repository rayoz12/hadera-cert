const dotenv = require("dotenv");
dotenv.config();
const {
    Client,
    AccountBalanceQuery,
    AccountCreateTransaction,
    PublicKey,
    Hbar,
    PrivateKey
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const { ACCOUNT_ID, PRIVATE_KEY, PUBLIC_KEY } = utils.loadAccountCredentials();

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);


    for (let i = 0; i < 5; i++) {
        const key = await PrivateKey.generateED25519Async();
        const publicKey = key.publicKey;
        // console.log("Public Key:", publicKey.toStringDer());
        // console.log("Key:", key.toStringDer());
        // process.exit();
        
        //Create the transaction
        const transaction = new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(new Hbar(10))

        //Sign the transaction with the client operator private key and submit to a Hedera network
        const txResponse = await transaction.execute(client);

        //Request the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        //Get the account ID
        const newAccountId = receipt.accountId;

        console.log("The new account ID is " + newAccountId);
        console.log("The new account Public Key is " + publicKey.toStringDer());
        console.log("The new account Private Key is " + key.toStringDer());
        console.log();
    }

    process.exit();
}

main();
