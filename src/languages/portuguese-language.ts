import { Language, SupportedLanguages } from './langs';

// import wordlist from 'wordlist-english'
// TODO: Write a d.ts file
const wordsPt = require('words-pt');

export class PortugueseLanguage extends Language {
    protected _lang = SupportedLanguages.pt;
    private portugueseWords: string[] = [];

    public constructor() {
        super();
    }

    private async initWords() {
        return new Promise((resolve: (arg: void) => void, reject) => {
            if (this.portugueseWords.length === 0) {
                wordsPt.init({ removeNames: true }, () => {
                    this.portugueseWords = wordsPt.getArray();
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    public async isWord(word: string) {
        if (this.portugueseWords.length === 0) {
            await this.initWords();
        }
        return this.portugueseWords.indexOf(word) > -1;
    }

    public isWordSync(word: string) {
        return this.portugueseWords.indexOf(word) > -1;
    }
}
