import { NextRequest, NextResponse } from "next/server";
import { loadPortfolio, sortProjectsByPriority } from "@/lib/portfolio";

type CvLang = "en" | "es";

function normalizeLang(value: string | null | undefined): CvLang {
  return value === "es" ? "es" : "en";
}

export async function GET(request: NextRequest) {
  const lang = normalizeLang(request.nextUrl.searchParams.get("lang"));
  const portfolio = await loadPortfolio(lang);

  return NextResponse.json({
    lang,
    name: portfolio.name,
    role: portfolio.skill,
    about: portfolio.about,
    skills: portfolio.technologies.map((tech) => tech.name),
    projects: sortProjectsByPriority(portfolio.projects).map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
    })),
  });
}
