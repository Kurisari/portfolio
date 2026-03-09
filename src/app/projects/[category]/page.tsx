import { notFound } from "next/navigation";
import ProjectsShowcase from "@/components/ProjectsShowcase";

const validCategories = ["ai", "web", "algorithms", "software"] as const;

type Category = (typeof validCategories)[number];

export default async function ProjectsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!validCategories.includes(category as Category)) {
    notFound();
  }

  return <ProjectsShowcase category={category as Category} />;
}

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}
