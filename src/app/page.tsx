"use client";
import { motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Linkedin, FileText, Mail } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";
import { useEffect, useState } from "react";
// Removed unused GitHubCalendar import

type Portfolio = typeof import("@/data/portfolio.en.json");
type Technology = Portfolio["technologies"][number];
type Project = Portfolio["projects"][number];
type Experience = Portfolio["experience"][number];
type Training = Portfolio["training"][number];
type Extra = Portfolio["extras"][number];

// Lazy load below-the-fold widget for performance
const CalWidget = dynamic(() => import("@/components/CalWidget"), { ssr: false });

// Map technology name to a base color (used to build gradients)
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
      const mod = lang === "es"
        ? await import("@/data/portfolio.es.json")
        : await import("@/data/portfolio.en.json");
      const data = mod.default as Portfolio;
      if (active) setPortfolio(data);
    })();
    return () => { active = false; };
  }, [lang]);
  if (!portfolio) return null;
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Semantic H1 for SEO at top of main */}
      <h1 className="sr-only">
        {portfolio.name} — {t("skill")}
      </h1>
      <header className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md border-b border-white/10 z-50">
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-center md:justify-between items-center py-4 text-center md:text-left">
          <p className="hidden md:block text-lg font-bold text-white" aria-hidden="true">{portfolio.name}</p>
          <nav className="flex gap-6 text-gray-300">
            <a href="#projects" className="hover:text-white transition">{t("projects")}</a>
            <a href="#experience" className="hover:text-white transition">{t("experience")}</a>
            <a href="#training" className="hover:text-white transition">{t("training")}</a>
            <a href="#extras" className="hover:text-white transition">{t("extras")}</a>
          </nav>
          <LanguageToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 mx-auto w-full max-w-[900px] px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
            <AvatarImage src={portfolio.avatar} alt={portfolio.name} />
          </Avatar>
        </motion.div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <span className="px-4 py-1 rounded-full border border-green-400/50 bg-green-600/20 text-green-300 text-sm font-medium">
            {t("available")}
          </span>
          <motion.h1
            className="text-5xl font-extrabold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            {portfolio.name}
          </motion.h1>
          <p className="text-lg text-gray-300 hover:text-gray-200 transition-colors">
            {t("skill")}
          </p>
        </div>
        <div className="flex gap-4 mt-6">
          <Button asChild>
            <a href={portfolio.media.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-purple-400/50 bg-purple-600/20 hover:bg-purple-600/30 transition">
              <Github className="w-4 h-4" /> {t("github")}
            </a>
          </Button>
          <Button asChild>
            <a
              href={portfolio.media.likedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-blue-400/50 bg-blue-600/20 hover:bg-blue-600/30 transition"
            >
              <Linkedin className="w-4 h-4" /> {t("linkedin")}
            </a>
          </Button>
          <Button asChild>
            <a
              href={portfolio.media.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-green-400/50 bg-green-600/20 hover:bg-green-600/30 transition"
            >
              <FileText className="w-4 h-4" /> {t("cv")}
            </a>
          </Button>
          <Button asChild>
            <a
              href={`mailto:${portfolio.media.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-yellow-400/50 bg-yellow-600/20 hover:bg-yellow-600/30 transition"
            >
              <Mail className="w-4 h-4" /> {t("email")}
            </a>
          </Button>
        </div>

        {/* About Section */}
        <section id="about" className="mx-auto w-full max-w-[900px] py-12 px-4 sm:px-6 md:px-8 text-center">
          <p className="text-lg leading-relaxed text-gray-300" dangerouslySetInnerHTML={{ __html: t("about") }} />
        </section>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {portfolio.technologies.map((tech: Technology, i: number) => (
            <motion.div
              key={`${tech.name}-${tech.icon}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:scale-105 hover:shadow-lg transition-transform duration-300"
              style={{
                background: `
                  linear-gradient(
                    135deg,
                    ${techColor(tech.name)}80,
                    rgba(255,255,255,0.1)
                  )
                `,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff"
              }}
            >
              <i
                className={`${tech.icon} text-2xl`}
              ></i>
              <span>{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="mx-auto w-full max-w-[1100px] py-16 px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">{t("projects")}</h2>
        <div className="space-y-12">
          {portfolio.projects.map((project: Project, i: number) => (
            <motion.div
              key={`${project.title}-${i}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: false, amount: 0.2 }}
              className="flex flex-col md:flex-row gap-6 items-start group"
            >
              {project.image && (
                <div className="md:w-1/2 w-full overflow-hidden rounded-xl shadow-md">
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      priority={i === 0}
                    />
                  </div>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-300 hover:text-gray-200 transition-colors mb-2">{project.subtitle}</p>
                <p className="mt-2 text-base text-gray-300 hover:text-gray-200 transition-colors">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.map((tech: Technology, idx: number) => (
                      <span
                        key={`${tech.name}-${idx}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:scale-105 transition-transform duration-200"
                        style={{
                          background: `
                            linear-gradient(
                              135deg,
                              ${techColor(tech.name)}80,
                              rgba(255,255,255,0.1)
                            )
                          `,
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1px solid rgba(255,255,255,0.2)"
                        }}
                      >
                        <i className={`${tech.icon} text-base`}></i>
                        <span>{tech.name}</span>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-purple-400/50 bg-purple-600/20 hover:bg-purple-600/30 transition"
                    >
                      <i className="devicon-github-original text-lg"></i> {t("code")}
                    </a>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-pink-400/50 bg-pink-600/20 hover:bg-pink-600/30 transition"
                    >
                      <ExternalLink className="w-4 h-4" /> {t("preview")}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="mx-auto w-full max-w-[1100px] py-16 px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">{t("experience")}</h2>
        <div className="relative border-l border-gray-700 pl-6">
          {portfolio.experience.map((exp: Experience, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: false, amount: 0.2 }}
              className="mb-10"
            >
              <div className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 border border-white/20"></div>
              <h3 className="text-lg font-bold text-blue-400">{exp.title}</h3>
              <p className="text-gray-300 font-medium">{exp.subtitle}</p>
              <p className="text-sm text-gray-400">{exp.date}</p>
              <p className="mt-2 text-sm text-gray-300">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Training Section */}
      <section id="training" className="mx-auto w-full max-w-[1100px] py-16 px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">{t("training")}</h2>
        <div className="space-y-8">
          {portfolio.training.map((train: Training, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: false, amount: 0.2 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-xl bg-blue-600/20 border border-blue-400/30 text-blue-400 font-bold text-sm flex-col">
                <span>{train.date.split(" ")[0]}</span>
                <span>{train.date.split(" ")[1]}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{train.title}</h3>
                <p className="text-gray-300 font-medium">{train.subtitle}</p>
                <p className="mt-2 text-sm text-gray-400">{train.description}</p>
                <p className="text-xs text-gray-500 mt-1">{train.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Extras Section */}
      <section id="extras" className="mx-auto w-full max-w-[1100px] py-16 px-4 sm:px-6 md:px-8">
        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">{t("extras")}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {portfolio.extras.map((extra: Extra, i: number) => (
            <motion.a
              key={i}
              href={extra.url || "#"}
              target={extra.url ? "_blank" : undefined}
              rel={extra.url ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-xl p-3 transition-transform duration-300 hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(236,72,153,0.06)), rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={extra.image}
                    alt={extra.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                  />
                </div>
              </div>
              <h3 className="mt-3 text-lg font-bold text-white">{extra.title}</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors">{extra.description}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <footer className="bg-gradient-to-r from-gray-950 via-gray-900 to-black border-t border-white/10 py-6 mt-12">
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <p>© {new Date().getFullYear()} {portfolio.name}. {t("all_rights")}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href={portfolio.media.github} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">{t("github")}</a>
            <a href={portfolio.media.likedin} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">{t("linkedin")}</a>
            <a href={`mailto:${portfolio.media.email}`} className="hover:text-pink-400 transition">{t("email")}</a>
          </div>
        </div>
      </footer>
      <CalWidget />
    </main>
  );
}