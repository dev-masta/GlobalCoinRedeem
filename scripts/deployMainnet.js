const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {

    const [owner] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);
    console.log(`Owner [${owner.address}] Balance:`, ethers.utils.formatEther(await owner.getBalance()).toString());

    const GCBankFactory = await ethers.getContractFactory("GCBank");
    const GCBank = await GCBankFactory.deploy("0x6307b25a665efc992ec1c1bc403c38f3ddd7c661", hre.network.config.chainId);

    let net = hre.network.config.chainId.toString();

    console.log(JSON.stringify({
        [net]: {
            "GCBank": GCBank.address,
        }
    }, null, 2));

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
