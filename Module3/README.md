# CandyMachine-And-Token-Project

In this project, I created spl token and named "Hot Token", an NFT is created called "Numbers Collection". Users can only pay for minting using the created token.

## Getting started

### Creating the spl token

- run `npm install` to install the necessary dependencies
- have [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) installed
- run `node mySplToken/index.mjs` to create an spl token, mint 5 tokens to the `fromWallet` account and transfer 2 tokens to the `toWallet` account
- edit `package.json` and delete line 6 `type: module`.
- run `node mySplToken/token.mjs` to add metadata to the spl token, giving it a name and image.

### Creating the NFT

- the assets folder contains the assets to be used for the NFTs
- the config.json contains the setup, specifing the spl token address and account to store spl token spent by users in buying the NFT
- `solana keygen` to generate an account
- `solana airdrop 2` to fund the new account
- `sugar validate` to validate data files
- `sugar upload` to upload NFTs to arweave
- `sugar deploy` to deploy the NFT
- `sugar verify` to verify the deployed NFTs
- `sugar mint` to mint the NFTs
- `npm start` to start the app

For more information visit [Quicknode tutorial](https://www.quicknode.com/guides/solana-development/nfts/how-to-deploy-an-nft-collection-on-solana-using-sugar-candy-machine)

## Author

[Opeyemi Esther Agbaje](https://github.com/esteriella)

## License

This project is licensed under the [MIT License](LICENSE).
