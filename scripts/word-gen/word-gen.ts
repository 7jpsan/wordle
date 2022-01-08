import {
    readFileSync,
    createWriteStream,
    rmdirSync,
    existsSync,
    mkdirSync,
    writeFileSync,
} from 'fs';

import { EnglishLanguage } from '../../src/languages/english-language';
import { PortugueseLanguage } from '../../src/languages/portuguese-language';

const ptLang = new PortugueseLanguage();
async function setupLanguages() {
    await ptLang.isWord('ola');
    const autogenConfig = {
        minLength: 5,
        maxLength: 9,
        languages: [
            new EnglishLanguage(),
            ptLang,
            // { lang: 'es', dict: (word: string) => { return false } },
            // { lang: 'it', dict: (word: string) => { return false } }
        ],
        languageSourceDir: `${__dirname}/../../assets/lang`,
        outputBaseDir: `${__dirname}/../../src/generated`,
    };

    const {
        languageSourceDir,
        languages,
        maxLength,
        minLength,
        outputBaseDir,
    } = autogenConfig;

    // Clear old files and regen the output for the wordlist
    if (existsSync(outputBaseDir)) {
        rmdirSync(outputBaseDir, { recursive: true });
    }

    const langsConfig: Record<string, Record<number, number>> = {};

    // Do the same for all languages
    for (const langImpl of languages) {
        const { lang } = langImpl;
        console.log(`Generating words for ${lang}`);
        const enWords = readFileSync(`${languageSourceDir}/${lang}/${lang}.txt`)
            .toString('utf-8')
            .split('\n');

        const acc = Array.from({ length: maxLength - minLength }).map(
            () => [] as string[]
        );

        const regularOnly = new RegExp(/^[a-z]+$/, 'gi');

        const dist = enWords
            .filter(
                (word) => word.length >= minLength && word.length < maxLength
            )
            .filter((word) => regularOnly.test(word))
            .filter((word) => !!langImpl.isWordSync(word))
            .reduce((acc, next) => {
                acc[next.length - minLength].push(next);
                return acc;
            }, acc);
        langsConfig[lang] = {};
        for (let i in dist) {
            langsConfig[lang][+i + minLength] = dist[+i].length;
            // Create the folder for the language
            mkdirSync(`${outputBaseDir}/${lang}`, { recursive: true });

            // Big file, write as stream
            const ws = createWriteStream(
                `${outputBaseDir}/${lang}/${+i + minLength}.txt`
            );
            // write each value of the array on the file breaking line
            dist[+i].forEach((value) => ws.write(`${value}\n`));

            // close the stream
            ws.end();
        }
    }
    writeFileSync(
        `${outputBaseDir}/config.json`,
        JSON.stringify(langsConfig, null, 2)
    );
    return langsConfig;
}
setupLanguages()
    .then((options) => {
        console.log(options);
        console.log('Proccess completed! Words available in ./src/generated');
    })
    // .then(() => process.exit(0))
    .catch((error) => {
        console.error('Process failed! :,(', error);
    });
