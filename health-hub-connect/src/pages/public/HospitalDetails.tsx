import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchHospitals } from '../../store/slices/dataSlice';
import { Building, MapPin, Phone, Mail, Clock, ChevronLeft, User, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HospitalDetails() {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { hospitals, loading } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    if (hospitals.length === 0) {
      dispatch(fetchHospitals());
    }
  }, [dispatch, hospitals.length]);

  const hospital = hospitals.find(h => h.id === hospitalId || h._id === hospitalId);

  if (loading && !hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl" />
          <p className="text-muted-foreground font-medium">Loading hospital details...</p>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="h-24 w-24 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
          <Building className="h-12 w-12" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Hospital Not Found</h2>
          <p className="text-muted-foreground mt-2">The hospital you're looking for doesn't exist or has been removed.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to="/hospitals"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Hospitals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link to="/hospitals" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Partner Hospitals
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.4fr]">
        <div className="space-y-8">
          <section className="glass rounded-[2.5rem] overflow-hidden border border-border/20 shadow-elegant">
            <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
              <div className="absolute -bottom-12 left-12 h-24 w-24 bg-white rounded-3xl shadow-glow flex items-center justify-center text-primary border border-border/40">
                <Building className="h-12 w-12" />
              </div>
            </div>
            <div className="pt-16 pb-8 px-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold font-display">{hospital.hospitalName || hospital.name}</h1>
                  <p className="text-primary font-bold mt-1 uppercase tracking-widest text-xs">{hospital.hospitalType || hospital.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-bold text-success">Open Now</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mt-10">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Location</p>
                    <p className="text-sm font-medium">{hospital.address || hospital.location}, {hospital.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Operating Hours</p>
                    <p className="text-sm font-medium">{hospital.openingTime || '09:00 AM'} - {hospital.closingTime || '09:00 PM'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Contact</p>
                    <p className="text-sm font-medium">{hospital.contactNumber || '+91 1234567890'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                    <p className="text-sm font-medium">{hospital.email || 'info@hospital.com'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="glass rounded-[2rem] p-8 border border-border/20">
            <h3 className="text-xl font-bold mb-6">About the Facility</h3>
            <p className="text-muted-foreground leading-relaxed">
              Equipped with state-of-the-art medical technology and a dedicated team of specialists, 
              this facility provides comprehensive healthcare services across multiple disciplines. 
              Our commitment to patient care excellence ensures a safe and comfortable environment 
              for all our visitors.
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="glass rounded-[2rem] p-6 border border-border/20 sticky top-24">
            <h3 className="font-bold mb-4">Actions</h3>
            <div className="space-y-3">
              <Link to={`/doctors?hospitalId=${hospital.id}`}>
                <Button className="w-full bg-gradient-primary text-white rounded-xl font-bold shadow-glow h-12">
                  Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full rounded-xl font-bold h-12"
                onClick={() => {
                  toast.info(`Emergency Contact: ${hospital.contactNumber || "+91 1234567890"}`, {
                    description: "You can call this number for immediate assistance.",
                  });
                }}
              >
                Emergency Contact
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
