require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');
require('hardhat-contract-sizer');
require("hardhat-gas-reporter");
require('dotenv').config()

let mnemonic = process.env.MNEMONIC;

const infuraNetwork = (network, chainId, gas) => {
  return {
    url: `https://${network}.infura.io/v3/${process.env.PROJECT_ID}`,
    chainId,
    gas,
    accounts: mnemonic ? { mnemonic } : undefined
  };
};

const alchemyNetwork = (network, chainId, gas) => {
    return {
        url: `https://eth-${network}.alchemyapi.io/v2/${process.env.ALCHEMY_PROJECT_ID}`,
        chainId,
        gas,
        accounts: mnemonic ? { mnemonic } : undefined
    };
};

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            runs: 99999,
            enabled: true
          }
        }
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            runs: 99999,
            enabled: true
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      accounts: mnemonic ? { mnemonic } : undefined,
      forking: {
        url: "https://rpc-mumbai.matic.today/",
        chainId: 80001,
      }
    },
    // hardhat: {
    //   accounts: mnemonic ? { mnemonic } : undefined,
    // },
    rinkeby: infuraNetwork("rinkeby", 4, 6283185),
    ropsten: alchemyNetwork("ropsten", 3, 6283185),
    kovan: infuraNetwork("kovan", 42, 6283185),
    goerli: infuraNetwork("goerli", 5, 6283185),
    matic: {
      url: "https://rpc-mumbai.matic.today/",
      chainId: 80001,
      accounts: mnemonic ? { mnemonic } : undefined
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : undefined
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    coinmarketcap: process.env.CMC_APIKEY
  },
  abiExporter: {
    path: './abi',
    clear: true,
    flat: true,
    only: ['GCBank'],
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  }
};

