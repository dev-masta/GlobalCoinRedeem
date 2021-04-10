const { AbiCoder } = require("@ethersproject/abi");
const { expect } = require("chai");
const hre = require("hardhat");

describe("GCBank", accounts => {

    let UChildERC20, GCBank;
    let owner, alice, bob, addrs;

    beforeEach(async function () {
        [owner, alice, bob, ...addrs] = await ethers.getSigners();

        const UChildERC20Factory = await ethers.getContractFactory("UChildERC20");
        UChildERC20 = await UChildERC20Factory.deploy();

        await UChildERC20.initialize("Global Coin Research", "GCR", "4", owner.address);

        const GCBankFactory = await ethers.getContractFactory("GCBank");
        GCBank = await GCBankFactory.deploy(UChildERC20.address, hre.network.config.chainId);

        // fund the GCBank contract with $GCR
        const abiCoder = ethers.utils.defaultAbiCoder;
        const data = abiCoder.encode([{type:"uint256"}], ["10000000"]);
        await UChildERC20.deposit(GCBank.address, data);

    });


    describe("GCBank Tests", accounts => {

        it("Should deploy contracts", async function () {
            expect(true).to.equal(true);
        });

        it("Owner should Distribute $GCR", async function () {

            expect(await UChildERC20.balanceOf(alice.address)).to.equal('0');
            const userNonce = await GCBank.nonces(owner.address);
            expect(userNonce).to.equal('0');

            const transferAmount = "250000";

            const typedMessage = {
                domain:{
                    name: "GCBank",
                    version: "1",
                    chainId : hre.network.config.chainId,
                    verifyingContract: GCBank.address
                },
                primaryType: "MetaTransaction",
                types: {
                    EIP712Domain: [
                        { name: "name", type: "string" },
                        { name: "version", type: "string" },
                        { name: "chainId", type: "uint256" },
                        { name: "verifyingContract", type: "address" }
                    ],
                    MetaTransaction: [
                        { name: "nonce", type: "uint256" },
                        { name: "from", type: "address" }
                    ]
                },
                message: {
                    nonce: parseInt(userNonce),
                    from: owner.address
                },
            };

            const signature = await hre.network.provider.request({
                method: "eth_signTypedData_v4",
                params: [owner.address, typedMessage],
            });
            const sig = signature.substring(2);
            const r = "0x" + sig.substring(0, 64);
            const s = "0x" + sig.substring(64, 128);
            const v = parseInt(sig.substring(128, 130), 16).toString();

            await GCBank.withdrawPoints(
                transferAmount,
                alice.address,
                r, s, v
            );

            expect(await UChildERC20.balanceOf(alice.address)).to.equal(transferAmount);
            expect(await GCBank.nonces(owner.address)).to.equal('1');
        });

    });

});
