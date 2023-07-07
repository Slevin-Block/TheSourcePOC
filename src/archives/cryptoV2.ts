/* import { algo, cryptoConfig } from "./crypto.config";
import CryptoJS from "crypto-js"
import generatePassword from "./password";

const encoder = new TextEncoder()

export const encryptForV2 = async (data: File, publicKey: string) => {
  // Generate Randomly Generated Password (RGP)
  console.log(publicKey)
  const { password: RGP } = generatePassword(cryptoConfig)
  const RGPIv = CryptoJS.lib.WordArray.random(16);
  const fileIv = CryptoJS.lib.WordArray.random(16);
  const encryptedRGP = CryptoJS.AES.encrypt(RGP, publicKey, { iv: RGPIv });
  const encryptedRGPString = `${RGPIv.toString()}${fileIv.toString()}${encryptedRGP.toString()}`;

  //* -----------------------------------------------------------
  //* SEND encryptedRGP to Blockchain, need privateKey to decrypt
  //* -----------------------------------------------------------
  console.log(`ENCODER`)
  console.log(`RGP : ${RGP}`)
  console.log(`RGPIv : ${RGPIv}`)
  console.log(`FileIv : ${fileIv}`)
  console.log(`EncryptedRGP : ${encryptedRGP}`)
  console.log(`EncryptedRGPString : ${encryptedRGPString}`)


  // Encoding file from deriveKey
  const derivedKey = await getEncryptionKey(RGP);
  const file = await data.arrayBuffer();
  const encryptedFile = await crypto.subtle.encrypt(
    { ...algo, iv: encoder.encode(fileIv.toString()) },
    derivedKey,
    file
  );
  generateFile(encryptedFile, data.name, true);
  
  return { RGP, encryptedRGPString };
}


export const decryptForV2 = async (data: File, encryptedRGPString: string, privateKey: string) => {
  console.log(privateKey)
  // RGP and Ivs recuperation
  const RGPIv = encryptedRGPString.toString().substring(0, 32);
  const fileIv = encryptedRGPString.toString().substring(32, 64);
  const encryptedRGP = encryptedRGPString.toString().substring(64);
  const RGP = CryptoJS.AES
    .decrypt(encryptedRGP, privateKey, { iv: CryptoJS.enc.Hex.parse(RGPIv) })
    .toString(CryptoJS.enc.Utf8);

  console.log(`DECRYPT`)
  console.log(`RGP : ${RGP}`)
  console.log(`RGPIv : ${RGPIv}`)
  console.log(`FileIv : ${fileIv}`)
  console.log(`EncryptedRGP : ${encryptedRGP}`)
  console.log(`EncryptedRGPString : ${encryptedRGPString}`)


  // Decrypt File
  const derivedKey = await getEncryptionKey(RGP);
  const encryptedFile = await data.arrayBuffer();
  const file = await crypto.subtle.decrypt(
    { ...algo, iv: encoder.encode(fileIv) },
    derivedKey,
    encryptedFile
  )
  console.log("After file generation")
  generateFile(file, data.name.replace('.encrypted', ''), false)
}


const getEncryptionKey = async (key: string) => {
  // Generate masterPassword from RGP
  const masterPassword = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Generate the derivedKey from masterPassword
  const salt = encoder.encode(Date.now().toString())
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1000,
      hash: { name: 'SHA-1' }
    },
    masterPassword,
    algo,
    false,
    ['encrypt', 'decrypt']
  )
  return derivedKey;
}



const generateFile = (content: ArrayBuffer, name: string, encrypt: boolean = true) => {
  const filename = encrypt ? `${name}.encrypted` : name;
  const blob = new Blob([content])
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
*/
