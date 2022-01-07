import { readFileSync, createWriteStream, rmdirSync, existsSync, mkdirSync } from "fs";

import { EnglishLanguage } from "../../src/languages/langs";


const engLang = new EnglishLanguage();

const autogenConfig = {
  minLength: 5,
  maxLength: 9,
  languages: [
    { lang: 'en', dict: engLang.dict.bind(engLang) },
    // { lang: 'es', dict: (word: string) => { return false } },
    // { lang: 'pt', dict: (word: string) => { return false } },
    // { lang: 'it', dict: (word: string) => { return false } }
  ],
  languageSourceDir: `${__dirname}/../../assets/lang`,
  outputBaseDir: `${__dirname}/../../generated`
};

const { languageSourceDir, languages, maxLength, minLength, outputBaseDir } = autogenConfig;

// Clear old files and regen the output for the wordlist
if (existsSync(outputBaseDir)) {
  rmdirSync(outputBaseDir, { recursive: true });
}

// Do the same for all languages
for (const { dict, lang } of languages) {

  const enWords = readFileSync(`${languageSourceDir}/${lang}/${lang}.txt`).toString('utf-8').split('\n');

  const acc = Array.from({ length: maxLength - minLength }).map(() => [] as string[]);

  const regularOnly = new RegExp(/^[a-z]+$/, 'gi');

  const dist = enWords
    .filter(x => x.length >= minLength && x.length < maxLength)
    .filter(x => regularOnly.test(x))
    .filter(x => dict(x))
    .reduce((acc, next) => {
      acc[next.length - minLength].push(next);
      return acc;
    }, acc);

  for (let i in dist) {
    // Create the folder for the language
    mkdirSync(`${outputBaseDir}/${lang}`, { recursive: true });

    // Big file, write as stream
    const ws = createWriteStream(`${outputBaseDir}/${lang}/${(+i) + minLength}.txt`);
    // write each value of the array on the file breaking line
    dist[+i].forEach(value => ws.write(`${value}\n`));

    // close the stream
    ws.end();
  }
}





export class WordGen {
  public static get(letters: number) {

  }
}