const { ethers } = require("ethers");

const handler = async (event) => {

  const GCBank_address = "0x8baeDB9F881BAe7119E92cBF13F9c2C6608196a6";

  const GCBank_ABI = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_tokenAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_chainId",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "MoneyReceived",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_beneficiary",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "MoneySent",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Paused",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Unpaused",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "nonces",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "pauseContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "paused",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "pure",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_receiverAddress",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          }
        ],
        "name": "withdrawPoints",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }

  ]

  const body = JSON.parse(event.body);

  if (event.httpMethod == "POST" && Object.keys(body).includes('to') === true && Object.keys(body).includes('amount') === true){
    try {
      const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
      const provider = new ethers.providers.InfuraProvider("ropsten", process.env.PROJECT_ID);
      let GCBank = new ethers.Contract(GCBank_address, GCBank_ABI, provider);
      GCBank.connect(wallet);

      const userNonce = parseInt(await GCBank.nonces(wallet.address));

      const typedMessage = {
        domain:{
            name: "GCBank",
            version: "1",
            chainId : '3',
            verifyingContract: GCBank.address
        },
        primaryType: "MetaTransaction",
        types: {
            MetaTransaction: [
                { name: "nonce", type: "uint256" },
                { name: "from", type: "address" },
                { name: "to", type: "address" },
                { name: "amount", type: "uint256" }
            ]
        },
        message: {
            nonce: parseInt(userNonce),
            from: wallet.address,
            to: body['to'],
            amount: body['amount']
        },
      };

      let signature = await wallet._signTypedData(typedMessage.domain, typedMessage.types, typedMessage.message);

      signature = signature.substring(2);
      const r = "0x" + signature.substring(0, 64);
      const s = "0x" + signature.substring(64, 128);
      const v = parseInt(signature.substring(128, 130), 16);;

      return {
        statusCode: 200,
        body: JSON.stringify({ nonce: userNonce, r, s, v, amount: body['amount'], to: body['to'] }),
      }

    } catch (error) {
      return { statusCode: 500, body: error.toString() }
    }
  }
  else {
    return { statusCode: 200, body: 'Invalid Request' }
  }
}

module.exports = { handler }
