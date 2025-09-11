"use client";
import { motion } from "framer-motion";
import portfolio from "@/data/portfolio.json";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Linkedin, FileText, Mail } from "lucide-react";
import CalWidget from "@/components/CalWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <header className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center py-4 px-6 text-center md:text-left">
          <h1 className="hidden md:block text-lg font-bold text-white">{portfolio.name}</h1>
          <nav className="flex gap-6 text-gray-300">
            <a href="#projects" className="hover:text-white transition">Projects</a>
            <a href="#experience" className="hover:text-white transition">Experience</a>
            <a href="#training" className="hover:text-white transition">Training</a>
            <a href="#extras" className="hover:text-white transition">Extras</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32">
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
            Available for work
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
            {portfolio.skill}
          </p>
        </div>
        <div className="flex gap-4 mt-6">
          <Button asChild>
            <a href={portfolio.media.github} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-purple-400/50 bg-purple-600/20 hover:bg-purple-600/30 transition">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </Button>
          <Button asChild>
            <a
              href={portfolio.media.likedin}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-blue-400/50 bg-blue-600/20 hover:bg-blue-600/30 transition"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </Button>
          <Button asChild>
            <a
              href={portfolio.media.cv}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-green-400/50 bg-green-600/20 hover:bg-green-600/30 transition"
            >
              <FileText className="w-4 h-4" /> CV
            </a>
          </Button>
          <Button asChild>
            <a
              href={`mailto:${portfolio.media.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-yellow-400/50 bg-yellow-600/20 hover:bg-yellow-600/30 transition"
            >
              <Mail className="w-4 h-4" /> Email
            </a>
          </Button>
        </div>

        {/* About Section */}
        <section id="about" className="max-w-4xl mx-auto py-12 px-6 text-center">
          <p className="text-lg leading-relaxed text-gray-300">
            I am an <span className="text-blue-400 font-semibold">Artificial Intelligence Engineer</span> with experience in software development and web applications. Passionate about <span className="text-blue-400 font-semibold">technology</span> and <span className="text-blue-400 font-semibold">programming</span>, I am committed to continuous learning and enjoy tackling new challenges. I am <span className="text-blue-400 font-semibold">proactive</span>, <span className="text-blue-400 font-semibold">responsible</span>, and dedicated to my work.
          </p>
        </section>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {portfolio.technologies.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:scale-105 hover:shadow-lg transition-transform duration-300"
              style={{
                background: `
                  linear-gradient(
                    135deg,
                    ${tech.name === "Next.js" ? "#000000" :
                    tech.name === "TailwindCSS" ? "#38BDF8" :
                      tech.name === "Framer Motion" ? "#E10098" :
                        tech.name === "Shadcn/UI" ? "#9333EA" :
                          tech.name === "Python" ? "#3776AB" :
                            tech.name === "C++" ? "#00599C" :
                              tech.name === "Java" ? "#007396" :
                                tech.name === "JavaScript" ? "#F7DF1E" :
                                  tech.name === "React" ? "#61DAFB" :
                                    tech.name === "Material UI" ? "#007FFF" :
                                      tech.name === "Firebase" ? "#FFCA28" :
                                        tech.name === "PyTorch" ? "#EE4C2C" :
                                          tech.name === "HTML" ? "#E34F26" :
                                            tech.name === "CSS" ? "#1572B6" :
                                              tech.name === "GitHub" ? "#181717" :
                                                tech.name === "Reflex" ? "#06B6D4" :
                                                  "#444"
                  }80,
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
      <section id="projects" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">Projects</h2>
        <div className="space-y-12">
          {portfolio.projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              viewport={{ once: false, amount: 0.2 }}
              className="flex flex-col md:flex-row gap-6 items-start group"
            >
              {project.image && (
                <div className="md:w-1/2 w-full overflow-hidden rounded-xl shadow-md">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-300 hover:text-gray-200 transition-colors mb-2">{project.subtitle}</p>
                <p className="mt-2 text-base text-gray-300 hover:text-gray-200 transition-colors">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white hover:scale-105 transition-transform duration-200"
                        style={{
                          background: `
                            linear-gradient(
                              135deg,
                              ${tech.name === "Next.js" ? "#000000" :
                              tech.name === "TailwindCSS" ? "#38BDF8" :
                                tech.name === "Framer Motion" ? "#E10098" :
                                  tech.name === "Shadcn/UI" ? "#9333EA" :
                                    tech.name === "Python" ? "#3776AB" :
                                      tech.name === "C++" ? "#00599C" :
                                        tech.name === "Java" ? "#007396" :
                                          tech.name === "JavaScript" ? "#F7DF1E" :
                                            tech.name === "React" ? "#61DAFB" :
                                              tech.name === "Material UI" ? "#007FFF" :
                                                tech.name === "Firebase" ? "#FFCA28" :
                                                  tech.name === "PyTorch" ? "#EE4C2C" :
                                                    tech.name === "HTML" ? "#E34F26" :
                                                      tech.name === "CSS" ? "#1572B6" :
                                                        tech.name === "GitHub" ? "#181717" :
                                                          tech.name === "Reflex" ? "#06B6D4" :
                                                            "#444"
                            }80,
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
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-purple-400/50 bg-purple-600/20 hover:bg-purple-600/30 transition"
                    >
                      <i className="devicon-github-original text-lg"></i> Code
                    </a>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white border border-pink-400/50 bg-pink-600/20 hover:bg-pink-600/30 transition"
                    >
                      <ExternalLink className="w-4 h-4" /> Preview
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">Experience</h2>
        <div className="relative border-l border-gray-700 pl-6">
          {portfolio.experience.map((exp, i) => (
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
      <section id="training" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">Training</h2>
        <div className="space-y-8">
          {portfolio.training.map((train, i) => (
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
      <section id="extras" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">Extras</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {portfolio.extras.map((extra, i) => (
            <motion.a
              key={i}
              href={extra.url || "#"}
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-2 hover:scale-105 transition-transform duration-300"
            >
              <img src={extra.image} alt={extra.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              <h3 className="text-lg font-bold text-white">{extra.title}</h3>
              <p className="text-gray-300 text-sm hover:text-gray-200 transition-colors">{extra.description}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <footer className="bg-gradient-to-r from-gray-950 via-gray-900 to-black border-t border-white/10 py-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-gray-400">
          <p>© {new Date().getFullYear()} {portfolio.name}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href={portfolio.media.github} target="_blank" className="hover:text-pink-400 transition">GitHub</a>
            <a href={portfolio.media.likedin} target="_blank" className="hover:text-pink-400 transition">LinkedIn</a>
            <a href={`mailto:${portfolio.media.email}`} className="hover:text-pink-400 transition">Email</a>
          </div>
        </div>
      </footer>
      <CalWidget />
    </main>
  );
}