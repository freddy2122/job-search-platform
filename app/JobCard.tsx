"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { STATUS_META, STATUS_ORDER } from "@/lib/status";

export type JobCardData = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  remoteType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  stack: string | null;
  url: string;
  source: string | null;
  postedAt: string | null;
  status: string;
  notes: string | null;
  cvGeneratedAt: string | null;
  letterGeneratedAt: string | null;
};

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return null;
  if (min && max) return `${min}-${max}K€`;
  return `${min ?? max}K€`;
}

export function JobCard({ job }: { job: JobCardData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(job.notes ?? "");
  const [notesDirty, setNotesDirty] = useState(false);
  const meta = STATUS_META[job.status] ?? STATUS_META.a_postuler;

  async function patch(body: Record<string, unknown>) {
    await fetch(`/api/jobs/${job.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    startTransition(() => router.refresh());
  }

  function handlePostuler() {
    window.open(job.url, "_blank", "noopener,noreferrer");
    if (job.status === "a_postuler") {
      patch({ status: "postule" });
    }
  }

  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 flex flex-col gap-3 bg-white/60 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base">{job.title}</h3>
          <p className="text-sm opacity-80">{job.company}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs opacity-80">
        {job.location && <span>📍 {job.location}</span>}
        {job.remoteType && <span>🏠 {job.remoteType}</span>}
        {salary && <span>💶 {salary}</span>}
        {job.source && <span>🔗 {job.source}</span>}
      </div>

      {job.stack && <p className="text-xs opacity-70 line-clamp-2">{job.stack}</p>}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={handlePostuler}
          className="text-sm px-3 py-1.5 rounded-lg bg-foreground text-background font-medium hover:opacity-90"
        >
          Postuler ↗
        </button>
        <a
          href={`/api/jobs/${job.id}/cv`}
          className="text-sm px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
        >
          {job.cvGeneratedAt ? "Régénérer CV" : "Générer CV"}
        </a>
        <a
          href={`/api/jobs/${job.id}/lettre`}
          className="text-sm px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10"
        >
          {job.letterGeneratedAt ? "Régénérer lettre" : "Générer lettre"}
        </a>

        <select
          value={job.status}
          disabled={isPending}
          onChange={(e) => patch({ status: e.target.value })}
          className="text-sm px-2 py-1.5 rounded-lg border border-black/15 dark:border-white/20 bg-transparent ml-auto"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setNotesDirty(true);
          }}
          onBlur={() => {
            if (notesDirty) {
              patch({ notes });
              setNotesDirty(false);
            }
          }}
          placeholder="Notes (relance prévue, contact, etc.)"
          className="flex-1 text-sm px-2 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-transparent"
        />
      </div>
    </div>
  );
}
