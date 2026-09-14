import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import { profile } from "@/lib/profile";
import { rankSkillCategories, pickRelevantProjects, tailoredSummary } from "@/lib/tailor";

export type JobLike = {
  title: string;
  company: string;
  location?: string | null;
  stack?: string | null;
  url: string;
};

const ACCENT = "1D4ED8"; // blue-700, used for headings

function sectionHeading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT },
    },
    children: [new TextRun({ text, bold: true, color: ACCENT })],
  });
}

export async function buildCvDocx(job: JobLike): Promise<Buffer> {
  const stackText = job.stack ?? "";
  const rankedSkills = rankSkillCategories(stackText);
  const projects = pickRelevantProjects(stackText, 3);
  const summary = tailoredSummary(job.title, job.company, stackText);

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: profile.fullName, bold: true, size: 40, color: ACCENT }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [new TextRun({ text: profile.title, italics: true, size: 24 })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${profile.phone} | ${profile.email} | ${profile.location}`,
                size: 18,
              }),
              new TextRun({ text: `  |  ${profile.portfolio}  |  ${profile.linkedin}`, size: 18 }),
            ],
          }),

          sectionHeading("Profil professionnel"),
          new Paragraph({ text: summary, spacing: { after: 160 } }),

          sectionHeading("Compétences techniques"),
          ...rankedSkills.flatMap((cat) => [
            new Paragraph({
              spacing: { before: 80 },
              children: [new TextRun({ text: cat.name, bold: true })],
            }),
            new Paragraph({ text: cat.items.join(" · "), spacing: { after: 80 } }),
          ]),

          sectionHeading("Expérience professionnelle"),
          ...profile.experience.flatMap((exp) => [
            new Paragraph({
              spacing: { before: 120 },
              children: [
                new TextRun({ text: `${exp.role} — `, bold: true }),
                new TextRun({ text: exp.company, bold: true, color: ACCENT }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${exp.location} · ${exp.period}`, italics: true, size: 18 }),
              ],
            }),
            new Paragraph({ text: exp.description, spacing: { after: 100 } }),
          ]),

          sectionHeading("Projets clés"),
          ...projects.flatMap((p) => [
            new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({ text: `${p.name} — `, bold: true }),
                new TextRun({ text: p.url, color: ACCENT }),
              ],
            }),
            new Paragraph({
              spacing: { after: 40 },
              children: [new TextRun({ text: `Stack : ${p.stack.join(", ")}`, italics: true })],
            }),
            new Paragraph({ text: p.description, spacing: { after: 100 } }),
          ]),

          sectionHeading("Formation"),
          ...profile.education.flatMap((ed) => [
            new Paragraph({
              spacing: { before: 80 },
              children: [new TextRun({ text: ed.school, bold: true })],
            }),
            new Paragraph({ text: `${ed.location} · ${ed.period} — ${ed.degree}` }),
          ]),

          sectionHeading("Langues"),
          new Paragraph({
            text: profile.languages.map((l) => `${l.name} (${l.level})`).join(" · "),
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}

export async function buildLetterDocx(job: JobLike): Promise<Buffer> {
  const stackText = job.stack ?? "";
  const projects = pickRelevantProjects(stackText, 2);
  const topSkills = rankSkillCategories(stackText)[0].items.slice(0, 4).join(", ");
  const today = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date());

  const projectSentences = projects
    .map((p) => `${p.name} (${p.stack.join(", ")}) — ${p.description}`)
    .join(" ");

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
        children: [
          new Paragraph({
            children: [new TextRun({ text: profile.fullName, bold: true, size: 26 })],
          }),
          new Paragraph({ text: profile.location }),
          new Paragraph({ text: `${profile.phone} · ${profile.email}` }),
          new Paragraph({ text: profile.linkedin, spacing: { after: 200 } }),

          new Paragraph({ alignment: AlignmentType.RIGHT, text: today, spacing: { after: 200 } }),

          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Objet : Candidature au poste de ${job.title}${
                  job.company ? ` — ${job.company}` : ""
                }`,
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 160 },
            text: `Madame, Monsieur,`,
          }),
          new Paragraph({
            spacing: { after: 160 },
            text: `Développeur Full-Stack Web et Mobile fort de plus de 4 ans d'expérience, je vous adresse ma candidature pour le poste de ${job.title}${
              job.company ? ` au sein de ${job.company}` : ""
            }. Votre offre a immédiatement retenu mon attention, tant les compétences recherchées correspondent à mon parcours et à mes centres d'intérêt techniques.`,
          }),
          new Paragraph({
            spacing: { after: 160 },
            text: `Au cours de mes expériences chez Nextmux, Digital Future Lab et en tant que formateur pour EIG Bénin, j'ai développé une solide maîtrise de ${topSkills}, que j'ai mise en pratique sur des projets concrets. ${projectSentences}`,
          }),
          new Paragraph({
            spacing: { after: 160 },
            text: `Autonome, rigoureux et habitué au travail à distance, je suis en mesure de m'intégrer rapidement à une équipe distribuée et de contribuer dès les premières semaines à vos projets. Je reste également attentif aux bonnes pratiques de code propre, de tests et de collaboration (revue de code, documentation, workflows agiles).`,
          }),
          new Paragraph({
            spacing: { after: 160 },
            text: `Je serais ravi d'échanger avec vous afin de vous présenter plus en détail mes réalisations et ma motivation pour ce poste. Je vous remercie pour l'attention portée à ma candidature et reste à votre disposition pour un entretien.`,
          }),
          new Paragraph({ spacing: { after: 200 }, text: `Cordialement,` }),
          new Paragraph({ children: [new TextRun({ text: profile.fullName, bold: true })] }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc);
}
