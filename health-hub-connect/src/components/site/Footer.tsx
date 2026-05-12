import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-gradient-soft">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-semibold">MediSlot</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Premium healthcare booking. Discover trusted doctors, book instantly, and consult securely.
          </p>
        </div>
        {[
          { title: "Patients", items: ["Find doctors", "Video consultation", "Lab tests", "Pharmacy"] },
          { title: "Doctors", items: ["Join MediSlot", "Manage schedule", "E-Prescriptions", "Earnings"] },
          { title: "Company", items: ["About", "Careers", "Press", "Trust & safety"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i} className="hover:text-foreground transition-colors">{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} MediSlot Health Technologies</span>
          <span>HIPAA-aware · End-to-end encrypted consultations</span>
        </div>
      </div>
    </footer>
  );
}
