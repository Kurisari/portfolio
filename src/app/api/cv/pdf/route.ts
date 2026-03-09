import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { loadPortfolio, sortProjectsByPriority } from "@/lib/portfolio";

type CvLang = "en" | "es";

const labels: Record<CvLang, Record<string, string>> = {
  en: {
    title: "Curriculum Vitae",
    profile: "Profile",
    experience: "Professional Experience",
    education: "Education",
    projects: "Selected Projects",
    skills: "Technical Skills",
    achievements: "Certifications and Recognitions",
  },
  es: {
    title: "Curriculum Vitae",
    profile: "Perfil",
    experience: "Experiencia Profesional",
    education: "Formacion Academica",
    projects: "Proyectos Seleccionados",
    skills: "Habilidades Tecnicas",
    achievements: "Certificaciones y Reconocimientos",
  },
};

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const MARGIN = 44;

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

  const selectedProjects = sortProjectsByPriority(
    portfolio.projects.filter(
      (project) =>
        Array.isArray(project.tags) &&
        (project.tags.includes("recent") || project.tags.includes("featured"))
    )
  ).slice(0, 8);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - MARGIN;

  const line = (text: string, x: number, size = 10, isBold = false, color = rgb(0.1, 0.1, 0.12)) => {
    page.drawText(text, { x, y, size, font: isBold ? bold : font, color });
  };

  const paragraph = (text: string, x: number, size = 10, leading = 14) => {
    const maxWidth = A4_WIDTH - MARGIN * 2;
    const lines = wrapText(text, font, size, maxWidth);
    for (const l of lines) {
      if (y < MARGIN + 30) {
        page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        y = A4_HEIGHT - MARGIN;
      }
      line(l, x, size);
      y -= leading;
    }
  };

  const sectionTitle = (title: string) => {
    y -= 10;
    if (y < MARGIN + 40) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      y = A4_HEIGHT - MARGIN;
    }
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

  line(portfolio.name, MARGIN, 22, true);
  y -= 24;
  line(portfolio.skill, MARGIN, 11, false, rgb(0.28, 0.28, 0.33));
  y -= 16;
  line(
    `${portfolio.location} | ${portfolio.media.email} | ${portfolio.media.likedin} | ${portfolio.media.github}`,
    MARGIN,
    9,
    false,
    rgb(0.35, 0.35, 0.4)
  );
  y -= 18;
  line(t.title, MARGIN, 8, true, rgb(0.42, 0.42, 0.48));
  y -= 8;

  sectionTitle(t.profile);
  paragraph(cleanText(portfolio.about), MARGIN, 10, 14);

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
  for (const item of selectedProjects) {
    line(`${item.title} (${item.category})`, MARGIN, 10, true);
    y -= 12;
    paragraph(item.description, MARGIN, 10, 13);
    if (item.github) {
      line(item.github, MARGIN, 8, false, rgb(0.3, 0.3, 0.35));
      y -= 12;
    }
    y -= 4;
  }

  sectionTitle(t.skills);
  paragraph(portfolio.technologies.map((tech) => tech.name).join(", "), MARGIN, 10, 13);

  sectionTitle(t.achievements);
  for (const item of portfolio.extras.slice(0, 6)) {
    paragraph(`- ${item.title}. ${item.description}`, MARGIN, 10, 13);
  }

  const pdfBytes = await pdfDoc.save();
  const body = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);
  const filename = `cv-${portfolio.name.toLowerCase().replace(/\s+/g, "-")}-${lang}.pdf`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
