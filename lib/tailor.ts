import { profile, type Project, type SkillCategory } from "@/lib/profile";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Orders skill categories so the ones matching the job's stack come first. */
export function rankSkillCategories(jobStackText: string): SkillCategory[] {
  const haystack = normalize(jobStackText || "");
  const scored = profile.skills.map((category) => {
    const score = category.keywords.reduce(
      (acc, kw) => (haystack.includes(normalize(kw)) ? acc + 1 : acc),
      0,
    );
    return { category, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.category);
}

/** Picks the projects most relevant to the job's stack, falling back to the
 * most recent ones if nothing matches. */
export function pickRelevantProjects(jobStackText: string, limit = 3): Project[] {
  const haystack = normalize(jobStackText || "");
  const scored = profile.projects.map((project) => {
    const score = project.stack.reduce(
      (acc, tech) => (haystack.includes(normalize(tech)) ? acc + 1 : acc),
      0,
    );
    return { project, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.project);
}

export function tailoredSummary(jobTitle: string, company: string, jobStackText: string) {
  const topCategory = rankSkillCategories(jobStackText)[0];
  const highlight = topCategory.items.slice(0, 3).join(", ");
  return `${profile.summary} Actuellement en recherche d'un poste de ${jobTitle}${
    company ? ` chez ${company}` : ""
  }, avec une expertise directement mobilisable en ${highlight}.`;
}
