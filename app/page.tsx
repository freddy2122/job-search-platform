import Link from "next/link";
import { prisma } from "@/lib/db";
import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import { JobCard } from "@/app/JobCard";
import { LogoutButton } from "@/app/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status && STATUS_ORDER.includes(status) ? status : undefined;

  const jobs = await prisma.job.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
  });

  const counts = Object.fromEntries(
    await Promise.all(
      STATUS_ORDER.map(async (s) => [s, await prisma.job.count({ where: { status: s } })]),
    ),
  ) as Record<string, number>;

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recherche d&apos;emploi</h1>
          <p className="text-sm opacity-70">
            Offres dev web/mobile en télétravail, alimenté chaque jour par la recherche automatique.
          </p>
        </div>
        <LogoutButton />
      </header>

      <nav className="flex flex-wrap gap-2">
        <Link
          href="/"
          className={`text-sm px-3 py-1.5 rounded-full border ${
            !activeStatus
              ? "bg-foreground text-background border-foreground"
              : "border-black/15 dark:border-white/20"
          }`}
        >
          Toutes ({Object.values(counts).reduce((a, b) => a + b, 0)})
        </Link>
        {STATUS_ORDER.map((s) => (
          <Link
            key={s}
            href={`/?status=${s}`}
            className={`text-sm px-3 py-1.5 rounded-full border ${
              activeStatus === s
                ? "bg-foreground text-background border-foreground"
                : "border-black/15 dark:border-white/20"
            }`}
          >
            {STATUS_META[s].label} ({counts[s] ?? 0})
          </Link>
        ))}
      </nav>

      {jobs.length === 0 ? (
        <p className="text-sm opacity-60 py-12 text-center">
          Aucune offre pour le moment. La recherche quotidienne alimentera cette liste automatiquement,
          ou envoie des offres manuellement via l&apos;API d&apos;ingestion.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={{
                ...job,
                postedAt: job.postedAt?.toISOString() ?? null,
                cvGeneratedAt: job.cvGeneratedAt?.toISOString() ?? null,
                letterGeneratedAt: job.letterGeneratedAt?.toISOString() ?? null,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
