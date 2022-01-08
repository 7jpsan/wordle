import { GuessLetterResult, Guess } from './wordle';
import chalk from 'chalk';

export class ConsolePrinter {
    // private chalk = new Chalk();
    public print(guess: Guess[]) {
        guess
            .map((item) => {
                return item.result.map(([letter, result]) => {
                    const paddedL = ` ${letter} `;
                    switch (result) {
                        case GuessLetterResult.Placed:
                            return chalk.bgGreen.black.bold(paddedL);
                        case GuessLetterResult.Misplaced:
                            return chalk.bgYellow.black.bold(paddedL);
                        default:
                            return chalk.bgGray.white.bold(paddedL);
                    }
                });
            })
            .forEach((guess, i) => {
                console.log(`${i + 1}: ${guess.join('')}\n`);
            });
    }

    public printShareable(guess: Guess[]) {
        guess
            .map((item) => {
                return item.result.map(([letter, result]) => {
                    switch (result) {
                        case GuessLetterResult.Placed:
                            return ' ' + chalk.bgGreen('  ');
                        case GuessLetterResult.Misplaced:
                            return ' ' + chalk.bgYellow('  ');
                        default:
                            return ' ' + chalk.bgGray('  ');
                    }
                });
            })
            .forEach((guess, i) => {
                console.log(`${i + 1}: ${guess.join('')}`.trim() + '\n');
            });
    }
}
