import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useLocalStorage, useInputState, useDebouncedValue } from "@mantine/hooks";
import { NotificationsProvider, showNotification } from "@mantine/notifications";
import { IconExclamationMark } from "@tabler/icons";

const API_URL = "http://localhost:8000";

const TranslateContext = createContext();

const TranslateProvider = ({ children }) => {
  const [currentColorScheme, setColorScheme] = useLocalStorage({
    key: "TranslatorColorScheme",
    defaultValue: "light",
  });
  const [value, setValue] = useInputState("");
  const [translatedValue, setTranslatedValue] = useState("");
  const [textFromClipboard, setTextFromClipboard] = useState(null);
  const [pasted, setPasted] = useState(false);
  const [langs, setLangs] = useState(null);
  const [langpair, setLangpair] = useState({ from: { value: "auto", label: "Detect Language"}, to: { value: "en", label: "English" } });
  const [detectedLang, setDetectedLang] = useState(false);
  const [debouncedValue] = useDebouncedValue(value, 800);
  const [loading, setLoading] = useState(false);
  const [langsError, setLangsError] = useState(null);

  function speechText(text, pos) {
    const speech = new SpeechSynthesisUtterance();
    
    speech.text = text;
    speech.lang = langpair[pos].value === "auto" ? detectedLang : langpair[pos].value ;
    speechSynthesis.speak(speech);
  };
  
  function translate(q, from, to) {
    axios.post(API_URL, { q, from, to }).then(({ data }) => {
      setTranslatedValue(data.text);
      setLoading(false);
      
      if (langpair.from.value === "auto") {
        setDetectedLang(data.from.language.iso);
      };
    }).catch((err) => {
      showNotification({
        title: "Translate Error",
        message: err.message,
        color: "red.8",
        icon: <IconExclamationMark />,
        disallowClose: true,
        autoClose: 4000,
      });
      
      setLoading(false);
    });
  };
  
  function exchangeLang(from, to) {
    setLangpair({ from: to, to: from });
  };
 
  useEffect(() => {
    navigator.clipboard.readText().then((text) => {
      setTextFromClipboard(text);
    }).catch((err) => {
      showNotification({
        title: "Clipboard Error",
        message: err.message,
        color: "red.8",
        icon: <IconExclamationMark />,
        disallowClose: true,
        autoClose: 4000,
      });
    });
    
    axios.get(API_URL).then(({ data }) => {
      const result = [];
      
      for (const lang in data) {
        result.push({ value: lang, label: data[lang] });
      };
      
      setLangs(result);
    }).catch((err) => {
      setLangsError(err.message);
    });
  }, []);
  
  useEffect(() => {
    if (debouncedValue.trim().length >= 2) {
      setLoading(true);
      translate(value.trim(), langpair.from.value, langpair.to.value);
    };
  }, [debouncedValue, langpair]);
  
  useEffect(() => {
    if (value.trim().length < 2) {
      setTranslatedValue("");
    };
  }, [value]);
  
  return (
    <ColorSchemeProvider colorScheme={currentColorScheme} toggleColorScheme={(colorScheme) => setColorScheme(colorScheme ?? (currentColorScheme === "light" ? "dark" : "light"))}>
      <MantineProvider withNormalizeCSS theme={{
        colorScheme: currentColorScheme,
        primaryColor: currentColorScheme === "light" ? "blue" : "yellow",
        primaryShade: currentColorScheme === "light" ? 8 : 6,
        activeStyles: { transform: "scale(0.97)" },
      }}>
        <NotificationsProvider>
          <TranslateContext.Provider value={{ currentColorScheme, value, setValue, translatedValue, textFromClipboard, pasted, setPasted, langs, langpair, setLangpair, loading, exchangeLang, speechText, langsError }}>
            {children}
          </TranslateContext.Provider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export { TranslateContext, TranslateProvider };