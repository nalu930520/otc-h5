/**
 * Import Dependency
 */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
/**
 * Import Language
 */
import en from './i18n/en';
import cn from './i18n/cn';

/**
 * Config
 */
Vue.use(VueI18n);
const lang = 'cn';

/**
 * Export
 */
export default new VueI18n({
  locale: lang,
  messages: {
    en: {
      lang: en,
    },
    cn: {
      lang: cn,
    },
  },
});
