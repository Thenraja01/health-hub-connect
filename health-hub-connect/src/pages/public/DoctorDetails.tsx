import { Link, useParams, Navigate } from "react-router-dom";
import { Star, MapPin, Stethoscope, Languages, Video, Clock, ShieldCheck, Award, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { consultationLabels } from "@/lib/doctors";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchDoctors } from "@/store/slices/dataSlice";
import { useEffect } from "react";

export default function DoctorDetails() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { doctors, loading } = useSelector((state: RootState) => state.data);
  
  const doctor = doctors.find(d => d.id === doctorId);

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctors.length]);

  if (loading && !doctor) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl" />
        <p className="text-muted-foreground font-medium">Loading doctor details...</p>
      </div>
    </div>;
  }

  if (!doctor) {
    return <Navigate to="/doctors" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/doctors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> All doctors
      </Link>

      <header className="mt-4 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card">
        <div className="relative h-32 bg-hero">
          <div className="absolute inset-0 bg-gradndient-to-t from-card/20 to-transparent" />
        </div>
        <div className="-mt-14  px-6 pb-6 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex z-10 items-end gap-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                width={128}
                height={128}
                className="h-32 w-32 rounded-3xl object-cover ring-4 ring-card shadow-elegant"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold md:text-3xl">{doctor.name}</h1>
                  {doctor.online && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-[11px] font-semibold text-success-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-success-foreground/80" /> Online now
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{doctor.specialty} · {doctor.qualifications}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> {doctor.rating} · {doctor.reviews} reviews</span>
                  <span className="inline-flex items-center gap-1"><Award className="h-3.5 w-3.5" /> {doctor.experience} years</span>
                  <span className="inline-flex items-center gap-1"><Stethoscope className="h-3.5 w-3.5" /> {doctor.hospital}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {doctor.location}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start z-10 gap-2 md:items-end">
              <p className="text-xs text-muted-foreground">Consultation fee</p>
              <p className="font-display text-2xl font-bold">₹{doctor.fee}</p>
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                <Link to={`/book/${doctor.id}`}>Book appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{doctor.about}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Languages</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm"><Languages className="h-4 w-4 text-primary" /> {doctor.languages.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Consultation</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {doctor.consultationTypes.map((c: any) => (
                    <Badge key={c} variant="secondary" className="rounded-full bg-primary/10 text-primary">
                      {c === "video" && <Video className="mr-1 h-3 w-3" />} {consultationLabels[c as keyof typeof consultationLabels]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border/60 bg-gradient-soft p-6 shadow-card">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Next available</p>
            <p className="mt-1 font-display text-xl font-semibold text-success">{doctor.nextSlot}</p>
            <Button asChild size="lg" className="mt-4 w-full bg-gradient-primary text-primary-foreground shadow-elegant">
              <Link to={`/book/${doctor.id}`}>Continue to booking</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
