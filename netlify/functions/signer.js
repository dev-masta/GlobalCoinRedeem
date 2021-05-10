const { ethers } = require("ethers");
const crypto = require('crypto');

let password = process.env.PASSWORD;
let iv = process.env.IV;
let text = "GCR-API";

function encrypt( iv, text, password ){

  var cipher = crypto.createCipheriv('aes-256-ctr', password, iv );

  var crypted  = cipher.update( text, 'utf8', 'hex');
      crypted += cipher.final('hex');

  return crypted;
}

function decrypt( iv, text, password ){

  var decipher = crypto.createDecipheriv('aes-256-ctr', password, iv );

  var dec  = decipher.update( text, 'hex', 'utf8');
      dec += decipher.final('utf8');

  return dec;
}

const handler = async (event) => {

  const GCBank_address = "0xE09C9902682554B4743CB4b02bC0cdB538c2bEE6";

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
      "inputs": [],
      "name": "unpauseContract",
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
  ];

  const body = JSON.parse(event.body);

  try {
    if (
      event.httpMethod == "POST"
      && Object.keys(body).includes('to') === true
      && Object.keys(body).includes('amount') === true
      && Object.keys(body).includes('gcrkey') === true
      && decrypt( iv, body.gcrkey, password ) === text
    ){
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
      const provider = new ethers.providers.InfuraProvider("mainnet", process.env.PROJECT_ID);
      let GCBank = new ethers.Contract(GCBank_address, GCBank_ABI, provider);
      GCBank.connect(wallet);

      const userNonce = parseInt(await GCBank.nonces(wallet.address));

      const typedMessage = {
        domain:{
            name: "GCBank",
            version: "1",
            chainId : provider._network.chainId.toString(),
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

    }
    else {
      return { statusCode: 200, body: 'Invalid Request' }
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({error: error.toString()}) }
  }


}

module.exports = { handler }
