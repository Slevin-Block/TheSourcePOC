/* 
import rsa from 'js-crypto-rsa'
import { KEYUTIL } from 'jsrsasign'
import { Buffer } from 'buffer'
import { MirrorWallet } from '../utils/MirrorKeys'
import CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt'

export const testRsa = (wallet: MirrorWallet) => {

  // KEYS
  const privateKey = convertKey(wallet.privateKey.slice(2), 'privateKey')
  const publicKey = convertKey(wallet.publicKey.slice(2), 'publicKey')


  console.log(privateKey, publicKey)
  const message = "Hello Jack"
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey)
  const encrypted = encryptor.encrypt(message)
  console.log(encrypted)
  if (encrypted) {
    encryptor.setPrivateKey(privateKey)
    const decrypted = encryptor.decrypt(encrypted)
    console.log(decrypted)
  } else {
    console.error("Encryting fails")
  }
}


function convertKey(key: string, type: 'privateKey' | 'publicKey') {
  const keyBase64 = hexToBase64(key);
  const format = type === 'privateKey' ? "PRIVATE KEY" : "PUBLIC KEY"
  const keyPem = formatPEM(keyBase64, format);
  return keyPem
}

function hexToBase64(hex: string) {
  var hexBytes = CryptoJS.enc.Hex.parse(hex);
  var base64 = CryptoJS.enc.Base64.stringify(hexBytes);
  return base64;
}

function formatPEM(base64Data: string, type: string) {
  var maxLength = 64;
  var pem = "-----BEGIN " + type + "-----\n";
  while (base64Data.length > 0) {
    pem += base64Data.substring(0, maxLength) + "\n";
    base64Data = base64Data.substring(maxLength);
  }
  pem += "-----END " + type + "-----\n";
  return pem;
} */