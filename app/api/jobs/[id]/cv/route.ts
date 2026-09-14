import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildCvDocx } from "@/lib/documents";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const buffer = await buildCvDocx(job);
  await prisma.job.update({ where: { id }, data: { cvGeneratedAt: new Date() } });

  const filename = `CV_AKOUTA_${job.company.replace(/[^a-z0-9]+/gi, "_")}.docx`;
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
