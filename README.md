## GCBank

### Running Locally

1. Install dependencies `npm i`

2. Setup `.env` file in the root directory according to the `.env.sample`.

    > First 5 are required for deployment on Netlify.
    1. `PRIVATE_KEY` : Your wallet PRIVATE_KEY. Make sure to fund your account with eth.
    1. `PRIVATE_KEY_TEST` : Your wallet PRIVATE_KEY for testnet. Make sure to fund your account from the faucet.
    1. `PROJECT_ID` : Your Infura project Id.
    1. `PASSWORD`: Crypto Cipher key
    1. `IV`: Crypto Cipher IV
    1. `ETHERSCAN_API_KEY` : Your Etherscan API key.
    1. `CMC_APIKEY` : Your CoinMarketCap API key.

3. Run `npm run deploy:local` to deploy locally and `npm run deploy:matic` to deploy to matic testnet.
