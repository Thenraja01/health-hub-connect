import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, Activity, Settings, 
  Search, ShieldCheck, HeartPulse, 
  ChevronRight, MapPin, Video, FileText,
  User, Building2, Stethoscope, Award,
  Download, ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchPatientAppointments, fetchProfile } from '../../store/slices/dataSlice';
import api from '@/api/axios';
import { toast } from "sonner";

export const UserDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments, profile } = useSelector((state: RootState) => state.data);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPatientAppointments());
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleDownload = async (appointmentId: string) => {
    try {
      setDownloading(appointmentId);
      // First get the prescription ID
      const res = await api.get(`/prescriptions/appointment/${appointmentId}`);
      const prescriptionId = res.data.data.id;
      
      // Then download the blob
      const downloadRes = await api.get(`/prescriptions/download/${prescriptionId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([downloadRes.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${appointmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Prescription downloaded successfully");
    } catch (error) {
      toast.error("Prescription not available yet");
    } finally {
      setDownloading(null);
    }
  };

  const upcomingApt = appointments.find(a => a.bookingStatus === 'CONFIRMED' || a.bookingStatus === 'PENDING');

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      
      {/* 1. PATIENT PERSONAL INFORMATION SECTION (Top Header) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="glass rounded-[2.5rem] p-8 shadow-soft flex flex-col md:flex-row items-center gap-8 border-l-8 border-l-accent">
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow">
              {user?.name?.[0]}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-background bg-success" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold font-display">Hello, {user?.name}!</h1>
            <p className="text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold text-accent">PATIENT ID:</span> HH-{user?.id?.slice(-4).toUpperCase()}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-success" /> Blood Group: {profile?.bloodGroup || "Not Set"}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Verified Profile</span>
            </div>
          </div>
          <Button asChild className="rounded-2xl h-14 px-8 font-bold bg-gradient-primary text-white shadow-glow">
            <Link to="/doctors"><Search className="h-5 w-5 mr-2" /> FIND DOCTOR</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-[2rem] shadow-soft flex flex-col justify-center border border-border/40">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Wellness Score</p>
             <p className="text-4xl font-bold mt-1 text-center text-success">{profile?.wellnessScore || 0}</p>
             <div className="h-1.5 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${profile?.wellnessScore || 0}%` }} />
             </div>
          </div>
          <div className="glass p-6 rounded-[2rem] shadow-soft flex flex-col justify-center border border-border/40">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Appointments</p>
             <p className="text-4xl font-bold mt-1 text-center text-primary">{appointments.length}</p>
             <p className="text-[10px] text-muted-foreground font-bold mt-1 text-center uppercase tracking-tighter">Total Bookings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        
        {/* 2. CLINICAL & APPOINTMENT INFORMATION SECTION (Left Side) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" /> My Consultations
            </h2>
          </div>

          {/* Upcoming Appointment Focus */}
          <div className="bg-hero p-8 rounded-[2.5rem] text-primary-foreground shadow-elegant relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">Next Appointment</span>
                <h3 className="text-4xl font-bold font-display mt-4">
                  {upcomingApt?.doctor?.name || "No Upcoming Consultations"}
                </h3>
                <p className="text-primary-foreground/80 mt-1">
                  {upcomingApt?.doctor?.specialization?.typeName || upcomingApt?.doctor?.hospital?.hospitalName || "Find a specialist to get started"}
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                   <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl text-sm font-bold">
                     <Clock className="h-4 w-4" /> {upcomingApt ? new Date(upcomingApt.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                   </div>
                   <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-xl text-sm font-bold">
                     <Video className="h-4 w-4" /> {upcomingApt?.consultationType || "General"}
                   </div>
                </div>
              </div>
              {upcomingApt && (
                <Button 
                  onClick={() => window.open(`https://meet.jit.si/HealthHub-${upcomingApt.id}`, '_blank')}
                  className="bg-white text-primary font-bold rounded-2xl px-8 h-14 hover:bg-white/90 shadow-glow"
                >
                  JOIN CONSULTATION
                </Button>
              )}
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Video className="h-48 w-48" />
            </div>
          </div>

          {/* Activity Table */}
          <div className="glass rounded-[2rem] p-8 shadow-soft border border-border/40">
            <h3 className="text-lg font-bold mb-6">Recent Medical History</h3>
            <div className="space-y-4">
              {appointments.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-secondary/30 rounded-3xl group transition-all hover:bg-background border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.consultationType} with {item.doctor?.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {item.doctor?.hospital?.hospitalName} · {new Date(item.startsAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase ${item.bookingStatus === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                      {item.bookingStatus}
                    </span>
                    {item.bookingStatus === 'COMPLETED' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-lg text-primary hover:bg-primary/10"
                        onClick={() => handleDownload(item.id)}
                        disabled={downloading === item.id}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm italic">No consultation history found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. PLATFORM & DISCOVERY ACTIONS (Right Side) */}
        <div className="space-y-6">
          <div className="glass rounded-[2rem] p-8 shadow-soft border-l-4 border-l-primary border border-border/40">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Hospital Directory
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Locate nearby partner hospitals and clinics for in-person visits.</p>
            <Button asChild className="w-full bg-secondary text-foreground hover:bg-secondary/80 rounded-xl h-12 font-bold transition-all shadow-sm">
              <Link to="/hospitals">BROWSE HOSPITALS <ChevronRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-soft border border-border/40">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" /> Premium Health Tips
            </h3>
            <div className="space-y-4">
               <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20">
                  <p className="text-sm font-bold text-accent">Cardiac Health</p>
                  <p className="text-xs text-muted-foreground mt-1">Walking 30 mins daily reduces risk by 20%.</p>
               </div>
               <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                  <p className="text-sm font-bold text-primary">Hydration</p>
                  <p className="text-xs text-muted-foreground mt-1">Stay hydrated! Aim for 2.5L daily.</p>
               </div>
            </div>
          </div>

          <div className="bg-gradient-soft p-8 rounded-[2rem] shadow-soft border border-border/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">Health Status</h3>
              <ShieldCheck className="h-5 w-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Medical Profile</p>
            <p className="text-lg font-bold">{profile?.chronicDiseases ? "Under Care" : "Healthy"}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{profile?.chronicDiseases || "No chronic conditions reported"}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
;
