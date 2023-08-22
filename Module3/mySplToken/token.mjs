import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import * as mpl from '@metaplex-foundation/mpl-token-metadata';
import * as anchor from '@project-serum/anchor';

import { Buffer } from 'buffer';

// Flag to determine if initialization or update
const INITIALIZE = true;

// Main async function
(async () => {
  // Creating a connection to Solana devnet
  const connection = new Connection("https://api.devnet.solana.com");

  // Secret key for the account
  const fromSecretKey = new Uint8Array([
    81, 116,  54, 171, 219, 235,  21, 120, 235,  38,  22,
    23, 241,  31,  34, 196,  39,  94, 123, 225, 248, 153,
    15, 113,  78,  73, 117, 207, 168, 215, 138, 138, 120,
    188, 255,  76,  30, 240, 242,  69, 167, 149, 110,  68,
    224,  94, 169, 130, 224, 151, 253, 182, 191,  46, 109,
    66,  14, 100, 123, 111,  16, 117,  69, 208
  ]);

  // Creating a keypair from the secret key
  const fromWallet = Keypair.fromSecretKey(fromSecretKey);

  // Public key of the mint
  const mint = new PublicKey('GSWY8SaDHmmQMPDbut5CENTKDbdQVgVow74sp5oBcB5e');

  // Seeds and bump for finding program address
  const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));
  const seed2 = Buffer.from(mpl.PROGRAM_ID.toBytes());
  const seed3 = Buffer.from(mint.toBytes());
  const [metadataPDA, _bump] = PublicKey.findProgramAddressSync([seed1, seed2, seed3], mpl.PROGRAM_ID);
  console.log(_bump);
  // Accounts object containing necessary account information
  const accounts = {
    metadata: metadataPDA,
    mint,
    mintAuthority: fromWallet.publicKey,
    payer: fromWallet.publicKey,
    updateAuthority: fromWallet.publicKey
  };

  // Data object for creating or updating metadata
  const dataV2 = {
    name: "HOT Token",
    symbol: "HTN",
    uri: "https://gateway.pinata.cloud/ipfs/QmdrqGQrKXnigS2QUawJ1PTRMpvUMdoFapxYDbgbpF7wcc",
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null
  };

  // Creating the instruction based on the INITIALIZE flag
  let instruction;
  if (INITIALIZE) {
    const args = {
      createMetadataAccountArgsV3: {
        data: dataV2,
        isMutable: true,
        collectionDetails: null
      }
    };
    instruction = mpl.createCreateMetadataAccountV3Instruction(accounts, args);
  } else {
    const args = {
      updateMetadataAccountArgsV2: {
        data: dataV2,
        isMutable: true,
        updateAuthority: fromWallet.publicKey,
        primarySaleHappened: true
      }
    };
    instruction = mpl.createUpdateMetadataAccountV2Instruction(accounts, args)
  }
  // Creating a new transaction
  const tx = new Transaction();

  // Adding the instruction to the transaction
  tx.add(instruction);

  // Sending and confirming the transaction
  const txid = await sendAndConfirmTransaction(connection, tx, [fromWallet]);

  // Logging the transaction ID
  console.log(txid);

})();
