import { es } from './i18n/es';
import { en } from './i18n/en';

export const TRANSLATIONS = {
  es,
  en,
} as const;

export type Translations = typeof TRANSLATIONS.es;
