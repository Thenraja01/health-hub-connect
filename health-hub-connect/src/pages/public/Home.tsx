import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchDoctors, fetchSpecialties } from "@/store/slices/dataSlice";
import React, { useEffect } from "react";
import { Search, MapPin, Stethoscope, Star, ShieldCheck, Video, CalendarCheck, ChevronRight, HeartPulse, Brain, Baby, Smile, Bone, Sparkles, Flower, CloudSun, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorCard } from "@/components/site/DoctorCard";
import heroBg from "@/assets/hero-bg.jpg";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "heart-pulse": HeartPulse,
  brain: Brain,
  baby: Baby,
  smile: Smile,
  bone: Bone,
  sparkles: Sparkles,
  flower: Flower,
  "cloud-sun": CloudSun,
};

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { doctors, specialties, loading } = useSelector((state: RootState) => state.data);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchSpecialties());
  }, [dispatch]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img src={heroBg} alt="" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        <div className="container relative mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex animate-fade-in items-center gap-2 rounded-full border border-border/60 glass px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Verified doctors · Encrypted consults
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl animate-rise">
              Premium care, <span className="text-gradient-primary">booked in seconds.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg animate-rise">
              Discover top-rated doctors, view live availability and book video or in-person consultations — all in one beautifully simple flow.
            </p>

            <div className="mx-auto mt-8 max-w-2xl glass rounded-2xl p-2 shadow-elegant animate-pop">
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-background/60 px-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Doctor, specialty or symptom" />
                </div>
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-background/60 px-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Bengaluru" />
                </div>
                <Button asChild size="lg" className="h-11 rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95">
                  <Link to="/doctors">Search</Link>
                </Button>
              </div>
            </div>
          </div>
                <div className="justify-center w-full flex items-center mt-12">
                  <Button asChild size="lg" className="h-11 rounded-xl bg-gradient-primary text-primary-foreground  shadow-elegant hover:opacity-95">
                    <Link to="/login">Request For an Appointment</Link>
                  </Button>
                </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {Array.isArray(specialties) && specialties.map((s) => {
            const Icon = iconMap[s.icon] ?? Activity;
            return (
              <Link 
                key={s.name} 
                to={`/doctors?specialty=${encodeURIComponent(s.name)}`} 
                className="group relative flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card p-4 text-center shadow-soft hover-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-[11px] text-muted-foreground">{s.count} doctors</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        {loading ? (
           <div className="flex justify-center p-12">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
           </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.isArray(doctors) && doctors.map((d) => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        )}
      </section>
    </div>
  );
}
