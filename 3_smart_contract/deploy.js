const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ContractCreateFlow,
    PrivateKey
} = require("@hashgraph/sdk");
const utils = require("../utils/utils.js");

const { ACCOUNT_ID, PRIVATE_KEY, PUBLIC_KEY } = utils.loadCreds("ACCOUNT2");

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);
    const contractString = await fs.readFile("./3_smart_contract/artifacts/2_smart_contract/contracts/certificationC3.sol/CertificationC1.json");
    console.log(contractString);
    let contract = JSON.parse(contractString);
    const bytecode = contract.bytecode;


    //Create the transaction
    const contractCreate = new ContractCreateFlow()
        .setGas(100000)
        .setAdminKey(PrivateKey.fromString(PRIVATE_KEY))
        .setBytecode(bytecode);

    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = contractCreate.execute(client);

    //Get the receipt of the transaction
    const receipt = (await txResponse).getReceipt(client);

    //Get the new contract ID
    const newContractId = (await receipt).contractId;
        
    console.log("The new contract ID is " +newContractId);

    process.exit();
}

main();



