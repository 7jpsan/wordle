import { DictionaryFactory } from './dictionary-factory';
import { SupportedLanguages, Language } from '../languages/langs';
import { readFileSync } from 'fs';
import { randBetween } from '../util/util';
import { WordsProvider } from './words-provider';

export class NotAWord {
    public constructor(public notInDict: string) {}
}
type GameState = {
    keyword: string;
    keywordLetters: string[];
    isSolved: boolean;
    playerGuesses: Guess[];
    usedLetters: string[];
    unusedLetters: string[];
};

export enum GuessLetterResult {
    Placed = 'Placed',
    Wrong = 'Wrong',
    Misplaced = 'Misplaced',
}
type LanguageConfig = Record<SupportedLanguages, Record<number, number>>;

export type Guess = { word: string; result: [string, GuessLetterResult][] };

export class Wordle {
    private languageConfig: LanguageConfig;
    private dict: Language;

    private gameOptions = {
        guesses: 6,
        language: SupportedLanguages.en,
        letters: 5,
    };

    private gameState: GameState = {
        keyword: '',
        keywordLetters: [],
        isSolved: false,
        playerGuesses: [],
        usedLetters: [],
        unusedLetters: Array.from(Array(26)).map((e, i) =>
            String.fromCharCode(i + 97)
        ),
    };

    public async guess(word: string) {
        if (
            this.isGameOver() ||
            word.length !== this.gameOptions.letters ||
            !(await this.dict.isWord(word))
        ) {
            return new NotAWord(word);
        }

        const keywordCopy = [...this.gameState.keywordLetters];
        // Remove all greens first
        const matchingResult = keywordCopy.reduce((acc, letter, i) => {
            if (letter === word.split('')[i]) {
                keywordCopy[i] = '';
                acc[i] = [letter, GuessLetterResult.Placed];
            }
            return acc;
        }, {} as Record<number, [string, GuessLetterResult]>);

        const theGuess = word.split('').map((letter, i, arr) => {
            if (matchingResult[i]) {
                return matchingResult[i];
            } else if (keywordCopy.indexOf(letter) > -1) {
                keywordCopy[keywordCopy.indexOf(letter)] = '';
                return [letter, GuessLetterResult.Misplaced];
            } else {
                return [letter, GuessLetterResult.Wrong];
            }
        }) as [string, GuessLetterResult][];

        this.gameState.playerGuesses.push({ result: theGuess, word });

        if (theGuess.every(([a, b]) => b === GuessLetterResult.Placed)) {
            this.gameState.isSolved = true;
        }

        return this.gameState.playerGuesses;
    }

    public keyword() {
        return this.isGameOver()
            ? this.gameState.keyword
            : '*'.repeat(this.gameOptions.letters);
    }

    public isSolved() {
        return this.gameState.isSolved;
    }
    public isGameOver() {
        return (
            this.gameState.isSolved === true ||
            this.gameState.playerGuesses.length >= this.gameOptions.guesses
        );
    }

    private constructor(
        dictFactory: DictionaryFactory,
        private wordsProvider: WordsProvider,
        language: SupportedLanguages
    ) {
        this.languageConfig = JSON.parse(
            readFileSync(`${__dirname}/../generated/config.json`).toString()
        );
        this.dict = dictFactory.create(language);
    }

    private async init(options: {
        language?: SupportedLanguages;
        guesses?: number;
        letters?: number;
    }): Promise<this> {
        this.gameOptions = {
            ...this.gameOptions,
            ...options,
        };
        const { language, letters } = this.gameOptions;
        const wordToGuessIndex = randBetween(
            0,
            this.languageConfig[language][letters]
        );
        this.gameState.keyword = await this.wordsProvider.getWordAt({
            lang: language,
            letters,
            lineNumber: wordToGuessIndex,
        });
        this.gameState.keywordLetters = this.gameState.keyword.split('');
        console.log('Guessing: ', '*'.repeat(letters));
        return this;
    }

    public static async create(
        p: {
            language?: SupportedLanguages;
            guesses?: number;
            letters?: number;
        } = {
            guesses: 6,
            language: SupportedLanguages.en,
            letters: 5,
        }
    ) {
        return new Wordle(
            new DictionaryFactory(),
            new WordsProvider(),
            p.language || SupportedLanguages.en
        ).init(p);
    }
}
