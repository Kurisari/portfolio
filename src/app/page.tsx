"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { loadPortfolio, type Portfolio } from "@/lib/portfolio";
import LanguageToggle from "@/components/LanguageToggle";
import HamburgerMenu from "@/components/HamburgerMenu";
import Image from "next/image";
import {
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  Mail,
  MapPin,
  Sparkles,
  Layers,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";

type Technology = Portfolio["technologies"][number];
type Project = Portfolio["projects"][number];
type Experience = Portfolio["experience"][number];
type Training = Portfolio["training"][number];
type Extra = Portfolio["extras"][number];

const CalWidget = dynamic(() => import("@/components/CalWidget"), { ssr: false });

const techColor = (name: string): string => {
  switch (name) {
    case "Next.js":
      return "#000000";
    case "TailwindCSS":
      return "#38BDF8";
    case "Framer Motion":
      return "#E10098";
    case "Shadcn/UI":
      return "#9333EA";
    case "Python":
      return "#3776AB";
    case "C++":
      return "#00599C";
    case "Java":
      return "#007396";
    case "JavaScript":
      return "#F7DF1E";
    case "React":
      return "#61DAFB";
    case "Material UI":
      return "#007FFF";
    case "Firebase":
      return "#FFCA28";
    case "PyTorch":
      return "#EE4C2C";
    case "HTML":
      return "#E34F26";
    case "CSS":
      return "#1572B6";
    case "GitHub":
      return "#181717";
    case "Reflex":
      return "#06B6D4";
    default:
      return "#444";
  }
};

export default function Home() {
  const { t, lang } = useI18n();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await loadPortfolio(lang);
      if (active) setPortfolio(data);
    })();
    return () => {
      active = false;
    };
  }, [lang]);

  const quickStats = useMemo(
    () => [
      { label: t("projects"), value: portfolio?.projects.length ?? 0, icon: <Layers className="h-4 w-4" /> },
      { label: t("training"), value: portfolio?.training.length ?? 0, icon: <CalendarDays className="h-4 w-4" /> },
      { label: t("extras"), value: portfolio?.extras.length ?? 0, icon: <FileText className="h-4 w-4" /> },
      { label: "Technologies", value: portfolio?.technologies.length ?? 0, icon: <Github className="h-4 w-4" /> },
      { label: "Years Active", value: new Date().getFullYear() - 2022, icon: <Sparkles className="h-4 w-4" /> },
    ],
    [portfolio, t]
  );

  if (!portfolio) return null;

  const statusColor = portfolio.isAvailable ? "text-emerald-200" : "text-red-200";
  const dotColor = portfolio.isAvailable ? "bg-emerald-400" : "bg-red-400";
  const animatePulse = portfolio.isAvailable ? "animate-pulse" : "";
  const backgroundGradient = portfolio.isAvailable 
    ? "bg-gradient-to-r from-emerald-500/15 via-green-400/10 to-cyan-500/15" 
    : "bg-gradient-to-r from-red-500/15 via-red-400/10 to-pink-500/15";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <h1 className="sr-only">{portfolio.name} — {t("skill")}</h1>

      <div className="pointer-events-none absolute inset-0 grid-fade" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.14),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(34,197,94,0.12),transparent_35%)]" />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass-panel shadow-xl shadow-black/10">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-3 py-2 md:px-4 md:py-3">
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-slate-300">
            <a href="#projects" className="hover:text-white transition">{t("projects")}</a>
            <a href="#experience" className="hover:text-white transition">{t("experience")}</a>
            <a href="#training" className="hover:text-white transition">{t("training")}</a>
            <a href="#extras" className="hover:text-white transition">{t("extras")}</a>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <HamburgerMenu />
            <LanguageToggle />
            <Button asChild size="sm" className="hidden sm:flex">
              <a href={`mailto:${portfolio.media.email}`} className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-24 md:pt-32 lg:pt-40">
        <section className="grid gap-6 md:gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-3 md:gap-4">
                <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-white/20 shadow-xl shadow-blue-500/20">
                  <AvatarImage src={portfolio.avatar} alt={portfolio.name} />
                </Avatar>
                <div>
                  <p className="text-xs md:text-sm text-slate-400">{portfolio.location}</p>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-slate-50">
                    <span className="gradient-text">{portfolio.name}</span>
                  </h2>
                </div>
              </div>
              <p className="text-base md:text-lg text-slate-300" dangerouslySetInnerHTML={{ __html: t("about") }} />
            </div>
            <div className="flex flex-wrap gap-2 text-xs md:text-sm text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 md:px-3 md:py-1 inline-flex items-center gap-1.5 md:gap-2">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-sky-300" />
                <span className="hidden sm:inline">{portfolio.location}</span>
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 md:px-3 md:py-1 inline-flex items-center gap-1.5 md:gap-2">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-indigo-300" />
                <span className="hidden sm:inline">{portfolio.skill}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Button asChild>
                <a
                  href={portfolio.media.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" /> {t("github")}
                </a>
              </Button>
              <Button asChild>
                <a
                  href={portfolio.media.likedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" /> {t("linkedin")}
                </a>
              </Button>
              <Button asChild>
                <a
                  href={portfolio.media.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" /> {t("cv")}
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl glass-panel"
          >
            <div className="glow-ring rounded-2xl" />
            <div className="relative space-y-4">
              <div className={`rounded-xl border border-white/10 ${backgroundGradient} px-4 py-3 text-center`}>
                <span className={`flex items-center justify-center gap-2 text-sm font-medium ${statusColor}`}>
                  <span className={`h-2 w-2 rounded-full ${dotColor} ${animatePulse}`} />
                  {portfolio.isAvailable ? t("open_to_work") : t("not_available")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {quickStats.map((stat, idx) => (
                  <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-2 md:p-3 text-center shadow-inner shadow-black/30">
                    <div className="mx-auto mb-1.5 md:mb-2 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-white/10 text-sky-200">
                      {stat.icon}
                    </div>
                    <p className="text-lg md:text-xl font-semibold text-slate-50">{stat.value}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-10 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold text-slate-100">Stack & Tools</h3>
            <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-3">
            {portfolio.technologies.map((tech: Technology, i: number) => (
              <motion.div
                key={`${tech.name}-${tech.icon}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                className="glass-panel flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-100"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: `linear-gradient(135deg, ${techColor(tech.name)}20, rgba(255,255,255,0.05))`,
                }}
              >
                <i className={`${tech.icon} text-lg`} />
                <span>{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="projects" className="mt-10 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold text-slate-100">{t("projects")}</h3>
            <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {portfolio.projects.map((project: Project, i: number) => (
              <motion.article
                key={`${project.title}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 glass-panel"
              >
                <div className="glow-ring rounded-2xl" />
                {project.image ? (
                  <div className="relative mb-4 h-56 w-full overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-top transition duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={i < 2}
                    />
                  </div>
                ) : null}
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{project.subtitle}</p>
                  <h4 className="text-xl font-semibold text-slate-50">{project.title}</h4>
                  <p className="text-sm text-slate-300">{project.description}</p>
                </div>
                {project.technologies ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((tech: Technology, idx: number) => (
                      <span
                        key={`${tech.name}-${idx}`}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                        style={{ background: `linear-gradient(135deg, ${techColor(tech.name)}25, rgba(255,255,255,0.04))` }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-200 hover:border-white/30"
                    >
                      <Github className="h-4 w-4" /> {t("code")}
                    </a>
                  ) : null}
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-200 hover:border-white/30"
                    >
                      <ExternalLink className="h-4 w-4" /> {t("preview")}
                    </a>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="experience" className="mt-10 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold text-slate-100">{t("experience")}</h3>
            <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="relative before:absolute before:left-3 before:top-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-sky-400/60 before:to-transparent">
            {portfolio.experience.map((exp: Experience, i: number) => (
              <motion.div
                key={`${exp.title}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative ml-10 mb-10 rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg"
              >
                <div className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30">
                  <span className="text-xs font-semibold">{i + 1}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-sky-200">{exp.title}</p>
                  <p className="text-xs text-slate-400">{exp.date}</p>
                </div>
                <p className="text-sm text-slate-300">{exp.subtitle}</p>
                <p className="mt-2 text-sm text-slate-400">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="training" className="mt-10 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold text-slate-100">{t("training")}</h3>
            <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {portfolio.training.map((train: Training, i: number) => (
              <motion.div
                key={`${train.title}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{train.subtitle}</span>
                  <span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-slate-200">{train.date}</span>
                </div>
                <h4 className="mt-2 text-lg font-semibold text-slate-50">{train.title}</h4>
                <p className="mt-2 text-sm text-slate-300">{train.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="extras" className="mt-10 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold text-slate-100">{t("extras")}</h3>
            <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {portfolio.extras.map((extra: Extra, i: number) => (
              <motion.a
                key={`${extra.title}-${i}`}
                href={extra.url || "#"}
                target={extra.url ? "_blank" : undefined}
                rel={extra.url ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 shadow-lg"
              >
                <div className="glow-ring rounded-xl" />
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={extra.image}
                    alt={extra.title}
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-slate-100">{extra.title}</h4>
                <p className="text-xs text-slate-400">{extra.description}</p>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="mt-12 md:mt-20 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-purple-500/10 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-slate-200">Let us build together</p>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-50">¿Hablamos? Proyectos, consultoría o colaboraciones.</h3>
              <p className="text-sm text-slate-300">Disponibilidad inmediata y enfoque en experiencias digitales con IA.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={`mailto:${portfolio.media.email}`} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {t("email")}
                </a>
              </Button>
              <Button asChild>
                <a href={portfolio.media.likedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" /> {t("linkedin")}
                </a>
              </Button>
            </div>
          </div>
        </section>

        <footer className="mt-12 md:mt-20 mb-6 md:mb-8 border-t border-white/10 pt-6 md:pt-8 pb-4 text-xs md:text-sm text-slate-400">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 md:flex-row md:items-center">
            <p>© {new Date().getFullYear()} {portfolio.name}. {t("all_rights")}</p>
            <div className="flex items-center gap-4">
              <a href={portfolio.media.github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-100">{t("github")}</a>
              <a href={portfolio.media.likedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-100">{t("linkedin")}</a>
              <a href={`mailto:${portfolio.media.email}`} className="hover:text-slate-100">{t("email")}</a>
            </div>
          </div>
        </footer>
      </div>

      <CalWidget />
    </main>
  );
}