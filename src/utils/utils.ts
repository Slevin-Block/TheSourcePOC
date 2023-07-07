import {split, combine} from 'shamir-secret-sharing';
import { LoremIpsum } from "lorem-ipsum";
import lzString from 'lz-string'
import generateRandom from './random';


const base = 4    // number of caracters keeped in start and end
const min = 2 + 3  // corresponding to ... and starting 0x
const ref = min+2*base; // 0xBASE...BASE
const encoder = new TextEncoder()
const decoder = new TextDecoder()

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

export const minify = (str : string, lenght : number =  ref) => {
  const base = Math.floor((lenght - min)/2)
  if (str.length <= (base*2 + min)) return str;
  const start = str.slice(0,base+2)
  const end = str.slice(str.length-base)
  return `${start}...${end}`
}

export const compress = (data: string) => {
  const compressed = lzString.compress(data)
  console.log('Compressed : ', encoder.encode(compressed))
  const decompressed = lzString.decompress(compressed)
  console.log('Decompressed : ', encoder.encode(decompressed))

}

/**
 * 
 * @param str : The secret string to protect by splitting 
 * @param shares : the number of pieces the secret string will be splitted 
 * @param threshold : the minimum number of piece needed to recreate the secret string
 * The combine process is charging with one more piece than expected to avoid errors on long strings. 
 * That's why the threshold can't be egal to the shares. It's limited by shares - 1.
 */
export const splitSSS = async (str: string = lorem.generateSentences(30000), shares : number = 10, threshold : number = 3) => {
  if (threshold < 3)      throw console.error('Threshold needes to be geater than 3')
  if (shares < threshold +1) throw console.error('Shares to low comparing threshold') // Test with one more to avoid error

  // Encoding from string to Uint8Array
  const secret = encoder.encode(str)
  
  // Splitting Action
  const chunks = await split(secret, shares, threshold);

  // Generating random pieces 
  const {array : keepedIndex, error} = generatingIndexArray(shares, threshold+1); // Keep one more to combine more easily and avoid error
  if (error) throw console.error('Error Random Generating Indexes Array')
  const keepedChunks = chunks.filter((_, index) => keepedIndex.includes(index))

  // Combine pieces
  const reconstructed = await combine([...keepedChunks]);

  // Decoding from Uint8Array to string
  const decodedSecret = decoder.decode(reconstructed)

  // For controle
  if (str !== decodedSecret) throw console.log("Shamir Secret Sharing fail", str,decodedSecret)
  console.log("Shamir Secret Sharing successful")
  
}

const generatingIndexArray = (lenght:number, qty :number) : {array : number[], error:boolean}=> {
  const keepedIndex = Array(qty).fill(-1)
  for (let i=0; i< qty; i++){
    let rnd : number | undefined;
    let turns = 0
    const turnLimit = 50
    let needAnotherTurn : boolean = true;
    do {
      rnd = generateRandom(0, lenght)
      turns ++
      const isAlreadyDraw = keepedIndex.includes(rnd)
      const isError = rnd === undefined
      const tooManyTurns = turns > turnLimit
      needAnotherTurn = (isAlreadyDraw || isError) && !tooManyTurns
    } while (needAnotherTurn)
    if (rnd === undefined || turns > turnLimit) break;
    keepedIndex[i] = rnd
  }
  
  return {
    array : keepedIndex,
    error : keepedIndex.includes(-1)
  }
}

export const bytesToAddress = (input: Uint8Array) : string => {
  if ( input.length !== 20 ) throw console.error("Wrong size of bytes array")
  const hexString = Array.from(input)
  .map(byte => byte.toString(16).padStart(2, '0'))
  .join('');
  return `0x${hexString}`
}
