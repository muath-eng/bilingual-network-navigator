import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    let active = true;
    const loadProgress = async () => {
      const localIds: string[] = (() => {
        try {
          const parsed: unknown = JSON.parse(localStorage.getItem("nm-progress") || "[]");
          return Array.isArray(parsed)
            ? [...new Set(parsed.filter((id): id is string => typeof id === "string"))]
            : [];
        } catch {
          return [];
        }
      })();
      if (active) setDone(localIds);

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user || !active) return;

      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id);
      if (error || !active) return;

      const cloudIds = (data ?? []).map((row) => row.lesson_id);
      const merged = [...new Set([...cloudIds, ...localIds])];
      if (active) setDone(merged);
      localStorage.setItem("nm-progress", JSON.stringify(merged));

      const missing = localIds.filter((id) => !cloudIds.includes(id));
      if (missing.length) {
        await supabase.from("lesson_progress").upsert(
          missing.map((lesson_id) => ({ user_id: user.id, lesson_id })),
          { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
        );
      }
    };

    void loadProgress();
    return () => {
      active = false;
    };
  }, []);

  const mark = (id: string) => {
    const next = Array.from(new Set([...done, id]));
    setDone(next);
    localStorage.setItem("nm-progress", JSON.stringify(next));
    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      return supabase
        .from("lesson_progress")
        .upsert(
          { user_id: user.id, lesson_id: id },
          { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
        );
    });
  };

  return { done, mark };
}
