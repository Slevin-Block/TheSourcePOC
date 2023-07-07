/* import generatePassword from "../utils/password";
import CryptoJS from "crypto-js"
import { blake2b } from '@noble/hashes/blake2b';
import { sha256 } from '@noble/hashes/sha256';
import { cryptoConfig } from "../utils/crypto.config";


export const encryptFor = async (data: File, key: string) => {

  // Generate RGP
  const { password: RGP } = generatePassword(cryptoConfig)

  // Encrypt RGP
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(RGP, key, { iv });
  const encryptRGP = `${iv.toString()}${encrypted.toString()}`;

  // Encrypt File
  const reader = new FileReader();
  reader.readAsArrayBuffer(data);
  const fileData = await new Promise<ArrayBuffer>((resolve) => {
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        throw new Error("Invalid file data");
      }
    };
  });
  const fileWordArray = CryptoJS.lib.WordArray.create(Array.from(new Uint8Array(fileData)));
  const fileIv = CryptoJS.lib.WordArray.random(16);
  const encryptedFile = CryptoJS.AES.encrypt(fileWordArray.toString(CryptoJS.enc.Utf8), RGP, { iv: fileIv });
  const encryptedFileContent = `${fileIv.toString()}${encryptedFile.toString()}`;
  // Download encrypted file
  generateEncodedFile(encryptedFileContent, data.name, true)
  return { RGP, encryptRGP }
}

export const decryptFor = async (data: File | string, key: string) => {

  if (typeof data === "string") {
    const ivHex = data.substring(0, 32);
    const ivWordArray = CryptoJS.enc.Hex.parse(ivHex);

    const encryptedContent = data.substring(32);
    const wordArray = CryptoJS.AES.decrypt(encryptedContent, key, { iv: ivWordArray });
    const decryptedString = CryptoJS.enc.Utf8.stringify(wordArray);
    return decryptedString;
  } else {
    const reader = new FileReader();
    reader.readAsArrayBuffer(data);
    const fileData = await new Promise<ArrayBuffer>((resolve) => {
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          throw new Error("Invalid file data");
        }
      };
    });
    const fileWordArray = CryptoJS.lib.WordArray.create(Array.from(new Uint8Array(fileData)));
    const tempString: string = fileWordArray.toString(CryptoJS.enc.Utf8).replace(/\0/g, '')
    const iv = CryptoJS.enc.Hex.parse(tempString.substring(0, 32));
    const file = tempString.slice(32)
    const wordArray = CryptoJS.AES.decrypt(file, key, { iv })
    const res = CryptoJS.enc.Utf8.stringify(wordArray).replace(/\0/g, '')
    generateEncodedFile(res, data.name.replace('.encrypted', ''), false)
  }
}


const generateEncodedFile = (content: string, name: string, encrypt: boolean = true) => {
  const blob = new Blob([content], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob);
  const filename = encrypt ? `${name}.encrypted` : name;
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

export const hash = (type: "sha" | "blake", value: string) => {
  let hasher
  let opt = {}
  if (type === 'sha') hasher = sha256
  if (type === 'blake') {
    hasher = blake2b
    opt = { dkLen: 32 }
  }
  if (hasher !== undefined) {
    const hash = hasher.create(opt)
      .update(value)
      .digest()

    return hash
  } else {
    return null
  }
} */