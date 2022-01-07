// import wordlist from 'wordlist-english'
// TODO: Write a d.ts file
const wordlist = require('wordlist-english');
interface Language {
  lang: string;
  dict: (word: string) => boolean
}

export class EnglishLanguage implements Language {
  public lang = 'en';
  public englishWords = wordlist['english'] as string[];

  public constructor() { }
  public dict(word: string) {
    return this.englishWords.indexOf(word) > -1;
  }
}