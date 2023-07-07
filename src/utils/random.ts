import seedrandom from 'seedrandom';
import * as math from 'mathjs';
import sjcl from 'sjcl';
/* import randomBytes from 'randombytes'; */

type RandomProvider = 'WebCrypto' | 'Math.random' | 'SJCL' /* | 'RandomBytes' */;

export default function generateRandom(min: number, maxIncluded: number, provider: RandomProvider = 'WebCrypto')
  : number | undefined /* { provider: string, value: number | undefined } */ {
  const max = maxIncluded
  let returnObj: { provider: string, value: number | undefined } =
  {
    provider: "none",
    value: undefined,
  }

  // Vérifier si l'API Web Crypto est disponible
  if (window.crypto && window.crypto.getRandomValues && provider === 'WebCrypto') {
    // Générer un tableau de 8 octets de nombres aléatoires
    const seed = new Uint8Array(16);
    window.crypto.getRandomValues(seed);

    // Convertir les octets en un nombre décimal entre 0 et 1
    const generator = seedrandom(Array.from(seed).join());
    const randomNum = generator();
    returnObj = {
      provider: "WebCrypto",
      value: Math.floor(randomNum * (max - min + 1)) + min,
    }
  } else if (provider === 'Math.random') {
    returnObj = {
      provider: "Math.random",
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    }
  } else if (provider === 'SJCL') {
    const randomWords = sjcl.random.randomWords(1);
    const rnd = Math.abs(Number(randomWords)) % max + min;
    returnObj = {
      provider: "SJCL",
      value: rnd,
    }
  }

  return returnObj.value
}

export const testRandom = (nbr: number, min: number, max: number, provider: RandomProvider | 'all' = 'all') => {
  
  const providers: RandomProvider[]= provider === 'all' ? ['WebCrypto', 'Math.random', 'SJCL'] : [provider];
  let result: (number | string) [][]= [['PROVIDER', `FOR ${nbr} ROLLS`]];
  for (let provider of providers) {
    const ranking = Array(max - min + 1).fill(0);
    for (let i = 0; i < nbr; i++) {
      const rnd = generateRandom(min, max, provider);
      if (rnd !== undefined) {
        ranking[rnd - min]++;
      }
    }
    //console.table(ranking)
    //const tmpArr = ranking.sort((a, b) => a - b)
    //console.log(tmpArr.at(-1) - tmpArr.at(0))
    //console.log(`Standard Deviation for ${nbr} tests : ${((tmpArr.at(-1)-tmpArr.at(0))/nbr*100).toFixed(2)}%`)
    //console.log(`Standard Deviation for ${nbr} tests : ${math.std(ranking)}`);
    //console.log(`Expected for ${nbr} tests : ${nbr / (max - min + 1)}`);
    result.push([`${provider}`, Math.round(Number(math.std(ranking))*100)/100]);
  }
  console.table(result);
}