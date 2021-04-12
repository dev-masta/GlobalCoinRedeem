const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {

    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", owner.address);
    console.log(`Owner [${owner.address}] Balance:`, ethers.utils.formatEther(await owner.getBalance()).toString());
    console.log(`Addr1 [${addr1.address}] Balance:`, ethers.utils.formatEther(await addr1.getBalance()).toString());
    console.log(`Addr2 [${addr2.address}] Balance:`, ethers.utils.formatEther(await addr2.getBalance()).toString());

    // === Only on testnet :: start ===
    const UChildERC20Factory = await ethers.getContractFactory("UChildERC20");
    const UChildERC20 = await UChildERC20Factory.deploy();

    await UChildERC20.initialize("Global Coin Research", "GCR", "4", owner.address);
    // === Only on testnet :: end ===

    const GCBankFactory = await ethers.getContractFactory("GCBank");
    const GCBank = await GCBankFactory.deploy(UChildERC20.address, hre.network.config.chainId);

    let net = hre.network.config.chainId.toString();

    console.log(JSON.stringify({
        [net]: {
            "GCR": UChildERC20.address,
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
