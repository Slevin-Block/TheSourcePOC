import random from "./random";

export interface PasswordOptions {
    length: number;
    numbers?: boolean;              // 10
    lowercase?: boolean;            // 26
    uppercase?: boolean;            // 26
    symbols?: boolean;              //  8
    symbols_ext?: boolean;          // 20
    exclude?: (string | number)[];  // Array of exclude caracters, symbols or numbers
    balanced? : boolean;            // equality roll between types of caracters 
    double? : boolean;              // double doesn't accepted
}

const initOptions : PasswordOptions = {
    length: 12,
    numbers: true,
    lowercase: true,
    uppercase: true,
    symbols: true,
    symbols_ext : true,
    exclude : [],
    balanced : true,
    double : false,
}

type Chars = string | number;

export default function generatePassword(propsOptions?: PasswordOptions) {

    const options = { ...initOptions, ...propsOptions };
    // Arrays initialisation
    const numbersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        .filter(c => !options.exclude?.includes(c));  // 10
    const characterCodes = Array.from(Array(26)).map((_e, i) => i + 97)
        .filter(c => !options.exclude?.includes(c));
    const lowerCaseLetters = characterCodes.map((code) => String.fromCharCode(code))
        .filter(c => !options.exclude?.includes(c));  // 26
    const upperCaseLetters = lowerCaseLetters.map((letter) => letter.toUpperCase())
        .filter(c => !options.exclude?.includes(c));  // 26
    const symbolsArray = ['!', '?', '@', '#', '$', '&','*','%'] // 8
        .concat(!options.symbols_ext ? [] : 
          ['~','{','}','(',')','[',']','{','}','+','-','=','_','^','<','>',':','.',';','/'] // 20
        )
        .filter(c => !options.exclude?.includes(c));
    // Generate CharsRef array according to options valuese
    let alphabet: Chars[][] = []
    if (options.numbers) alphabet = [...alphabet, [...numbersArray]]
    if (options.lowercase) alphabet = [...alphabet, [...lowerCaseLetters]]
    if (options.uppercase) alphabet = [...alphabet, [...upperCaseLetters]]
    if (options.symbols) alphabet = [...alphabet, [...symbolsArray]]

    const baseLength = alphabet.flat().length;
    // Create base value, at least one of each
    let password: Chars[] = [];
    if (alphabet.length <= options.length) {
        for (let ref of alphabet) {
            const rnd = random(0, ref.length - 1)
            const index = password.length === 0 ? 0 : random(0, password.length)
            if (rnd !== undefined && index !== undefined) password.splice(index, 0, ref[rnd])
        }
    }

    //Generate password
    if (options.balanced){
        for (let i = password.length; i < options.length; i++) {
          let arr;
          let rnd;
          let index;
          do {
            arr = random(0, alphabet.length - 1);
            if (arr === undefined) throw console.log('Error : wrong random generation');
            rnd = random(0, alphabet[arr].length - 1);
            index = password.length === 0 ? 0 : random(0, password.length);
            //if (rnd !== undefined && index !== undefined) console.log([alphabet[arr][rnd], arr, rnd, index])
            if (rnd === undefined || index === undefined) throw console.log('Error : wrong random generation');

          } while (password.includes(alphabet[arr][rnd]) && !options.double);
          password.splice(index, 0, alphabet[arr][rnd]);
        }
    }else{
        const charsRef = alphabet.flat();
        for (let i = password.length; i < options.length; i++) {
          let rnd;
          let index;
          do{
            rnd = random(0, charsRef.length - 1);
            index = password.length === 0 ? 0 : random(0, password.length);

            if (rnd === undefined || index === undefined) throw console.log('Error : wrong random generation');
          } while (password.includes(charsRef[rnd]) && !options.double);
            password.splice(index, 0, charsRef[rnd]);
        }
    }


    return {password : password.join(''), baseLength};
}