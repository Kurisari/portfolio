"use client";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div
      className="relative flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 backdrop-blur-md"
      role="tablist"
      aria-label="Language selector"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        role="tab"
        aria-selected={lang === "en"}
        className={`relative z-10 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
          lang === "en" ? "text-slate-50" : "text-slate-400 hover:text-slate-200"
        }`}
        onClick={() => setLang("en")}
      >
        {lang === "en" && (
          <motion.div
            layoutId="language-indicator"
            className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-white/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        role="tab"
        aria-selected={lang === "es"}
        className={`relative z-10 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
          lang === "es" ? "text-slate-50" : "text-slate-400 hover:text-slate-200"
        }`}
        onClick={() => setLang("es")}
      >
        {lang === "es" && (
          <motion.div
            layoutId="language-indicator"
            className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-white/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10">ES</span>
      </motion.button>
    </div>
  );
}
