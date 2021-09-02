import Vue from 'vue';
import VueI18n from 'vue-i18n';
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';// element-ui lang
import enLocale from './en';
import zhLocale from './zh';

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
};

export function getLanguage() {
  const selectedLanguage = localStorage.getItem('language');
  if (selectedLanguage) return selectedLanguage;

  // if no selected language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return 'en';
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages,
  dateTimeFormats: messages,
});

export default i18n;
