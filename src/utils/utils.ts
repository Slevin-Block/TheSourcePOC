
import lzString from 'lz-string'


const base = 4    // number of caracters keeped in start and end
const min = 2 + 3  // corresponding to ... and starting 0x
const ref = min + 2 * base; // 0xBASE...BASE
const encoder = new TextEncoder()


export const minify = (str: string, lenght: number = ref) => {
  const base = Math.floor((lenght - min) / 2)
  if (str.length <= (base * 2 + min)) return str;
  const start = str.slice(0, base + 2)
  const end = str.slice(str.length - base)
  return `${start}...${end}`
}

export const compress = (data: string) => {
  const compressed = lzString.compress(data)
  console.log('Compressed : ', encoder.encode(compressed))
  const decompressed = lzString.decompress(compressed)
  console.log('Decompressed : ', encoder.encode(decompressed))

}

export const bytesToAddress = (input: Uint8Array): string => {
  if (input.length !== 20) throw console.error("Wrong size of bytes array")
  const hexString = Array.from(input)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  return `0x${hexString}`
}