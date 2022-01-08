import { EnglishLanguage } from '../languages/english-language';
import { Language, SupportedLanguages } from '../languages/langs';
import { PortugueseLanguage } from '../languages/portuguese-language';

export class DictionaryFactory {
    private langMap: Map<SupportedLanguages, Language> = new Map();
    public create(language: SupportedLanguages): Language {
        if (!this.langMap.has(language)) {
            this.langMap.set(language, this.getLangInstance(language));
        }
        return this.langMap.get(language)!;
    }
    private getLangInstance(language: SupportedLanguages): Language {
        switch (language) {
            case SupportedLanguages.en:
                return new EnglishLanguage();
            case SupportedLanguages.pt:
                return new PortugueseLanguage();
            default:
                throw new Error('Language not defined');
        }
    }
}
