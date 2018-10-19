import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import en from './en';
import th from './th';

const options = {
  fallbackLng: 'th',
  ns: ['common', 'head', 'resequence', 'timeline', 'dashboardSidebar', 'dashboardContent', 'moveModel', 'sidebar', 'footer', 'routersetting', 'upload', 'error'],
  defaultNS: 'common',

  keySeparator: false,
  nsSeparator: ':',

  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  debug: true,
  react: {
    wait: false,
  },
  resources: {
    en,
    th,
  },
};
i18n.use(LanguageDetector).use(reactI18nextModule).init(options);
export default i18n;
