"use client";

import { useEffect, useMemo, useState } from "react";

type CvLang = "en" | "es";

type TemplateProject = {
  id: string;
  title: string;
  description: string;
  category: string;
};

type TemplatePayload = {
  lang: CvLang;
  name: string;
  role: string;
  about: string;
  skills: string[];
  projects: TemplateProject[];
};

const UI = {
  es: {
    title: "Generador de CV",
    subtitle: "Personaliza tu CV y descarga el PDF al instante",
    lang: "Idioma del CV",
    about: "About / Resumen profesional",
    skills: "Skills",
    addSkill: "Agregar skill",
    prefix: "Texto para agregar al inicio de TODAS las descripciones",
    suffix: "Texto para agregar al final de TODAS las descripciones",
    projects: "Descripciones por proyecto",
    download: "Descargar PDF personalizado",
    loading: "Cargando plantilla...",
    downloading: "Generando PDF...",
    helper: "Tip: puedes editar solo los proyectos que te interesen para cada vacante.",
  },
  en: {
    title: "CV Generator",
    subtitle: "Customize your CV and download the PDF instantly",
    lang: "CV language",
    about: "About / Professional summary",
    skills: "Skills",
    addSkill: "Add skill",
    prefix: "Text to prepend to ALL project descriptions",
    suffix: "Text to append to ALL project descriptions",
    projects: "Project descriptions",
    download: "Download customized PDF",
    loading: "Loading template...",
    downloading: "Generating PDF...",
    helper: "Tip: edit only the projects relevant to each role before applying.",
  },
} as const;

function fileNameFromDisposition(disposition: string | null, fallback: string): string {
  if (!disposition) return fallback;
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] ?? fallback;
}

export default function CvGeneratorPage() {
  const [lang, setLang] = useState<CvLang>("es");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [projects, setProjects] = useState<TemplateProject[]>([]);
  const [projectDescriptions, setProjectDescriptions] = useState<Record<string, string>>({});

  const t = UI[lang];

  useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      const res = await fetch(`/api/cv/template?lang=${lang}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = (await res.json()) as TemplatePayload;
      if (!active) return;

      setAbout(data.about);
      setSkills(data.skills);
      setProjects(data.projects);
      setProjectDescriptions(Object.fromEntries(data.projects.map((project) => [project.id, project.description])));
      setPrefix("");
      setSuffix("");
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [lang]);

  const totalChars = useMemo(
    () => Object.values(projectDescriptions).reduce((acc, value) => acc + value.length, 0),
    [projectDescriptions]
  );

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.includes(value)) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((item) => item !== skill));
  };

  const updateProjectDescription = (id: string, value: string) => {
    setProjectDescriptions((prev) => ({ ...prev, [id]: value }));
  };

  const download = async () => {
    setDownloading(true);
    try {
      const response = await fetch("/api/cv/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          overrides: {
            about,
            skills,
            projectDescriptionPrefix: prefix,
            projectDescriptionSuffix: suffix,
            projectDescriptions,
          },
        }),
      });

      if (!response.ok) {
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileNameFromDisposition(response.headers.get("content-disposition"), `cv-custom-${lang}.pdf`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="mt-2 text-sm text-slate-400">{t.subtitle}</p>
          <p className="mt-1 text-xs text-slate-500">{t.helper}</p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t.lang}</label>
          <select
            value={lang}
            onChange={(event) => setLang(event.target.value as CvLang)}
            className="w-40 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">{t.loading}</div>
        ) : (
          <>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t.about}</label>
              <textarea
                value={about}
                onChange={(event) => setAbout(event.target.value)}
                rows={5}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
              />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t.skills}</label>
              <div className="mb-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded-full border border-white/15 bg-slate-900 px-3 py-1 text-xs hover:border-red-400"
                    title="Remove"
                  >
                    {skill} x
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
                  placeholder="n8n"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-lg border border-sky-400/40 bg-sky-500/20 px-3 py-2 text-sm"
                >
                  {t.addSkill}
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t.prefix}</label>
              <textarea
                value={prefix}
                onChange={(event) => setPrefix(event.target.value)}
                rows={2}
                className="mb-4 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
              />
              <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">{t.suffix}</label>
              <textarea
                value={suffix}
                onChange={(event) => setSuffix(event.target.value)}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
              />
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{t.projects}</h2>
                <span className="text-xs text-slate-500">{projects.length} projects · {totalChars} chars</span>
              </div>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="mb-2 text-sm font-medium">{project.title}</p>
                    <textarea
                      value={projectDescriptions[project.id] ?? ""}
                      onChange={(event) => updateProjectDescription(project.id, event.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="sticky bottom-4">
              <button
                type="button"
                onClick={download}
                disabled={downloading}
                className="w-full rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-3 text-sm font-medium disabled:opacity-60"
              >
                {downloading ? t.downloading : t.download}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
