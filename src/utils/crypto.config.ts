import { PasswordOptions } from "./password";

export const cryptoConfig: PasswordOptions = {
  length: 32, // 208 bits > AES(128)
  numbers: true,
  lowercase: true,
  uppercase: true,
  symbols: true,
  symbols_ext: true,
  exclude: [],
  balanced: true,
  double: false,
}

export const algoRsa = {
  keyLength : 2048,
  type : 'RSA-OAEP' as const,
}