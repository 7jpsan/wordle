import { Wordle } from './src/engine/wordle';
import { ConsolePrinter } from './src/engine/console-printer';
import { SupportedLanguages } from './src/languages/langs';
import { playGame } from './src/engine/play-game';

import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
    .options({
        language: { choices: ['en', 'pt'], default: 'en', alias: 'l' },
        guesses: { type: 'number', default: 6, alias: 'g' },
        howManyLetters: { type: 'number', default: 5, alias: 'x' },
    })
    .parseSync();

const consolePrinter = new ConsolePrinter();
Wordle.create({
    guesses: argv.guesses,
    letters: argv.howManyLetters,
    language: SupportedLanguages[argv.language as SupportedLanguages],
})
    .then((wordle) => {
        return playGame({
            wordle,
            printer: consolePrinter,
        });
    })
    .then(() => process.exit(0))
    .catch(console.error);
