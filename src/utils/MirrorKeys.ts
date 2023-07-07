import { ethers } from 'ethers';
import { mnemonicToSeed } from "ethers/lib/utils.js";
import { useSignMessage } from 'wagmi';
import { pki, random } from "node-forge";
import { algoRsa } from './crypto.config';
import { hash } from './crypto';
import { bytesToAddress } from './utils';

export interface MirrorKeys {
  controlAddress: string;
  privateKey: pki.rsa.PrivateKey;
  publicKey: pki.rsa.PublicKey;
}

export const useMirrorKeys = () => {
  const { signMessageAsync } = useSignMessage()

  const mirrorAccount = async (password: string) => {
    let mainPassword

    // Sign password to generate mainPassword
    try {
      mainPassword = await signMessageAsync({ message: password })
    } catch (err) {
      throw console.log('mainPassword generation abord')
    }

    // Create baseAccount
    const baseAccount = hash('blake', mainPassword)

    // Create asymetric Keys
    if (baseAccount) {
      const mnemonic = ethers.utils.entropyToMnemonic(baseAccount)
      const seed = mnemonicToSeed(mnemonic)
      const prng = random.createInstance();
      prng.seedFileSync = () => seed
      const keys = pki.rsa.generateKeyPair({ bits: algoRsa.keyLength, prng, workers: 2 })
      const myhash = hash('blake', keys.publicKey.n.toString(), 20) ?? new Uint8Array()
      const myMirrorKeys: MirrorKeys =
      {
        controlAddress: bytesToAddress(myhash),
        privateKey: keys.privateKey,
        publicKey: keys.publicKey,
      }
      return myMirrorKeys
    } else {
      throw console.log("Error Mirror Account")
    }
  }

  return { mirrorAccount }
}