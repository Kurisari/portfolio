// Declaración para evitar error de TypeScript con window.Cal
declare global {
    interface Window {
        Cal?: {
            init: () => void;
                    open?: (options: {
                        calLink: string;
                        config?: Record<string, unknown>;
                    }) => void;
        };
    }
}
"use client";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export default function CalWidget() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Evitar múltiples cargas del script
        if (!document.getElementById("cal-embed-script")) {
            const script = document.createElement("script");
            script.src = "https://cal.com/embed/embed.js";
            script.async = true;
            script.id = "cal-embed-script";
            document.body.appendChild(script);
        }

        // Polling para esperar a que window.Cal esté disponible
        let interval: NodeJS.Timeout | null = null;
        let initialized = false;

        function tryInitCal() {
            if (window.Cal && typeof window.Cal.init === "function") {
                window.Cal.init();
                initialized = true;
                if (interval) clearInterval(interval);
            }
        }

        interval = setInterval(() => {
            if (!initialized) {
                tryInitCal();
            }
        }, 200);

        // Intentar inicializar una vez al montar
        tryInitCal();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [open]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-lg font-semibold text-white hover:bg-indigo-500/30 hover:border-indigo-400/40 transition-all duration-200 z-50"
                style={{
                    boxShadow: "0 4px 24px 0 rgba(80,80,180,0.15)",
                    WebkitBackdropFilter: "blur(12px)",
                    backdropFilter: "blur(12px)",
                }}
            >
                <Calendar className="w-6 h-6" /> <span>Book a Call</span>
            </button>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-0 flex flex-col">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold z-10"
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                        <iframe
                            src="https://cal.com/kurisari?layout=month_view"
                            title="Book a Call"
                            className="w-full h-[600px] rounded-b-xl border-0"
                            allow="camera; microphone;"
                        />
                    </div>
                </div>
            )}
        </>
    );
}