import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';
import vi from './locales/vi.json';

const languages = {
  en: { translation: en },
  vi: { translation: vi },
  de: { translation: de },
};


// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(initReactI18next)
  .init({
    resources: languages,
    lng: Localization.getLocales()[0].languageTag.split('-')[0], // e.g., "en" or "vi"
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
  });

export default i18n;