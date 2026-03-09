"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  Code2,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  Layers,
  X,
} from "lucide-react";
import { N8n } from "@lobehub/icons";
import { useI18n } from "@/lib/i18n";
import { loadPortfolio, type Portfolio } from "@/lib/portfolio";
import LanguageToggle from "@/components/LanguageToggle";
import HamburgerMenu from "@/components/HamburgerMenu";

type Technology = Portfolio["technologies"][number];
type Project = Portfolio["projects"][number];

type Category = "all" | "ai" | "web" | "algorithms" | "software";

const categories: Category[] = ["all", "ai", "web", "algorithms", "software"];

const techColor = (name: string): string => {
  const colors: Record<string, string> = {
    "Next.js": "#000000",
    TailwindCSS: "#38BDF8",
    "Framer Motion": "#E10098",
    "Shadcn/UI": "#9333EA",
    Python: "#3776AB",
    "C++": "#00599C",
    C: "#A8B9CC",
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

const categoryIcons: Record<Category, ReactNode> = {
  all: <Layers className="h-3.5 w-3.5" />,
  ai: <Brain className="h-3.5 w-3.5" />,
  web: <Globe className="h-3.5 w-3.5" />,
  algorithms: <Code2 className="h-3.5 w-3.5" />,
  software: <Cpu className="h-3.5 w-3.5" />,
};

const categoryPath = (cat: Category) => (cat === "all" ? "/projects" : `/projects/${cat}`);

const partnerBrands = [
  {
    name: "Notaria 71",
    href: "https://notaria71ags.com",
    logo: "/brands/notaria71-logo.png",
  },
  {
    name: "Burkle Fumigaciones",
    href: "https://burklefumigaciones.com",
    logo: "/brands/Burkle Exterminadores.png",
  },
  {
    name: "Garbon Albercas",
    href: "https://garbon.com.mx",
    logo: "/brands/garbon.png",
  },
  {
    name: "Collector's Vault",
    href: "https://thecollectorsvault.com.mx",
    logo: "/brands/collectors.png",
  },
  {
    name: "Universidad Panamericana",
    href: "https://www.up.edu.mx",
    logo: "/brands/Logos_UP.png",
  },
  {
    name: "Foraneos UP",
    href: "https://foreigners-corner-up-ags.odoo.com/",
    logo: "/brands/FOR%C3%81NEOS%20UP.png",
  },
];

export default function ProjectsShowcase({ category = "all" }: { category?: Category }) {
  const { t, lang } = useI18n();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

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

  useEffect(() => {
    if (expandedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expandedProject]);

  const filteredProjects = useMemo(() => {
    if (!portfolio) return [];
    if (category === "all") return portfolio.projects;
    return portfolio.projects.filter((project: Project) => project.category === category);
  }, [portfolio, category]);

  const featuredProject = useMemo(() => filteredProjects.find((project) => project.image), [filteredProjects]);
  const remainingProjects = useMemo(
    () => filteredProjects.filter((project) => project !== featuredProject),
    [filteredProjects, featuredProject]
  );

  if (!portfolio) return null;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 grid-fade" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(96,165,250,0.10),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.06),transparent_45%)]" />

      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-mono text-sm text-slate-500 hover:text-white transition">
            kurisari<span className="text-sky-400">.</span>dev
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <Link href="/projects" className="hover:text-white transition">
              {t("projects")}
            </Link>
            <Link href="/#experience" className="hover:text-white transition">
              {t("experience")}
            </Link>
            <Link href="/#training" className="hover:text-white transition">
              {t("training")}
            </Link>
            <Link href="/#extras" className="hover:text-white transition">
              {t("extras")}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <HamburgerMenu />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        <div className="mb-8">
          <Link
            href={category === "all" ? "/" : "/projects"}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition mb-5"
          >
            <ArrowLeft className="h-4 w-4" />
            {category === "all" ? t("back_home") : t("back_projects")}
          </Link>

          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="gradient-text">
                {category === "all" ? t("all_projects") : t(`cat_${category}`)}
              </span>
            </h1>
            <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
          </div>
          <p className="text-sm text-slate-400 mt-3 max-w-xl">
            {category === "all" ? t("projects_desc") : t("projects_category_desc")}
          </p>
        </div>

        <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const count = cat === "all" ? portfolio.projects.length : portfolio.projects.filter((p: Project) => p.category === cat).length;
            if (cat !== "all" && count === 0) return null;
            const isActive = cat === category;
            return (
              <Link
                key={cat}
                href={categoryPath(cat)}
                className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "border-sky-500/30 bg-sky-500/10 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.1)]"
                    : "border-white/5 bg-white/2 text-slate-500 hover:text-slate-300 hover:border-white/10"
                }`}
              >
                {categoryIcons[cat]}
                {t(`cat_${cat}`)}
                <span className={`ml-0.5 text-[10px] tabular-nums ${isActive ? "text-sky-400/60" : "text-slate-600"}`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {category === "web" && (
          <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-mono uppercase tracking-[0.15em] text-slate-300">{t("brands_title")}</h2>
              <span className="text-[11px] text-slate-500">{t("brands_subtitle")}</span>
            </div>
            <div className="logo-marquee">
              <div className="logo-marquee-track">
                {[...partnerBrands, ...partnerBrands].map((brand, index) => (
                  <a
                    key={`${brand.name}-${index}`}
                    href={brand.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-16 min-w-44 items-center justify-center px-5 py-3 transition-opacity hover:opacity-100 opacity-85"
                    aria-label={brand.name}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={160}
                      height={48}
                      className="h-10 w-auto object-contain transition duration-300 hover:scale-[1.03]"
                    />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <AnimatePresence mode="popLayout">
          {featuredProject && (
            <motion.article
              key={`featured-${featuredProject.title}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              onClick={() => setExpandedProject(featuredProject)}
              className="group relative cursor-pointer rounded-2xl border border-white/5 bg-white/2 hover:border-white/15 transition-all backdrop-blur-sm overflow-hidden mb-4"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative h-52 md:h-auto md:w-1/2 overflow-hidden">
                  <Image
                    src={featuredProject.image!}
                    alt={featuredProject.title}
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-slate-950/40" />
                </div>
                <div className="flex flex-col justify-center p-6 md:w-1/2 md:p-8">
                  <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-sky-400 mb-3">
                    {featuredProject.category === "ai" && <Brain className="h-2.5 w-2.5" />}
                    {featuredProject.category === "web" && <Globe className="h-2.5 w-2.5" />}
                    {featuredProject.category === "algorithms" && <Code2 className="h-2.5 w-2.5" />}
                    {featuredProject.category === "software" && <Cpu className="h-2.5 w-2.5" />}
                    {t(`cat_${featuredProject.category}`)}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold text-slate-50">{featuredProject.title}</h4>
                  <p className="text-xs font-mono text-slate-500 mt-1">{featuredProject.subtitle}</p>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed line-clamp-3">{featuredProject.description}</p>
                  {featuredProject.technologies && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {featuredProject.technologies.map((tech: Technology, idx: number) => (
                        <span
                          key={`${tech.name}-${idx}`}
                          className="rounded-full border border-white/5 px-2.5 py-0.5 text-[11px] text-slate-400"
                          style={{ background: `linear-gradient(135deg, ${techColor(tech.name)}10, transparent)` }}
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>

        <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {remainingProjects.map((project: Project, i: number) => (
              <motion.article
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                onClick={() => setExpandedProject(project)}
                className="group relative cursor-pointer rounded-2xl border border-white/5 bg-white/2 p-5 hover:border-white/15 transition-all backdrop-blur-sm"
              >
                {project.image && (
                  <div className="relative mb-4 h-40 w-full overflow-hidden rounded-xl border border-white/5">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                    {project.technologies.slice(0, 4).map((tech: Technology, idx: number) => (
                      <span
                        key={`${tech.name}-${idx}`}
                        className="rounded-full border border-white/5 px-2 py-0.5 text-[10px] text-slate-500"
                        style={{ background: `linear-gradient(135deg, ${techColor(tech.name)}10, transparent)` }}
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="rounded-full border border-white/5 px-2 py-0.5 text-[10px] text-slate-600">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-3.5 flex gap-3">
                  {project.github && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 group-hover:text-slate-400 transition">
                      <Github className="h-3 w-3" /> {t("code")}
                    </span>
                  )}
                  {project.url && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 group-hover:text-sky-400/70 transition">
                      <ExternalLink className="h-3 w-3" /> {t("preview")}
                    </span>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <footer className="border-t border-white/5 py-8 mt-20 text-xs text-slate-600">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="font-mono">
              © {new Date().getFullYear()} {portfolio.name}. {t("all_rights")}
            </p>
            <div className="flex items-center gap-6">
              <a href={portfolio.media.github} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition">
                {t("github")}
              </a>
              <a href={portfolio.media.likedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition">
                {t("linkedin")}
              </a>
              <a href={`mailto:${portfolio.media.email}`} className="hover:text-slate-300 transition">
                {t("email")}
              </a>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {expandedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedProject(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] z-50 mx-auto max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl"
            >
              <button
                onClick={() => setExpandedProject(null)}
                className="absolute top-4 right-4 rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>

              {expandedProject.image && (
                <div className="relative mb-6 h-52 md:h-64 w-full overflow-hidden rounded-xl border border-white/5">
                  <Image
                    src={expandedProject.image}
                    alt={expandedProject.title}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 640px"
                  />
                </div>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/3 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-3">
                {expandedProject.category === "ai" && <Brain className="h-3 w-3" />}
                {expandedProject.category === "web" && <Globe className="h-3 w-3" />}
                {expandedProject.category === "algorithms" && <Code2 className="h-3 w-3" />}
                {expandedProject.category === "software" && <Cpu className="h-3 w-3" />}
                {t(`cat_${expandedProject.category}`)}
              </span>

              <h3 className="text-2xl font-bold text-slate-50 mt-2">{expandedProject.title}</h3>
              <p className="text-sm font-mono text-slate-500 mt-1">{expandedProject.subtitle}</p>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">{expandedProject.description}</p>

              {expandedProject.technologies && (
                <div className="mt-5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600 mb-2.5">Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {expandedProject.technologies.map((tech: Technology, idx: number) => (
                      <span
                        key={`${tech.name}-${idx}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/5 px-3 py-1 text-xs text-slate-300"
                        style={{ background: `linear-gradient(135deg, ${techColor(tech.name)}15, transparent)` }}
                      >
                        {tech.name === "N8N" ? <N8n size={14} /> : <i className={`${tech.icon} text-sm`} />}
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {expandedProject.github && (
                  <a
                    href={expandedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:border-white/20 transition-colors"
                  >
                    <Github className="h-4 w-4" /> {t("code")}
                  </a>
                )}
                {expandedProject.url && (
                  <a
                    href={expandedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-300 hover:bg-sky-500/20 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> {t("preview")}
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
