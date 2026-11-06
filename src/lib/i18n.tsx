import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (ar: string, en: string) => string };
const LangCtx = createContext<Ctx>({ lang: "ar", setLang: () => {}, t: (a) => a });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  useEffect(() => {
    const saved = localStorage.getItem("nm-lang");
    if (saved === "en" || saved === "ar") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("nm-lang", l);
  };
  return (
    <LangCtx.Provider value={{ lang, setLang, t: (ar, en) => (lang === "ar" ? ar : en) }}>
      {children}
    </LangCtx.Provider>
  );
}
export const useLang = () => useContext(LangCtx);

export function useProgress() {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    setDone(JSON.parse(localStorage.getItem("nm-progress") || "[]"));
  }, []);
  const mark = (id: string) => {
    const next = Array.from(new Set([...done, id]));
    setDone(next);
    localStorage.setItem("nm-progress", JSON.stringify(next));
  };
  return { done, mark };
}
