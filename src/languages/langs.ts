export enum SupportedLanguages {
    en = 'en',
    pt = 'pt',
}
export abstract class Language {
    protected abstract _lang: SupportedLanguages;
    public abstract isWord(word: string): Promise<boolean>;
    public abstract isWordSync(word: string): boolean;
    public get lang(): string {
        return SupportedLanguages[this._lang];
    }
}
