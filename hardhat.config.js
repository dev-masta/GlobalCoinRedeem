require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-abi-exporter');
require('hardhat-contract-sizer');
require("hardhat-gas-reporter");
require('dotenv').config()

let pk = process.env.PRIVATE_KEY;
let mnemonic = process.env.MNEMONIC;

const infuraNetwork = (network, chainId, gas) => {
  return {
    url: `https://${network}.infura.io/v3/${process.env.PROJECT_ID}`,
    chainId,
    gas,
    accounts: [pk]
  };
};

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
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
    // hardhat: {
    //   allowUnlimitedContractSize: false,
    //   accounts: mnemonic ? { mnemonic } : privateKey ? [{privateKey: pk, balance: "100000000000000000000"}] : undefined,
    //   forking: {
    //     url: "https://mainnet.infura.io/v3/9f34d0bf5e1b4b36914fd5bc66c50b05",
    //     chainId: 1,
    //   }
    // },
    hardhat: {
      accounts: mnemonic ? { mnemonic } : privateKey ? [{privateKey: pk, balance: "100000000000000000000"}] : undefined,
    },
    rinkeby: infuraNetwork("rinkeby", 4, 6283185),
    ropsten: infuraNetwork("ropsten", 3, 6283185),
    kovan: infuraNetwork("kovan", 42, 6283185),
    goerli: infuraNetwork("goerli", 5, 6283185),
    matic: {
      url: "https://rpc-mumbai.matic.today/",
      chainId: 80001,
      accounts: mnemonic ? { mnemonic } : privateKey ? [pk] : undefined,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY ? process.env.ETHERSCAN_API_KEY : undefined
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 50,
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
  },
  mocha: {
    timeout: 1000000,
  }
};

