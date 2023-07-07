import { algoRsa, cryptoConfig } from "./crypto.config";
import aes from 'aes-js';
import generatePassword from "./password";
import { pki } from "node-forge";
import { blake2b } from '@noble/hashes/blake2b';
import { sha256 } from '@noble/hashes/sha256';
import Pako from "pako";

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const encrypt = async (data: File, publicKey: pki.rsa.PublicKey) => {
  // Generate Randomly Generated Password (RGP)
  const RGP: string = generatePassword(cryptoConfig).password

  // RGP's asynchronous encryption
  const encryptedRGP = publicKey.encrypt(RGP, algoRsa.type);
  console.log(encoder.encode(RGP))
  console.log(encoder.encode(encryptedRGP))
  // File synchronous encryption with the RGP
  const encryptedFile = await cryptoFile.encrypt(data, RGP)

  generateFile(encryptedFile, data.name, true);

  // Return both, RGP for control and encryptedRGP for storage
  return { RGP, encryptedRGP };
}


export const decrypt = async (data: File, encryptedRGP: string, privateKey: pki.rsa.PrivateKey) => {

  // RGP decryption with the encryptedRGP
  const RGP = privateKey.decrypt(encryptedRGP, algoRsa.type);

  // File decryption 
  const decryptedFile = await cryptoFile.decrypt(data, RGP)
  generateFile(decryptedFile, data.name, false)
}

const cryptoFile = {
  encrypt: async (data: File, secret: string): Promise<Blob> => {
    return cryptoFile.generic(data, secret, 'encrypt')
  },
  decrypt: async (data: File, secret: string): Promise<Blob> => {
    return cryptoFile.generic(data, secret, 'decrypt')
  },
  generic: async (data: File, secret: string, operation: 'encrypt' | 'decrypt'): Promise<Blob> => {
    const array = new Uint8Array(await data.arrayBuffer());
    const key = encoder.encode(secret);
    const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5));
    const file = operation === 'encrypt' ? aesCtr.encrypt(array) :
              /* operation === 'decrypt' */ aesCtr.decrypt(array);
    return new Blob([file]);
  }
}

const generateFile = (blob: Blob, name: string, forEncryption: boolean = true) => {
  const filename = forEncryption ? `${name}.encrypted` : name.replace('.encrypted', '');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export const hash = (type: "sha" | "blake", value: string, dkLen:number = 32) => {
  let hasher
  let opt = {}
  if (type === 'sha') hasher = sha256
  if (type === 'blake') {
    hasher = blake2b
    opt = { dkLen }
  }
  if (hasher !== undefined) {
    const hash = hasher.create(opt)
      .update(value)
      .digest()

    return hash
  } else {
    return null
  }
}

export const compress = (input: string) => {

  // With Pako
  const outputArray = Pako.deflate(input);
  const output = decoder.decode(outputArray)
  console.log(output)
  console.log(input.length, output.length)
}
