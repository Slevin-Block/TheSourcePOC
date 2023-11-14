import generateRandom from './random';
import { LoremIpsum } from "lorem-ipsum";
import { split, combine } from 'shamir-secret-sharing';
import { hash } from './crypto'

const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8')

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

/**
 * 
 * @param str : The secret string to protect by splitting 
 * @param shares : the number of pieces the secret string will be splitted 
 * @param threshold : the minimum number of piece needed to recreate the secret string
 * The combine process is charging with one more piece than expected to avoid errors on long strings. 
 * That's why the threshold can't be egal to the shares. It's limited by shares - 1.
 */

export const splitSSS = async (str: string = lorem.generateSentences(100000), shares: number = 10, threshold: number = 5, debrief: boolean = false) => {
  if (threshold < 3) throw console.error('Threshold needes to be greater than 3')
  if (shares < threshold) throw console.error('Shares to low comparing threshold')

  // Encoding from string to Uint8Array
  const secret = encoder.encode(str)

  // Splitting action
  const chunks = await split(secret, shares, threshold);

  // Generating random pieces 
  const { array: keepedIndex, error } = generatingIndexArray(shares, threshold);
  if (error) throw console.error('Error Random Generating Indexes Array')
  const keepedChunks = chunks.filter((_, index) => keepedIndex.includes(index))

  // Combine pieces
  const reconstructed = await combine([...keepedChunks]);

  // Decoding from Uint8Array to string
  const decodedSecret = decoder.decode(reconstructed)

  // For controle
  if (str !== decodedSecret) throw console.log("Shamir Secret Sharing fail", str, decodedSecret)

  if (debrief) {
    console.log("YOUR MESSAGE/PASSWORD : ", str)
    console.log("Length of : ", secret.length)
    console.log(`\nCHUNKS : `)
    console.table((chunks.map((chunk) => {
      const chunk_slice = Array.from(chunk.slice(0, 10))
      const str = chunk_slice.map(value => String.fromCharCode(value + 48)).join('')
      return { expr: `${str}...`, length: chunk.length }
    })))
    console.log(`\nKEEPED CHUNKS : `)
    console.log(`${threshold} random chunks`)
    console.table((keepedChunks.map((chunk, index) => {
      const chunk_slice = Array.from(chunk.slice(0, 10))
      const str = chunk_slice.map(value => String.fromCharCode(value + 48)).join('')
      return { id: keepedIndex[index], expr: `${str}...` }
    })))
    console.log("RECOMPOSED MESSAGE/PASSWORD : ", decodedSecret)
  }
  console.log("Shamir Secret Sharing successful")
  console.log("Length secret (ko): ", str.length / 1000)

}

const generatingIndexArray = (lenght: number, qty: number): { array: number[], error: boolean } => {
  const keepedIndex = Array(lenght).fill(0).map((_, index) => index);
  for (let i = 0; i < lenght - qty; i++) {
    const rnd = generateRandom(0, keepedIndex.length - 1)
    if (rnd !== undefined) keepedIndex.splice(rnd, 1)
    else i--;
  }

  return {
    array: keepedIndex,
    error: keepedIndex.includes(-1)
  }
}