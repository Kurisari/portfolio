"use client";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  const containerStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(236,72,153,0.10)), rgba(255,255,255,0.04)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.18)",
  };

  const activeStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.35), rgba(34,197,94,0.18), rgba(59,130,246,0.25))",
    boxShadow: "0 8px 24px -12px rgba(59,130,246,0.45)",
    border: "1px solid rgba(255,255,255,0.28)",
    color: "#fff",
  };

  const inactiveClass =
    "border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 transition-colors";

  return (
    <div
      className="ml-4 flex items-center gap-2 rounded-xl px-2 py-1"
      style={containerStyle}
      role="tablist"
      aria-label="Language selector"
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        role="tab"
        aria-selected={lang === "es"}
        className={`px-3 py-1 rounded-lg text-xs font-semibold ${lang === "es" ? "" : inactiveClass}`}
        style={lang === "es" ? activeStyle : undefined}
        onClick={() => setLang("es")}
      >
        ES
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        role="tab"
        aria-selected={lang === "en"}
        className={`px-3 py-1 rounded-lg text-xs font-semibold ${lang === "en" ? "" : inactiveClass}`}
        style={lang === "en" ? activeStyle : undefined}
        onClick={() => setLang("en")}
      >
        EN
      </motion.button>
    </div>
  );
}
