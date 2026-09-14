import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const jobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().nullish(),
  remoteType: z.string().nullish(),
  salaryMin: z.number().int().nullish(),
  salaryMax: z.number().int().nullish(),
  stack: z.string().nullish(),
  url: z.string().url(),
  source: z.string().nullish(),
  postedAt: z.coerce.date().nullish(),
  description: z.string().nullish(),
});

const bodySchema = z.object({
  jobs: z.array(jobSchema).min(1).max(100),
});

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!process.env.INGEST_TOKEN || token !== process.env.INGEST_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }

  let created = 0;
  let updated = 0;

  for (const job of parsed.data.jobs) {
    const existing = await prisma.job.findUnique({ where: { url: job.url } });
    await prisma.job.upsert({
      where: { url: job.url },
      create: {
        title: job.title,
        company: job.company,
        location: job.location ?? undefined,
        remoteType: job.remoteType ?? undefined,
        salaryMin: job.salaryMin ?? undefined,
        salaryMax: job.salaryMax ?? undefined,
        stack: job.stack ?? undefined,
        url: job.url,
        source: job.source ?? undefined,
        postedAt: job.postedAt ?? undefined,
        description: job.description ?? undefined,
      },
      // Only refresh listing metadata; never touch tracker fields
      // (status, notes, appliedAt...) on an offer the user already triaged.
      update: {
        title: job.title,
        company: job.company,
        location: job.location ?? undefined,
        remoteType: job.remoteType ?? undefined,
        salaryMin: job.salaryMin ?? undefined,
        salaryMax: job.salaryMax ?? undefined,
        stack: job.stack ?? undefined,
        source: job.source ?? undefined,
        postedAt: job.postedAt ?? undefined,
        description: job.description ?? undefined,
      },
    });
    if (existing) updated++;
    else created++;
  }

  return NextResponse.json({ ok: true, created, updated });
}
