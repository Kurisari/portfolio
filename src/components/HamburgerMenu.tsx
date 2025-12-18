"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function HamburgerMenu() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { label: t("projects"), href: "#projects" },
    { label: t("experience"), href: "#experience" },
    { label: t("training"), href: "#training" },
    { label: t("extras"), href: "#extras" },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0f172a',
            zIndex: 999999,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw'
          }}
        >
          {/* Gradient overlay */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 30%, rgba(96,165,250,0.15), transparent 50%), radial-gradient(circle at 70% 70%, rgba(168,85,247,0.12), transparent 50%)',
              pointerEvents: 'none'
            }}
          />
          
          {/* Grid pattern */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              opacity: 0.2,
              pointerEvents: 'none'
            }}
          />

          {/* Content */}
          <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h2 className="text-xl font-bold gradient-text">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'white'
                }}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px', gap: '16px' }}>
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#cbd5e1',
                    padding: '16px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderBottomColor = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#cbd5e1';
                    e.currentTarget.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}
