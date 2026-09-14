import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export const STATUSES = [
  "a_postuler",
  "postule",
  "relance",
  "entretien",
  "refuse",
  "offre",
] as const;

const bodySchema = z.object({
  status: z.enum(STATUSES).optional(),
  notes: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const data: { status?: string; notes?: string; appliedAt?: Date } = {};
  if (parsed.data.status) {
    data.status = parsed.data.status;
    if (parsed.data.status === "postule") data.appliedAt = new Date();
  }
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;

  const job = await prisma.job.update({ where: { id }, data });
  return NextResponse.json({ ok: true, job });
}
