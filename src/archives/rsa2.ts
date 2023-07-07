/* 
import { pki, random } from "node-forge";
//import {pbkdf2_1} from '@noble/hashes/pbkdf2'
import ethers from "ethers/lib/utils.js";
export const autonomousRsa = async (mnemonic : string) => {
  // https://stackoverflow.com/questions/72047474/how-to-generate-safe-rsa-keys-deterministically-using-a-seed

  // Generate mnemonic
  console.log("Etape 1")
  const seed = ethers.mnemonicToSeed(mnemonic);

  // Create deterministic PRNG function
  console.log("Etape 2")
  const prng = random.createInstance();
  prng.seedFileSync = () => seed

  // Generating keypair
  console.log("Etape 3")
  const keys = pki.rsa.generateKeyPair({ bits: 4096, prng, workers: 2 })
  const publicKey = keys.publicKey
  const privateKey = keys.privateKey
  console.log(publicKey.n, privateKey.n)

  console.log("Etape 4")
  const message = "Hello Buddy";
  const encryptedMessage = publicKey.encrypt(message, 'RSA-OAEP');
  const decryptedMessage = privateKey.decrypt(encryptedMessage, 'RSA-OAEP')
  console.log(decryptedMessage)
} */