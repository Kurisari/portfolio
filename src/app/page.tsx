"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  loadPortfolio,
  selectProjectsByTag,
  sortProjectsByPriority,
  type Portfolio,
} from "@/lib/portfolio";
import LanguageToggle from "@/components/LanguageToggle";
import HamburgerMenu from "@/components/HamburgerMenu";
import Image from "next/image";
import {
  Github,
  Linkedin,
  FileText,
  Mail,
  MapPin,
  Sparkles,
  Layers,
  CalendarDays,
  ChevronDown,
  Terminal,
  Brain,
  Code2,
  Globe,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { N8n } from "@lobehub/icons";

type Technology = Portfolio["technologies"][number];
type Project = Portfolio["projects"][number];
type Experience = Portfolio["experience"][number];
type Training = Portfolio["training"][number];
type Extra = Portfolio["extras"][number];

const CalWidget = dynamic(() => import("@/components/CalWidget"), { ssr: false });

const techColor = (name: string): string => {
  const colors: Record<string, string> = {
    "Next.js": "#000000",
    TailwindCSS: "#38BDF8",
    "Framer Motion": "#E10098",
    Astro: "#FF5D01",
    "Shopify Headless": "#95BF47",
    Vite: "#646CFF",
    "Shadcn/UI": "#9333EA",
    Python: "#3776AB",
    "C++": "#00599C",
    Java: "#007396",
    JavaScript: "#F7DF1E",
    React: "#61DAFB",
    "Material UI": "#007FFF",
    Firebase: "#FFCA28",
    PyTorch: "#EE4C2C",
    HTML: "#E34F26",
    CSS: "#1572B6",
    GitHub: "#181717",
    Reflex: "#06B6D4",
    N8N: "#FF6B35",
    Supabase: "#3ECF8E",
  };
  return colors[name] || "#444";
};

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500 whitespace-nowrap">
        {children}
      </h3>
      <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
    </div>
  );
}

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

  const latestExperience = portfolio?.experience?.[0];

  const quickStats = useMemo(
    () => [
      { label: t("projects"), value: portfolio?.projects.length ?? 0, icon: <Layers className="h-4 w-4" /> },
      { label: t("training"), value: portfolio?.training.length ?? 0, icon: <CalendarDays className="h-4 w-4" /> },
      { label: t("years_active"), value: new Date().getFullYear() - 2022, icon: <Sparkles className="h-4 w-4" /> },
    ],
    [portfolio, t]
  );

  const latestProjects = useMemo(() => {
    if (!portfolio) return [];
    const taggedForHome = selectProjectsByTag(portfolio.projects, "home", 3);
    if (taggedForHome.length > 0) return taggedForHome;
    return sortProjectsByPriority(portfolio.projects).slice(0, 3);
  }, [portfolio]);

  if (!portfolio) return null;

  const statusColor = portfolio.isAvailable ? "text-emerald-300" : "text-red-300";
  const dotColor = portfolio.isAvailable ? "bg-emerald-400" : "bg-red-400";
  const animatePulse = portfolio.isAvailable ? "animate-pulse" : "";
  const statusBg = portfolio.isAvailable
    ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
    : "bg-gradient-to-r from-red-500/10 to-pink-500/10";

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <h1 className="sr-only">{portfolio.name} — {t("skill")}</h1>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 grid-fade" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.10),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.06),transparent_45%)]" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 glass-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <a href="#" className="font-mono text-sm text-slate-500 hover:text-white transition">
            kurisari<span className="text-sky-400">.</span>dev
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <Link href="/projects" className="hover:text-white transition">{t("projects")}</Link>
            <a href="#experience" className="hover:text-white transition">{t("experience")}</a>
            <a href="#training" className="hover:text-white transition">{t("training")}</a>
            <a href="#extras" className="hover:text-white transition">{t("extras")}</a>
          </nav>
          <div className="flex items-center gap-3">
            <HamburgerMenu />
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Hero — full viewport */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-6"
        >
          <Avatar className="mx-auto h-24 w-24 border-2 border-white/10 shadow-2xl shadow-blue-500/15">
            <AvatarImage src={portfolio.avatar} alt={portfolio.name} />
          </Avatar>

          <div className="space-y-2">
            <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-sky-400/70">
              {portfolio.skill}
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
              <span className="gradient-text">{portfolio.name}</span>
            </h2>
          </div>

          <p
            className="mx-auto max-w-lg text-sm sm:text-base text-slate-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t("about") }}
          />

          {/* Status + Location */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className={`inline-flex items-center gap-2.5 rounded-full border border-white/10 ${statusBg} px-4 py-2`}>
              <span className={`h-1.5 w-1.5 rounded-full ${dotColor} ${animatePulse}`} />
              <span className={`text-xs font-medium ${statusColor}`}>
                {portfolio.isAvailable ? t("open_to_work") : t("not_available")}
              </span>
            </div>
            <span className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {portfolio.location}
            </span>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { href: portfolio.media.github, icon: <Github className="h-4 w-4" />, label: t("github"), external: true },
              { href: portfolio.media.likedin, icon: <Linkedin className="h-4 w-4" />, label: t("linkedin"), external: true },
              { href: portfolio.media.cv, icon: <FileText className="h-4 w-4" />, label: t("cv"), external: true },
              { href: `mailto:${portfolio.media.email}`, icon: <Mail className="h-4 w-4" />, label: t("email"), external: false },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/3 px-4 py-2 text-xs text-slate-400 hover:bg-white/8 hover:text-white transition-all"
              >
                {link.icon}
                <span className="hidden sm:inline">{link.label}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 flex flex-col items-center gap-1.5 text-slate-600"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase">scroll</span>
          <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
        </motion.div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6">

        {/* Stats */}
        <section className="py-20 md:py-28">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {latestExperience && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="col-span-2 rounded-2xl border border-white/5 bg-white/2 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600 mb-3">
                  <Terminal className="h-3 w-3" />
                  <span>{t("experience")}</span>
                </div>
                <p className="text-base font-semibold text-slate-100">{latestExperience.title}</p>
                <p className="text-sm text-slate-400 mt-0.5">{latestExperience.subtitle}</p>
                <p className="text-[11px] text-slate-600 font-mono mt-1.5">{latestExperience.date}</p>
              </motion.div>
            )}
            {quickStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="rounded-2xl border border-white/5 bg-white/2 p-5 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/4 text-sky-400/60">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-slate-100 font-mono tabular-nums">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stack & Tools */}
        <section className="pb-20 md:pb-28">
          <SectionHeading>Stack & Tools</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {portfolio.technologies.map((tech: Technology, i: number) => (
              <motion.div
                key={`${tech.name}-${tech.icon}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
                className="flex items-center gap-2 rounded-full border border-white/5 px-3.5 py-1.5 text-sm text-slate-300"
                style={{
                  background: `linear-gradient(135deg, ${techColor(tech.name)}15, transparent)`,
                }}
              >
                {tech.name === "N8N" ? <N8n size={16} /> : <i className={`${tech.icon} text-base`} />}
                <span className="text-xs">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Preview */}
        <section id="projects" className="pb-20 md:pb-28">
          <SectionHeading>{t("projects")}</SectionHeading>

          <div className="grid gap-4 md:grid-cols-3">
            {latestProjects.map((project: Project, i: number) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="group rounded-2xl border border-white/5 bg-white/2 p-5 hover:border-white/15 transition-all backdrop-blur-sm"
              >
                {project.image && (
                  <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl border border-white/5">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={i < 3}
                    />
                  </div>
                )}

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/3 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  {project.category === "ai" && <Brain className="h-2.5 w-2.5" />}
                  {project.category === "web" && <Globe className="h-2.5 w-2.5" />}
                  {project.category === "algorithms" && <Code2 className="h-2.5 w-2.5" />}
                  {project.category === "software" && <Cpu className="h-2.5 w-2.5" />}
                  {t(`cat_${project.category}`)}
                </span>

                <h4 className="text-base font-semibold text-slate-100 mt-2">{project.title}</h4>
                <p className="text-[11px] font-mono text-slate-600 mt-0.5">{project.subtitle}</p>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed line-clamp-2">{project.description}</p>

                {project.technologies && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech: Technology, idx: number) => (
                      <span
                        key={`${tech.name}-${idx}`}
                        className="rounded-full border border-white/5 px-2 py-0.5 text-[10px] text-slate-500"
                        style={{ background: `linear-gradient(135deg, ${techColor(tech.name)}10, transparent)` }}
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="rounded-full border border-white/5 px-2 py-0.5 text-[10px] text-slate-600">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* View All Projects CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-6 py-3 text-sm text-slate-300 hover:bg-white/8 hover:text-white hover:border-white/20 transition-all"
            >
              {t("view_all_projects")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>

        {/* Experience */}
        <section id="experience" className="pb-20 md:pb-28">
          <SectionHeading>{t("experience")}</SectionHeading>
          <div className="relative pl-8 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-linear-to-b before:from-sky-500/40 before:via-sky-500/20 before:to-transparent">
            {portfolio.experience.map((exp: Experience, i: number) => (
              <motion.div
                key={`${exp.title}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="relative mb-8 last:mb-0"
              >
                <div className="absolute -left-8 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-sky-500/40 bg-slate-950">
                  <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                </div>
                <div className="rounded-xl border border-white/5 bg-white/2 p-4 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4 className="text-sm font-semibold text-slate-100">{exp.title}</h4>
                    <span className="text-[11px] font-mono text-slate-600">{exp.date}</span>
                  </div>
                  <p className="text-xs text-sky-400/70 mt-0.5">{exp.subtitle}</p>
                  <p className="text-sm text-slate-400 mt-2">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Training */}
        <section id="training" className="pb-20 md:pb-28">
          <SectionHeading>{t("training")}</SectionHeading>
          <div className="grid gap-4 md:grid-cols-2">
            {portfolio.training.map((train: Training, i: number) => (
              <motion.div
                key={`${train.title}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                className="rounded-xl border border-white/5 bg-white/2 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-600">{train.subtitle}</span>
                  <span className="text-[11px] font-mono text-slate-600">{train.date}</span>
                </div>
                <h4 className="text-base font-semibold text-slate-100">{train.title}</h4>
                <p className="text-sm text-slate-400 mt-2">{train.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Extras */}
        <section id="extras" className="pb-20 md:pb-28">
          <SectionHeading>{t("extras")}</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {portfolio.extras.map((extra: Extra, i: number) => (
              <motion.a
                key={`${extra.title}-${i}`}
                href={extra.url || "#"}
                target={extra.url ? "_blank" : undefined}
                rel={extra.url ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="group rounded-xl border border-white/5 bg-white/2 p-3 hover:border-white/15 transition-colors backdrop-blur-sm"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg border border-white/4">
                  <Image
                    src={extra.image}
                    alt={extra.title}
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <h4 className="mt-3 text-sm font-medium text-slate-200">{extra.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{extra.description}</p>
              </motion.a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20 md:mb-28 rounded-2xl border border-white/5 bg-linear-to-r from-sky-500/6 via-cyan-500/4 to-purple-500/6 p-8 md:p-10 backdrop-blur-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 mb-2">{t("cta_tag")}</p>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-100">{t("cta_title")}</h3>
              <p className="text-sm text-slate-400 mt-1">{t("cta_desc")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="sm">
                <a href={`mailto:${portfolio.media.email}`} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {t("email")}
                </a>
              </Button>
              <Button asChild size="sm">
                <a href={portfolio.media.likedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" /> {t("linkedin")}
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-xs text-slate-600">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="font-mono">© {new Date().getFullYear()} {portfolio.name}. {t("all_rights")}</p>
            <div className="flex items-center gap-6">
              <a href={portfolio.media.github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition">{t("github")}</a>
              <a href={portfolio.media.likedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition">{t("linkedin")}</a>
              <a href={`mailto:${portfolio.media.email}`} className="hover:text-slate-300 transition">{t("email")}</a>
            </div>
          </div>
        </footer>
      </div>

      <CalWidget />
    </main>
  );
}
