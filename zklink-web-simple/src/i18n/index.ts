import i18n from 'i18next'
// import XHR from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'
// import LanguageDetector from 'i18next-browser-languagedetector'
// import Cache from 'i18next-localstorage-cache'
import en from './locales/en.json'

// declare module 'i18next-localstorage-cache'

i18n
  // .use(XHR)
  // .use(LanguageDetector)
  // .use(Cache)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
    },
    lng: 'en',
    returnNull: false,
    // cache: {
    //   enabled: true,
    //   prefix: 'i18next_res_',
    //   expirationTime: 7 * 24 * 60 * 60 * 1000,
    // },
    // backend: {
    //   loadPath: `./locales/{{lng}}.json`,
    // },
    // react: {
    //   useSuspense: false,
    // },
    // fallbackLng: 'en',
    // preload: ['en'],
    // keySeparator: false,
    // interpolation: { escapeValue: false },
  })

export default i18n
