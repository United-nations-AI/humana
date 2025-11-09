"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    common: {
      brand: 'Humana',
      login: 'Login',
      about: 'About',
      start_chatting: 'Start Chatting',
      learn_more: 'Learn More',
      tagline_line1: 'Human rights AI avatar',
      tagline_line2: 'that speaks your language.'
    }
  },
  ar: { common: { brand: 'Humana', login: 'تسجيل الدخول', about: 'حول', start_chatting: 'ابدأ الدردشة', learn_more: 'اعرف المزيد', tagline_line1: 'مساعد حقوق الإنسان بالذكاء الاصطناعي', tagline_line2: 'يتحدث لغتك.' } },
  ru: { common: { brand: 'Humana', login: 'Войти', about: 'О нас', start_chatting: 'Начать чат', learn_more: 'Узнать больше', tagline_line1: 'ИИ-аватар по правам человека', tagline_line2: 'говорит на вашем языке.' } },
  it: { common: { brand: 'Humana', login: 'Accedi', about: 'Informazioni', start_chatting: 'Inizia a chattare', learn_more: 'Scopri di più', tagline_line1: 'Avatar IA per i diritti umani', tagline_line2: 'che parla la tua lingua.' } },
  ml: { common: { brand: 'Humana', login: 'ലോഗിൻ', about: 'കുറിച്ച്', start_chatting: 'സംസാരം ആരംഭിക്കുക', learn_more: 'കൂടുതൽ അറിയുക', tagline_line1: 'മനുഷ്യാവകാശങ്ങൾക്ക് AI സഹായി', tagline_line2: 'നിങ്ങളുടെ ഭാഷ സംസാരിക്കുന്നു.' } },
  hi: { common: { brand: 'Humana', login: 'लॉगिन', about: 'जानकारी', start_chatting: 'चैट शुरू करें', learn_more: 'और जानें', tagline_line1: 'मानवाधिकार एआई सहायक', tagline_line2: 'जो आपकी भाषा में बोलता है।' } },
  sw: { common: { brand: 'Humana', login: 'Ingia', about: 'Kuhusu', start_chatting: 'Anza kuzungumza', learn_more: 'Jifunze zaidi', tagline_line1: 'Msaidizi wa haki za binadamu wa AI', tagline_line2: 'anayezungumza lugha yako.' } },
  es: {
    common: {
      brand: 'Humana',
      login: 'Iniciar sesión',
      about: 'Acerca de',
      start_chatting: 'Empezar a chatear',
      learn_more: 'Saber más',
      tagline_line1: 'Avatar de IA sobre derechos humanos',
      tagline_line2: 'que habla tu idioma.'
    }
  },
  fr: {
    common: {
      brand: 'Humana',
      login: 'Connexion',
      about: 'À propos',
      start_chatting: 'Commencer à discuter',
      learn_more: 'En savoir plus',
      tagline_line1: 'Avatar IA des droits humains',
      tagline_line2: 'qui parle votre langue.'
    }
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      defaultNS: 'common',
    });
}

export default i18n;

