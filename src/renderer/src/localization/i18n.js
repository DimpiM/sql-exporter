import i18n, { t } from 'i18next';
import { initReactI18next } from 'react-i18next';
import deTranslation from './de.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: {
        translation: deTranslation
      }
    },
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    }
  });
export default i18n;
