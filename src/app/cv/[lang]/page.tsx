import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPortfolio, sortProjectsByPriority } from "@/lib/portfolio";

const labels = {
  en: {
    title: "Curriculum Vitae",
    profile: "Profile",
    experience: "Professional Experience",
    education: "Education",
    projects: "Selected Projects",
    skills: "Technical Skills",
    languages: "Languages",
    english: "English",
    englishLevel: "Professional working proficiency",
    achievements: "Certifications and Recognitions",
    print: "Download PDF",
    back: "Back to portfolio",
  },
  es: {
    title: "Curriculum Vitae",
    profile: "Perfil",
    experience: "Experiencia Profesional",
    education: "Formacion Academica",
    projects: "Proyectos Seleccionados",
    skills: "Habilidades Tecnicas",
    languages: "Idiomas",
    english: "Ingles",
    englishLevel: "Nivel profesional de trabajo",
    achievements: "Certificaciones y Reconocimientos",
    print: "Descargar PDF",
    back: "Volver al portafolio",
  },
} as const;

type CvLang = keyof typeof labels;

function cleanText(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "es") notFound();

  const cvLang = lang as CvLang;
  const t = labels[cvLang];
  const portfolio = await loadPortfolio(cvLang);

  const selectedProjects = sortProjectsByPriority(
    portfolio.projects.filter(
      (project) =>
        Array.isArray(project.tags) &&
        (project.tags.includes("recent") || project.tags.includes("featured"))
    )
  ).slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-200 py-8 px-4 print:bg-white print:py-0">
      <div className="mx-auto mb-5 flex max-w-4xl items-center justify-between print:hidden">
        <Link
          href="/"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {t.back}
        </Link>
        <a
          href={`/api/cv/pdf?lang=${cvLang}`}
          className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-black"
        >
          {t.print}
        </a>
      </div>

      <article className="mx-auto max-w-4xl bg-white shadow-xl print:shadow-none">
        <div className="border-b border-slate-200 px-8 pt-10 pb-7">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{portfolio.name}</h1>
          <p className="mt-1 text-sm text-slate-700">{portfolio.skill}</p>
          <p className="mt-3 text-xs text-slate-600">
            {portfolio.location} | {portfolio.media.email} | {portfolio.media.likedin} | {portfolio.media.github}
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">{t.title}</p>
        </div>

        <div className="px-8 py-8 text-sm text-slate-800">
          <section className="mb-6">
            <h2 className="mb-2 border-b border-slate-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {t.profile}
            </h2>
            <p className="leading-relaxed">{cleanText(portfolio.about)}</p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 border-b border-slate-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {t.experience}
            </h2>
            <div className="space-y-3">
              {portfolio.experience.map((item, idx) => (
                <div key={`${item.title}-${idx}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <span className="text-xs text-slate-600">{item.date}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">{item.subtitle}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 border-b border-slate-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {t.education}
            </h2>
            <div className="space-y-3">
              {portfolio.training.map((item, idx) => (
                <div key={`${item.title}-${idx}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <span className="text-xs text-slate-600">{item.date}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">{item.subtitle}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 border-b border-slate-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {t.projects}
            </h2>
            <ul className="space-y-2.5">
              {selectedProjects.map((project) => (
                <li key={project.id}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold text-slate-900">{project.title}</span>
                    <span className="text-[11px] uppercase tracking-wide text-slate-500">{project.category}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed">{project.description}</p>
                  {project.github && (
                    <p className="text-[11px] text-slate-600">{project.github}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 border-b border-slate-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {t.skills}
            </h2>
            <p className="leading-relaxed">{portfolio.technologies.map((tech) => tech.name).join(", ")}</p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 border-b border-slate-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {t.languages}
            </h2>
            <p className="leading-relaxed">{t.english}: {t.englishLevel}</p>
          </section>

          <section>
            <h2 className="mb-2 border-b border-slate-300 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              {t.achievements}
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              {portfolio.extras.slice(0, 6).map((item, idx) => (
                <li key={`${item.title}-${idx}`} className="text-[13px] leading-relaxed">
                  <span className="font-medium">{item.title}.</span> {item.description}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <style>{`
        @page {
          size: A4;
          margin: 12mm;
        }
        @media print {
          html, body {
            background: #ffffff !important;
          }
          main {
            padding: 0 !important;
          }
          article {
            max-width: 100% !important;
          }
        }
      `}</style>
    </main>
  );
}
