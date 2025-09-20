// src/context/GlobalContext.tsx
import React, { createContext, useState, useEffect} from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface GlobalContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  changeLanguage: (lang: string) => void;
}

export const GlobalContext = createContext<GlobalContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  language: "en",
  changeLanguage: () => {},
});

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");

  // Load saved preferences from localStorage on first render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
      document.body.style.backgroundColor = savedTheme === "dark" ? "#000000" : "#ffffff";
    }

    const savedLang = localStorage.getItem("language");
    if (savedLang) {
      setLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  // Update localStorage + body background when darkMode changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.style.backgroundColor = darkMode ? "#000000" : "#ffffff";
  }, [darkMode]);

  // Update localStorage + i18n when language changes
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <GlobalContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        language,
        changeLanguage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
