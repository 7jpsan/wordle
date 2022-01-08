import { ConsolePrinter } from './console-printer';
import { InputHandler } from './input-handler';
import { Wordle, Guess, NotAWord } from './wordle';

const inputHandler = new InputHandler();

export async function playGame({
    wordle,
    printer,
}: {
    wordle: Wordle;
    printer: ConsolePrinter;
}) {
    let prevResult: Guess[] = [];
    while (!wordle.isGameOver()) {
        const guess = await inputHandler.readWord();
        const result = await wordle.guess(guess);
        if (result instanceof NotAWord) {
            console.log('Not a word!');
            printer.print(prevResult);
        } else {
            printer.print(result);
            prevResult = result;
        }
    }
    if (wordle.isSolved()) {
        console.log('WOW!! CONGRATULATIONS!!');
    } else {
        console.log('Word was: "%s"', wordle.keyword());
        console.log('OOops! BETTER LUCK NEXT TIME!!');
    }
    printer.printShareable(prevResult);
    return;
}
