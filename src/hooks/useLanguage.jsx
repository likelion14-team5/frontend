import { createContext, useCallback, useContext, useState } from 'react';
import ko from '../locales/ko.json';
import en from '../locales/en.json';

const LOCALES = { ko, en };
const LANGUAGE_KEY = 'attune_language';

const LanguageContext = createContext(null);

function resolveKey(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function loadSavedLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return saved === 'en' ? 'en' : 'ko';
  } catch {
    return 'ko';
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(loadSavedLanguage);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch {
      // 저장 실패해도 언어 전환 자체는 계속 동작해야 함
    }
  };

  const t = useCallback((key) => {
    const value = resolveKey(LOCALES[language], key);
    if (value !== undefined) return value;
    // 번역 누락 시 한국어로 대체하고, 그마저 없으면 key 자체를 보여줘서 누락을 바로 알아챌 수 있게 함
    return resolveKey(LOCALES.ko, key) ?? key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- Context + 훅을 한 파일에 두는 흔한 패턴, Fast Refresh 규칙은 무시해도 됨
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
