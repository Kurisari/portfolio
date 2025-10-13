"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import enDict from "../i18n/en.json";

const LANGS = ["en", "es"] as const;
type Lang = typeof LANGS[number];

type Dict = Record<string, string>;

async function loadDict(lang: Lang): Promise<Dict> {
    switch (lang) {
        case "es":
            return (await import("../i18n/es.json")).default;
        case "en":
        default:
            return (await import("../i18n/en.json")).default;
    }
}

const I18nContext = createContext<{
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (k: string) => string;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>("en");
    const [dict, setDict] = useState<Dict>(enDict);

    useEffect(() => {
        // Initialize language from localStorage or navigator
        const init = async () => {
            let initial: Lang = "en";
            if (typeof window !== "undefined") {
                const stored = window.localStorage.getItem("lang") as Lang | null;
                if (stored && LANGS.includes(stored)) initial = stored;
                else {
                    const nav = navigator.language.slice(0, 2) as Lang;
                    initial = LANGS.includes(nav) ? nav : "en";
                }
            }
            setLang(initial);
            setDict(await loadDict(initial));
        };
        init();
    }, []);

    useEffect(() => {
        if (!lang) return;
        loadDict(lang).then(setDict);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("lang", lang);
        }
        if (typeof document !== "undefined") {
            document.documentElement.lang = lang;
        }
    }, [lang]);

    const t = (k: string) => dict[k] || k;

    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within I18nProvider");
    return ctx;
}
