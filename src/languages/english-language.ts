import { Language, SupportedLanguages } from './langs';

// import wordlist from 'wordlist-english'
// TODO: Write a d.ts file
const wordlist = require('wordlist-english');

export class EnglishLanguage extends Language {
    protected _lang = SupportedLanguages.en;
    private englishWords = wordlist['english'] as string[];

    public async isWord(word: string) {
        return this.englishWords.indexOf(word) > -1;
    }

    public isWordSync(word: string) {
        return this.englishWords.indexOf(word) > -1;
    }
}
