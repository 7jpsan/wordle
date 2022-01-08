import { SupportedLanguages } from '../languages/langs';
import { createReadStream } from 'fs';

export class WordsProvider {
    private basePath = `${__dirname}/../generated`;

    public async getWordAt({
        lineNumber,
        lang,
        letters,
    }: {
        lang: SupportedLanguages;
        letters: number;
        lineNumber: number;
    }) {
        const stream = createReadStream(
            `${this.basePath}/${lang}/${letters}.txt`,
            {
                flags: 'r',
                encoding: 'utf-8',
            }
        );
        let fileData = '';
        return new Promise(
            (
                resolve: (word: string) => void,
                reject: (error: Error) => void
            ) => {
                stream.on('error', function () {
                    reject(new Error('Stream errored'));
                });

                stream.on('end', function () {
                    reject(new Error('Stream reached EOL'));
                });
                stream.on('data', function (data) {
                    fileData += data;

                    const lines = fileData.split('\n');

                    if (lines.length >= +lineNumber) {
                        stream.destroy();
                        resolve(lines[+lineNumber]);
                    }
                    // Add this else condition to remove all unnecesary data from the variable
                    else {
                        fileData = Array(lines.length).join('\n');
                    }
                });
            }
        );
    }
}
