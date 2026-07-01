import { Service, signal, computed } from '@angular/core';
import { TRANSLATIONS } from '../constants/translations';

export type Language = 'es' | 'en';

@Service()
export class LanguageService {
  private readonly currentLangSignal = signal<Language>(this.getInitialLanguage());

  readonly currentLang = this.currentLangSignal.asReadonly();

  readonly translations = computed(() => TRANSLATIONS[this.currentLangSignal()]);

  toggleLanguage(): void {
    this.currentLangSignal.update((lang) => (lang === 'es' ? 'en' : 'es'));
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', this.currentLangSignal());
      document.documentElement.lang = this.currentLangSignal();
    }
  }

  private getInitialLanguage(): Language {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang') as Language;
      if (saved === 'es' || saved === 'en') {
        return saved;
      }
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'es' ? 'es' : 'en';
    }
    return 'es';
  }
}
