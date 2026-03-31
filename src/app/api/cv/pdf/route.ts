import { NextRequest, NextResponse } from "next/server";
import { PDFArray, PDFDocument, PDFName, PDFString, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { loadPortfolio, sortProjectsByPriority } from "@/lib/portfolio";

type CvLang = "en" | "es";

const labels: Record<CvLang, Record<string, string>> = {
  en: {
    title: "Curriculum Vitae",
    profileSummary: "Professional Summary",
    profile: "Profile",
    experience: "Professional Experience",
    education: "Education",
    projects: "Project Portfolio",
    featuredProjects: "Featured Projects",
    otherProjects: "Other Projects",
    skills: "Technical Skills",
    languages: "Languages",
    stack: "Stack",
    links: "Links",
    english: "English",
    englishLevel: "Professional working proficiency",
    achievements: "Certifications and Recognitions",
  },
  es: {
    title: "Curriculum Vitae",
    profileSummary: "Resumen Profesional",
    profile: "Perfil",
    experience: "Experiencia Profesional",
    education: "Formacion Academica",
    projects: "Portafolio de Proyectos",
    featuredProjects: "Proyectos Destacados",
    otherProjects: "Otros Proyectos",
    skills: "Habilidades Tecnicas",
    languages: "Idiomas",
    stack: "Stack",
    links: "Enlaces",
    english: "Ingles",
    englishLevel: "Nivel profesional de trabajo",
    achievements: "Certificaciones y Reconocimientos",
  },
};

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const MARGIN = 44;
const PORTFOLIO_URL = "https://www.kurisari.dev";

function cleanText(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, size);

    if (width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

export async function GET(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get("lang");
  const lang: CvLang = langParam === "es" ? "es" : "en";
  const t = labels[lang];

  const portfolio = await loadPortfolio(lang);

  const allProjects = sortProjectsByPriority(portfolio.projects);
  const featuredProjects = allProjects.filter(
    (project) => Array.isArray(project.tags) && (project.tags.includes("top") || project.tags.includes("featured") || project.tags.includes("recent"))
  ).slice(0, 6);
  const featuredIds = new Set(featuredProjects.map((project) => project.id));
  const otherProjects = allProjects.filter((project) => !featuredIds.has(project.id));

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;
  const pages = [page];

  const line = (text: string, x: number, size = 10, isBold = false, color = rgb(0.1, 0.1, 0.12)) => {
    page.drawText(text, { x, y, size, font: isBold ? bold : font, color });
  };

  const linkLine = (
    text: string,
    url: string,
    x: number,
    size = 9,
    isBold = false,
    color = rgb(0.1, 0.3, 0.65)
  ) => {
    const selectedFont = isBold ? bold : font;
    page.drawText(text, {
      x,
      y,
      size,
      font: selectedFont,
      color,
    });

    const width = selectedFont.widthOfTextAtSize(text, size);
    const height = size + 2;
    const linkRect = [x, y - 1, x + width, y + height] as [number, number, number, number];

    const annotation = pdfDoc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: linkRect,
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFString.of(url),
      },
    });

    const annots = page.node.lookup(PDFName.of("Annots"), PDFArray);
    if (annots) {
      annots.push(annotation);
    } else {
      page.node.set(PDFName.of("Annots"), pdfDoc.context.obj([annotation]));
    }
  };

  const ensureSpace = (requiredHeight: number) => {
    if (y < MARGIN + requiredHeight) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      pages.push(page);
      y = A4_HEIGHT - MARGIN;
    }
  };

  const paragraph = (text: string, x: number, size = 10, leading = 14) => {
    const maxWidth = A4_WIDTH - MARGIN * 2;
    const lines = wrapText(text, font, size, maxWidth);
    for (const l of lines) {
      ensureSpace(30);
      line(l, x, size);
      y -= leading;
    }
  };

  const linkParagraph = (text: string, url: string, x: number, size = 9, leading = 12) => {
    const maxWidth = A4_WIDTH - MARGIN * 2;
    const lines = wrapText(text, font, size, maxWidth);
    for (const l of lines) {
      ensureSpace(30);
      linkLine(l, url, x, size, false);
      y -= leading;
    }
  };

  const sectionTitle = (title: string) => {
    y -= 10;
    ensureSpace(40);
    line(title.toUpperCase(), MARGIN, 9, true, rgb(0.2, 0.2, 0.25));
    y -= 8;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: A4_WIDTH - MARGIN, y },
      thickness: 0.8,
      color: rgb(0.8, 0.8, 0.82),
    });
    y -= 16;
  };

  const chipsLine = (items: string[]) => {
    const text = items.filter(Boolean).join(" | ");
    paragraph(text, MARGIN, 9, 12);
  };

  const getAtsKeywords = (): string[] => {
    const techKeywords = portfolio.technologies.map((tech) => tech.name);
    const tagKeywords = Array.from(
      new Set(
        portfolio.projects
          .flatMap((project) => (Array.isArray(project.tags) ? project.tags : []))
          .map((tag) => String(tag).trim())
          .filter(Boolean)
      )
    );

    const fixedKeywords = lang === "es"
      ? ["automatizacion", "integraciones", "apis", "webhooks", "analitica", "ia", "llm", "escalabilidad"]
      : ["automation", "integrations", "apis", "webhooks", "analytics", "ai", "llm", "scalability"];

    return Array.from(new Set([...techKeywords, ...tagKeywords, ...fixedKeywords])).slice(0, 20);
  };

  const drawProject = (index: number, item: (typeof allProjects)[number]) => {
    ensureSpace(70);

    const title = `${index + 1}. ${item.title}`;
    line(title, MARGIN, 10.5, true, rgb(0.08, 0.08, 0.1));

    const category = (item.category || "").toUpperCase();
    if (category) {
      line(
        category,
        A4_WIDTH - MARGIN - bold.widthOfTextAtSize(category, 8),
        8,
        true,
        rgb(0.35, 0.35, 0.4)
      );
    }

    y -= 12;

    if (item.subtitle) {
      line(item.subtitle, MARGIN, 9, false, rgb(0.32, 0.32, 0.37));
      y -= 11;
    }

    paragraph(item.description, MARGIN, 9.5, 12.5);

    const stack = item.technologies?.map((tech) => tech.name).filter(Boolean) ?? [];
    if (stack.length > 0) {
      line(`${t.stack}: ${stack.join(", ")}`, MARGIN, 8.5, false, rgb(0.28, 0.28, 0.34));
      y -= 11;
    }

    const links = [item.url, item.github].filter(Boolean) as string[];
    if (links.length > 0) {
      line(`${t.links}:`, MARGIN, 8, true, rgb(0.32, 0.32, 0.37));
      y -= 10;
      for (const link of links) {
        linkParagraph(`- ${link}`, link, MARGIN + 10, 8, 10);
      }
    }

    y -= 4;
  };

  const drawCompactProject = (index: number, item: (typeof allProjects)[number]) => {
    ensureSpace(32);
    line(`${index + 1}. ${item.title}`, MARGIN, 9.5, true, rgb(0.12, 0.12, 0.16));
    const category = (item.category || "").toUpperCase();
    if (category) {
      line(
        category,
        A4_WIDTH - MARGIN - bold.widthOfTextAtSize(category, 7.5),
        7.5,
        true,
        rgb(0.38, 0.38, 0.42)
      );
    }
    y -= 11;
    const stack = item.technologies?.map((tech) => tech.name).filter(Boolean).slice(0, 5) ?? [];
    if (stack.length > 0) {
      paragraph(`${t.stack}: ${stack.join(", ")}`, MARGIN, 8.2, 10.5);
    }
    if (item.url || item.github) {
      const links = [item.url, item.github].filter(Boolean) as string[];
      line(`${t.links}:`, MARGIN, 7.8, true, rgb(0.32, 0.32, 0.37));
      y -= 9;
      for (const link of links) {
        linkParagraph(`- ${link}`, link, MARGIN + 10, 7.8, 10);
      }
    }
    y -= 2;
  };

  line(portfolio.name, MARGIN, 22, true);
  y -= 24;
  line(portfolio.skill, MARGIN, 11, false, rgb(0.28, 0.28, 0.33));
  y -= 16;
  line(portfolio.location, MARGIN, 9, false, rgb(0.35, 0.35, 0.4));
  y -= 12;
  linkLine(portfolio.media.email, `mailto:${portfolio.media.email}`, MARGIN, 9);
  y -= 11;
  linkLine(portfolio.media.likedin, portfolio.media.likedin, MARGIN, 9);
  y -= 11;
  linkLine(portfolio.media.github, portfolio.media.github, MARGIN, 9);
  y -= 11;
  linkLine(PORTFOLIO_URL, PORTFOLIO_URL, MARGIN, 9);
  y -= 14;
  line(t.title, MARGIN, 8, true, rgb(0.42, 0.42, 0.48));
  y -= 8;

  sectionTitle(t.profileSummary);
  paragraph(cleanText(portfolio.about), MARGIN, 10, 14);

  sectionTitle(t.skills);
  chipsLine(portfolio.technologies.map((tech) => tech.name));
  paragraph(getAtsKeywords().join(" | "), MARGIN, 8.2, 10.5);

  sectionTitle(t.languages);
  paragraph(`${t.english}: ${t.englishLevel}`, MARGIN, 10, 13);

  sectionTitle(t.profile);
  chipsLine([
    `${portfolio.location}`,
    portfolio.isAvailable
      ? (lang === "es" ? "Disponible para nuevas oportunidades" : "Open to new opportunities")
      : (lang === "es" ? "No disponible actualmente" : "Not currently available"),
  ]);
  linkParagraph(portfolio.media.email, `mailto:${portfolio.media.email}`, MARGIN, 9, 11);
  linkParagraph(portfolio.media.likedin, portfolio.media.likedin, MARGIN, 9, 11);
  linkParagraph(portfolio.media.github, portfolio.media.github, MARGIN, 9, 11);
  linkParagraph(PORTFOLIO_URL, PORTFOLIO_URL, MARGIN, 9, 11);

  sectionTitle(t.experience);
  for (const item of portfolio.experience) {
    line(item.title, MARGIN, 11, true);
    line(item.date, A4_WIDTH - MARGIN - bold.widthOfTextAtSize(item.date, 9), 9, false, rgb(0.35, 0.35, 0.4));
    y -= 14;
    line(item.subtitle, MARGIN, 9, true, rgb(0.3, 0.3, 0.35));
    y -= 12;
    paragraph(item.description, MARGIN, 10, 13);
    y -= 6;
  }

  sectionTitle(t.education);
  for (const item of portfolio.training) {
    line(item.title, MARGIN, 11, true);
    line(item.date, A4_WIDTH - MARGIN - bold.widthOfTextAtSize(item.date, 9), 9, false, rgb(0.35, 0.35, 0.4));
    y -= 14;
    line(item.subtitle, MARGIN, 9, true, rgb(0.3, 0.3, 0.35));
    y -= 12;
    paragraph(item.description, MARGIN, 10, 13);
    y -= 6;
  }

  sectionTitle(t.projects);
  sectionTitle(t.featuredProjects);
  for (let i = 0; i < featuredProjects.length; i += 1) {
    drawProject(i, featuredProjects[i]);
  }

  if (otherProjects.length > 0) {
    sectionTitle(t.otherProjects);
    for (let i = 0; i < otherProjects.length; i += 1) {
      drawCompactProject(i + featuredProjects.length, otherProjects[i]);
    }
  }

  sectionTitle(t.achievements);
  for (const item of portfolio.extras.slice(0, 6)) {
    paragraph(`- ${item.title}. ${item.description}`, MARGIN, 10, 13);
    if (item.url) {
      linkParagraph(item.url, item.url, MARGIN + 10, 8.2, 10.5);
    }
  }

  pages.forEach((p, idx) => {
    const pageNumber = `${idx + 1}/${pages.length}`;
    p.drawText(pageNumber, {
      x: A4_WIDTH - MARGIN - font.widthOfTextAtSize(pageNumber, 8),
      y: 18,
      size: 8,
      font,
      color: rgb(0.45, 0.45, 0.5),
    });
  });

  const pdfBytes = await pdfDoc.save();
  // Normalize to an ArrayBuffer-backed view to satisfy strict BodyInit typings on Node 24.
  const normalizedBytes = Uint8Array.from(pdfBytes);
  const filename = `cv-${portfolio.name.toLowerCase().replace(/\s+/g, "-")}-${lang}.pdf`;

  return new NextResponse(normalizedBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
