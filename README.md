## GCBank

### Running Locally

1. Install dependencies `npm i`

2. Setup `.env` file in the root directory according to the `.env.sample`.

    > First three are required for deployment on Netlify.
    - `PRIVATE_KEY` : Your wallet PRIVATE_KEY. Make sure to fund your account with eth.
    - `PRIVATE_KEY_TEST` : Your wallet PRIVATE_KEY for testnet. Make sure to fund your account from the faucet.
    - `PROJECT_ID` : Your Infura project Id.
    - `ETHERSCAN_API_KEY` : Your Etherscan API key.
    - `CMC_APIKEY` : Your CoinMarketCap API key.

3. Run `npm run deploy:local` to deploy locally and `npm run deploy:matic` to deploy to matic testnet.
