"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
      className="text-sm px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
    >
      Déconnexion
    </button>
  );
}
