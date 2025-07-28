import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_PERSISTENCE_KEY = "appLanguage";

const baseTranslation = {
  welcome: "Welcome",
  settings: "Settings",
  language: "Language",
  select_language: "Select your language",
  // Add more keys as needed
};

export const languageResources = {
  en: { translation: baseTranslation },
  fr: {
    translation: {
      welcome: "Bienvenue",
      settings: "Paramètres",
      language: "Langue",
      select_language: "Choisissez votre langue",
      // Add more keys as needed
    },
  },
  es: { translation: baseTranslation },
  de: { translation: baseTranslation },
  it: { translation: baseTranslation },
  pt: { translation: baseTranslation },
  ru: { translation: baseTranslation },
  zh: { translation: baseTranslation },
  ja: { translation: baseTranslation },
  ko: { translation: baseTranslation },
  ar: { translation: baseTranslation },
  hi: { translation: baseTranslation },
  tr: { translation: baseTranslation },
  nl: { translation: baseTranslation },
  pl: { translation: baseTranslation },
  sv: { translation: baseTranslation },
  da: { translation: baseTranslation },
  no: { translation: baseTranslation },
  fi: { translation: baseTranslation },
  cs: { translation: baseTranslation },
  hu: { translation: baseTranslation },
  ro: { translation: baseTranslation },
  bg: { translation: baseTranslation },
  hr: { translation: baseTranslation },
  sk: { translation: baseTranslation },
  sl: { translation: baseTranslation },
  et: { translation: baseTranslation },
  lv: { translation: baseTranslation },
  lt: { translation: baseTranslation },
  mt: { translation: baseTranslation },
  ga: { translation: baseTranslation },
  cy: { translation: baseTranslation },
  eu: { translation: baseTranslation },
  ca: { translation: baseTranslation },
  gl: { translation: baseTranslation },
  is: { translation: baseTranslation },
  mk: { translation: baseTranslation },
  sq: { translation: baseTranslation },
  sr: { translation: baseTranslation },
  bs: { translation: baseTranslation },
  me: { translation: baseTranslation },
  th: { translation: baseTranslation },
  vi: { translation: baseTranslation },
  id: { translation: baseTranslation },
  ms: { translation: baseTranslation },
  tl: { translation: baseTranslation },
  bn: { translation: baseTranslation },
  ur: { translation: baseTranslation },
  fa: { translation: baseTranslation },
  he: { translation: baseTranslation },
  am: { translation: baseTranslation },
  sw: { translation: baseTranslation },
  zu: { translation: baseTranslation },
  af: { translation: baseTranslation },
  xh: { translation: baseTranslation },
  yo: { translation: baseTranslation },
  ig: { translation: baseTranslation },
  ha: { translation: baseTranslation },
  so: { translation: baseTranslation },
  rw: { translation: baseTranslation },
  lg: { translation: baseTranslation },
  ny: { translation: baseTranslation },
  st: { translation: baseTranslation },
  tn: { translation: baseTranslation },
  ss: { translation: baseTranslation },
  ve: { translation: baseTranslation },
  ts: { translation: baseTranslation },
  nr: { translation: baseTranslation },
  nd: { translation: baseTranslation },
};

i18n.use(initReactI18next).init({
  resources: languageResources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
});

// Language persistence helpers
export const setAppLanguage = async (lng: string) => {
  await AsyncStorage.setItem(LANGUAGE_PERSISTENCE_KEY, lng);
  i18n.changeLanguage(lng);
};

export const getAppLanguage = async () => {
  const lng = await AsyncStorage.getItem(LANGUAGE_PERSISTENCE_KEY);
  return lng || "en";
};

export default i18n;
