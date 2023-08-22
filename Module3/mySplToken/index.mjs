import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer
} from '@solana/spl-token';

(async () => {
  // // Step 1: Connect to cluster and generate a new Keypair

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // const fromWallet = Keypair.generate();
  // const toWallet = Keypair.generate();

  // // To get a wallet secret key from its private key
  // console.log(fromWallet.secretKey);
  // console.log(toWallet.secretKey);

  const fromSecretKey = new Uint8Array([
    81, 116,  54, 171, 219, 235,  21, 120, 235,  38,  22,
    23, 241,  31,  34, 196,  39,  94, 123, 225, 248, 153,
    15, 113,  78,  73, 117, 207, 168, 215, 138, 138, 120,
    188, 255,  76,  30, 240, 242,  69, 167, 149, 110,  68,
    224,  94, 169, 130, 224, 151, 253, 182, 191,  46, 109,
    66,  14, 100, 123, 111,  16, 117,  69, 208
  ]);

  const toSecretKey = new Uint8Array([
    213, 207, 209, 152, 172, 226, 161, 175,  62,  83,  89,
    176,  83, 215,  65,  73,  44, 250,  34,  24,  33,  83,
    118, 189, 111,  47,  55, 169, 180,  43, 150, 206, 226,
    224,  75, 203, 212,  61, 225,  69, 201, 210, 224,  44,
    93, 120, 146,  77,  75, 111,   5, 153, 216, 198, 225,
    59,  33, 163, 116,  43, 114, 234,  86, 215
  ]);

  const fromWallet = Keypair.fromSecretKey(fromSecretKey);
  const toWallet = Keypair.fromSecretKey(toSecretKey);

  // Step 2: Airdrop SOL into your from wallet

  const fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    LAMPORTS_PER_SOL
  );

  // Wait for airdrop confirmation
  await connection.confirmTransaction(
    fromAirdropSignature,
    { commitment: "confirmed" }
  );


  // Step 3: Create new token mint and get the token account of the fromWallet address

  //If the token account does not exist, create it
  const mint = await createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9
  );

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    fromWallet.publicKey
  );


  //Step 4: Mint a new token to the from account

  let signature = await mintTo(
    connection,
    fromWallet,
    mint,
    fromTokenAccount.address,
    fromWallet.publicKey,
    5000000000,
    []
  );


  console.log("================================================");
  console.log('mint tx:', signature);
  console.log("================================================");
  console.log("Mint address is", mint.toString());

  //Step 5: Get the token account of the to-wallet address and if it does not exist, create it

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    fromWallet,
    mint,
    toWallet.publicKey
  );
  console.log("================================================");
  console.log(`To token address/(account address) is ${toTokenAccount.address}`);

  //Step 6: Transfer the new token to the to-wallet's token account that was just created

  // Transfer the new token to the "toTokenAccount" we just created
  signature = await transfer(
    connection,
    fromWallet,
    fromTokenAccount.address,
    toTokenAccount.address,
    fromWallet.publicKey,
    3000000000,
    []
  );

  console.log("================================================");
  console.log('transfer tx:', signature);

})();
