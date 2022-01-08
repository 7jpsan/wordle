import * as readline from 'readline';
export class InputHandler {
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    public async readWord() {
        return new Promise((resolve: (word: string) => void) => {
            this.rl.question('Enter your guess: ', (answer) => {
                resolve(answer.trim().toLowerCase());
            });
        });
    }
}
