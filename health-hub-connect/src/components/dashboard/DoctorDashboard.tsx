import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, TrendingUp, Clock, Power, 
  ChevronRight, FileText, Pill, Plus, Search,
  CheckCircle2, AlertCircle, MoreHorizontal,
  Stethoscope, Award, Building, User, Video,
  X, Loader2, LayoutDashboard, ListChecks, CalendarCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDoctorPatients, fetchDoctorAppointments, fetchProfile, toggleDoctorStatus, fetchDoctorSlots } from '../../store/slices/dataSlice';
import PrescriptionBuilder from '../doctor/PrescriptionBuilder';
import api from '@/api/axios';
import { toast } from "sonner";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import DoctorTasks from "@/pages/doctor/Tasks";
import DoctorSchedule from "@/pages/doctor/Schedule";
import DoctorEarnings from "@/pages/doctor/Earnings";
import DoctorProfile from "@/pages/doctor/Profile";

export const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isOnline, setIsOnline] = useState(false);
  const [showPrescriptionBuilder, setShowPrescriptionBuilder] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { patients, tasks, appointments, profile, slots } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchDoctorPatients());
    dispatch(fetchDoctorAppointments());
    dispatch(fetchProfile());
    dispatch(fetchDoctorSlots());
    fetchEarnings();
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setIsOnline(profile.isOnline);
    }
  }, [profile]);

  const handleStatusToggle = async () => {
    const newStatus = !isOnline;
    try {
      await dispatch(toggleDoctorStatus(newStatus)).unwrap();
      toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);
    } catch (error: any) {
      toast.error(error || "Failed to update status");
    }
  };

  const fetchEarnings = async () => {
    try {
      const res = await api.get("/doctor/earnings");
      setEarnings(res.data.data);
    } catch (error) {
      console.error("Failed to fetch earnings", error);
    }
  };

  const currentApt = appointments.find(a => a.bookingStatus === 'CONFIRMED' || a.bookingStatus === 'IN_PROGRESS');

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in relative">
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50 p-1 rounded-2xl mb-8">
          <TabsTrigger value="overview" className="rounded-xl px-6 font-bold flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-xl px-6 font-bold flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-xl px-6 font-bold flex items-center gap-2">
            <CalendarCheck className="h-4 w-4" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="earnings" className="rounded-xl px-6 font-bold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Earnings
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-xl px-6 font-bold flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Prescription Builder Overlay */}
      {showPrescriptionBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-4xl relative">
            <button 
              onClick={() => setShowPrescriptionBuilder(false)}
              className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            <PrescriptionBuilder 
              appointmentId={selectedAppointment?.id} 
              patientId={selectedAppointment?.patientId} 
              onSuccess={() => {
                setShowPrescriptionBuilder(false);
                dispatch(fetchDoctorAppointments());
              }}
            />
          </div>
        </div>
      )}

      {/* 1. DOCTOR INFORMATION SECTION (Top Header) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        <div className="glass rounded-[2.5rem] p-8 shadow-soft flex flex-col md:flex-row items-center gap-8 border-l-8 border-l-primary">
          <div className="relative">
            <div className="h-24 w-24 rounded-3xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-glow">
              {user?.name?.[0]}
            </div>
            <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-background ${isOnline ? 'bg-success' : 'bg-muted'}`} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold font-display">{user?.name}</h1>
            <p className="text-primary font-semibold flex items-center justify-center md:justify-start gap-2">
              <Stethoscope className="h-4 w-4" /> {profile?.specialization?.typeName || "Medical Professional"}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5" /> {profile?.hospital?.hospitalName || "Platform Consultant"}</span>
              <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> {profile?.experienceYears || 0}+ Years Exp.</span>
            </div>
          </div>
          <Button 
            variant={isOnline ? "default" : "outline"} 
            className={`rounded-2xl h-14 px-8 font-bold transition-all ${isOnline ? "bg-success hover:bg-success/90 shadow-glow" : "glass"}`}
            onClick={handleStatusToggle}
          >
            <Power className="h-5 w-5 mr-2" />
            {isOnline ? "ONLINE" : "GO ONLINE"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-6 rounded-[2rem] shadow-soft flex flex-col justify-center border border-border/40">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Consultations</p>
             <p className="text-3xl font-bold mt-1 text-center">{appointments?.length || 0}</p>
             <p className="text-[10px] text-success font-bold mt-1 text-center">Live Stats</p>
          </div>
          <div className="glass p-6 rounded-[2rem] shadow-soft flex flex-col justify-center border border-border/40">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Net Earnings</p>
             <p className="text-3xl font-bold mt-1 text-center">₹{(earnings?.summary?.netEarnings || 0).toLocaleString()}</p>
             <p className="text-[10px] text-primary font-bold mt-1 text-center">Available: ₹{(earnings?.summary?.availableBalance || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        
        {/* 2. PATIENT INFORMATION SECTION (Left Side) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" /> Appointment Queue
            </h2>
            <div className="flex gap-2">
               <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">{appointments.length} Total</span>
            </div>
          </div>

          {/* Next Patient Focus */}
          <div className="bg-hero p-8 rounded-[2.5rem] text-primary-foreground shadow-elegant relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">Current / Next Consultation</span>
                <h3 className="text-4xl font-bold font-display mt-4">{currentApt?.patient?.fullName || "No Active Appointment"}</h3>
                <p className="text-primary-foreground/80 mt-1">
                  {currentApt?.patient?.age ? `${currentApt?.patient.age} yrs · ` : ""}
                  {currentApt?.patient?.gender || ""} 
                  {currentApt ? ` · ${currentApt.consultationType}` : ""}
                </p>
                <div className="flex gap-3 mt-6">
                   <Button 
                    disabled={!currentApt} 
                    className="bg-white text-primary font-bold rounded-xl px-6 hover:bg-white/90 shadow-glow"
                    onClick={() => {
                      setSelectedAppointment(currentApt);
                      setShowPrescriptionBuilder(true);
                    }}
                   >
                     Write Rx
                   </Button>
                   <Button 
                    variant="ghost" 
                    disabled={!currentApt}
                    className="text-white border-white/20 bg-white/10 rounded-xl px-6 flex items-center gap-2"
                    onClick={() => window.open(`https://meet.jit.si/HealthHub-${currentApt?.id}`, '_blank')}
                   >
                     <Video className="h-4 w-4" /> Start Video
                   </Button>
                </div>
              </div>
              <div className="text-right">
                <div className="h-20 w-20 rounded-full border-4 border-white/20 flex items-center justify-center text-2xl font-bold">
                  {currentApt ? new Date(currentApt.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                </div>
                <p className="text-[10px] uppercase font-bold mt-2 opacity-60 tracking-widest">Scheduled Time</p>
              </div>
            </div>
          </div>
          {/* Waiting List Table */}
          <div className="glass rounded-[2rem] p-6 shadow-soft overflow-hidden border border-border/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40">
                    <th className="pb-4 px-2">Patient</th>
                    <th className="pb-4 px-2">Status</th>
                    <th className="pb-4 px-2">Time</th>
                    <th className="pb-4 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {appointments.filter(a => a.id !== currentApt?.id).map((apt, i) => (
                    <tr key={i} className="hover:bg-secondary/30 transition-colors border-b border-border/20 last:border-0 group">
                      <td className="py-4 px-2">
                        <div className="font-bold">{apt.patient?.fullName}</div>
                        <div className="text-[10px] text-muted-foreground">{apt.patient?.patientCode}</div>
                      </td>
                      <td className="py-4 px-2">
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                           apt.bookingStatus === 'CONFIRMED' ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground'
                         }`}>
                           {apt.bookingStatus}
                         </span>
                      </td>
                      <td className="py-4 px-2 text-xs font-semibold">
                        {new Date(apt.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary font-bold text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowPrescriptionBuilder(true);
                          }}
                        >
                          PRE-WRITE RX
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {appointments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground text-xs italic">No patients in queue</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. CLINICAL & ADMIN ACTIONS (Right Side) */}
        <div className="space-y-6">
          <div className="glass rounded-[2rem] p-8 shadow-soft border-l-4 border-l-accent border border-border/40">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Pill className="h-5 w-5 text-accent" /> Digital Prescription
            </h3>
            <p className="text-xs text-muted-foreground mb-6">Create branded, professional prescriptions with automated PDF generation and instant patient delivery.</p>
            <div className="space-y-3">
               <Button 
                onClick={() => setShowPrescriptionBuilder(true)} 
                className="w-full bg-gradient-primary text-white rounded-xl h-12 font-bold shadow-elegant"
               >
                 <Plus className="h-4 w-4 mr-2" /> NEW BLANK RX
               </Button>
               <Button variant="outline" className="w-full rounded-xl h-11 glass border-border/40 text-xs font-bold">
                 MANAGE TEMPLATES
               </Button>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-soft border border-border/40">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Daily Schedule
            </h3>
            <div className="space-y-4">
               {appointments.slice(0, 4).map((apt, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-secondary/40 rounded-2xl border border-border/10">
                    <div className="flex items-center gap-3">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       <span className="text-sm font-medium">{apt.patient?.fullName}</span>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground">
                      {new Date(apt.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
               ))}
               {appointments.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">No appointments today</p>}
            </div>
            <Button variant="link" className="w-full mt-4 text-xs font-bold text-primary hover:no-underline">MANAGE AVAILABILITY</Button>
          </div>

          <div className="bg-gradient-soft p-8 rounded-[2rem] shadow-soft border border-border/40 flex items-center justify-between group hover:shadow-elegant transition-all">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Patient Rating</p>
              <p className="text-3xl font-bold mt-1 tracking-tighter">4.9<span className="text-sm text-muted-foreground font-normal ml-1">/5</span></p>
            </div>
            <div className="h-16 w-16 rounded-3xl bg-white/50 flex items-center justify-center text-primary shadow-glow group-hover:scale-110 transition-transform">
               <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="tasks" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <DoctorTasks />
        </TabsContent>

        <TabsContent value="schedule" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <DoctorSchedule />
        </TabsContent>

        <TabsContent value="earnings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <DoctorEarnings />
        </TabsContent>

        <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <DoctorProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

