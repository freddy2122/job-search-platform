export const STATUS_META: Record<string, { label: string; color: string }> = {
  a_postuler: { label: "À postuler", color: "bg-slate-100 text-slate-700 border-slate-300" },
  postule: { label: "Postulé", color: "bg-blue-100 text-blue-700 border-blue-300" },
  relance: { label: "Relancé", color: "bg-amber-100 text-amber-700 border-amber-300" },
  entretien: { label: "Entretien", color: "bg-purple-100 text-purple-700 border-purple-300" },
  refuse: { label: "Refusé", color: "bg-red-100 text-red-700 border-red-300" },
  offre: { label: "Offre reçue", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
};

export const STATUS_ORDER = ["a_postuler", "postule", "relance", "entretien", "offre", "refuse"];
