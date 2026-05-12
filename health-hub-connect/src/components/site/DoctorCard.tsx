import { Link } from "react-router-dom";
import { Star, MapPin, Video, Stethoscope, Clock, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { consultationLabels, type Doctor } from "@/lib/doctors";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card hover-lift">
      <div className="flex gap-4 p-5">
        <div className="relative">
          <img
            src={doctor.image}
            alt={doctor.name}
            loading="lazy"
            width={88}
            height={88}
            className="h-22 w-22 rounded-2xl object-cover ring-1 ring-border"
            style={{ height: 88, width: 88 }}
          />
          <span className={`absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-soft ${doctor.isOnline ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${doctor.isOnline ? "bg-success-foreground/80" : "bg-muted-foreground/80"}`} /> {doctor.isOnline ? "online" : "offline"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-semibold">{doctor.name}</h3>
              <p className="truncate text-sm text-muted-foreground">{doctor.specialty} · {doctor.experience} yrs</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              {doctor.rating}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5" /> {doctor.hospital}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {doctor.location}</span>
            <span className="inline-flex items-center gap-1"><Languages className="h-3.5 w-3.5" /> {doctor.languages.slice(0,2).join(", ")}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.consultationTypes.map((c) => (
              <Badge key={c} variant="secondary" className="rounded-full bg-primary/10 text-primary hover:bg-primary/15">
                {c === "video" && <Video className="mr-1 h-3 w-3" />} {consultationLabels[c]}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 bg-gradient-soft px-5 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Consultation fee</p>
          <p className="font-display text-lg font-semibold">₹{doctor.fee}</p>
        </div>
        <div className="text-right">
          <p className="inline-flex items-center gap-1 text-xs text-success">
            <Clock className="h-3 w-3" /> {doctor.nextSlot}
          </p>
          <Button asChild size="sm" className="mt-1 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
            <Link to={`/doctors/${doctor.id}`}>Book now</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
