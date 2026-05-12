import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, Phone, ChevronRight, 
  X, Pill, FileText, History, Plus, CheckCircle2,
  AlertCircle, Activity, Heart, User, Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDoctorPatients } from '../../store/slices/dataSlice';

export default function DoctorPatients() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { patients } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchDoctorPatients());
  }, [dispatch]);

  const filteredPatients = patients.filter(p => 
    (p.fullName || p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.patientCode || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const prescriptions = selectedPatient?.prescriptions || [];
  const medicationHistory = prescriptions.flatMap((p: any) => 
    (p.medicines || []).map((m: any) => ({
      name: m.name,
      dosage: m.dosage,
      timing: m.timing || "As prescribed",
      status: p.nextFollowupDate ? "Active" : "Completed",
      date: new Date(p.createdAt).toLocaleDateString()
    }))
  );

  return (
    <div className="p-8 space-y-10 animate-fade-in relative min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Patient Records</h1>
          <p className="text-muted-foreground text-lg">Detailed clinical history and record management.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              className="pl-12 w-80 rounded-2xl glass border-border/40 h-12 shadow-soft focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="Search by name or Case ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-2xl h-12 px-6 border-border/40 glass hover:bg-primary/5 transition-all">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.length > 0 ? filteredPatients.map((p, i) => (
          <div 
            key={p.id || i} 
            onClick={() => setSelectedPatient(p)}
            className="glass rounded-[2rem] p-7 shadow-soft hover-lift group border border-border/20 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center text-2xl font-bold shadow-inner border border-primary/10">
                  {(p.fullName || p.name || "?")[0]}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold truncate">{p.fullName || p.name}</h3>
                   </div>
                   <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-black tracking-widest uppercase">{p.patientCode || p.id?.slice(-6)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/20">
                 <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="text-xs font-semibold truncate">{p.email}</p>
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Phone</p>
                    <p className="text-xs font-semibold">{p.phone}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted text-[8px] flex items-center justify-center font-bold">R{i}</div>)}
                 </div>
                 <span className="text-[10px] font-bold text-success uppercase bg-success/10 px-3 py-1 rounded-full">Active Patient</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center glass rounded-[3rem] border-2 border-dashed border-border/40">
             <Users className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-muted-foreground">No patients found</h3>
             <p className="text-sm text-muted-foreground/60">Try searching with a different name or ID</p>
          </div>
        )}
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-md animate-fade-in p-4 md:p-0">
          <div className="h-full w-full max-w-5xl bg-background md:rounded-l-[3.5rem] shadow-2xl overflow-hidden animate-rise flex flex-col relative">
            <div className="sticky top-0 z-10 glass-strong border-b border-border/60 p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-3xl shadow-glow">
                  {(selectedPatient.fullName || selectedPatient.name || "?")[0]}
                </div>
                <div className="space-y-1">
                   <h2 className="text-4xl font-bold font-display tracking-tight">{selectedPatient.fullName || selectedPatient.name}</h2>
                   <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em] opacity-60">Case ID: {selectedPatient.patientCode || selectedPatient.id}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] font-bold text-success uppercase">Under Consultation</span>
                   </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-muted/50 hover:bg-destructive/10 hover:text-destructive transition-all" onClick={() => setSelectedPatient(null)}>
                <X className="h-7 w-7" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Age", val: selectedPatient.age || "N/A", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Gender", val: selectedPatient.gender || "N/A", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
                    { label: "Blood Group", val: selectedPatient.bloodGroup || "N/A", icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
                    { label: "Weight", val: selectedPatient.weight ? `${selectedPatient.weight} kg` : "N/A", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
                  ].map((d, i) => (
                    <div key={i} className="glass p-6 rounded-[2rem] border border-border/40 shadow-soft relative overflow-hidden group">
                       <div className={`absolute top-0 right-0 p-4 ${d.color} opacity-20 group-hover:scale-110 transition-transform`}>
                          <d.icon className="h-12 w-12" />
                       </div>
                       <div className={`h-10 w-10 ${d.bg} ${d.color} rounded-xl flex items-center justify-center mb-4`}>
                          <d.icon className="h-5 w-5" />
                       </div>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">{d.label}</p>
                       <p className="text-2xl font-bold font-display mt-1">{d.val}</p>
                    </div>
                  ))}
               </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12">
                <div className="space-y-12">
                  <div className="glass rounded-[3rem] p-8 shadow-soft border border-border/20">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                          <History className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-2xl font-display">Medication History</h3>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{medicationHistory.length} Recorded Items</span>
                    </div>
                    
                    {medicationHistory.length > 0 ? (
                      <div className="space-y-4">
                        {medicationHistory.map((m: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-muted/30 border border-border/10 hover:bg-muted/50 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center shadow-soft">
                                   <Pill className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                   <p className="font-bold text-base">{m.name}</p>
                                   <p className="text-xs text-muted-foreground">{m.dosage} · {m.timing} · <span className="font-medium text-primary/60">{m.date}</span></p>
                                </div>
                             </div>
                             <span className={`text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter ${m.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                                {m.status}
                             </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center space-y-3 opacity-40">
                         <Pill className="h-10 w-10 mx-auto" />
                         <p className="text-sm font-medium">No previous medications found.</p>
                      </div>
                    )}
                  </div>

                  <div className="glass rounded-[3rem] p-10 shadow-soft border-t-8 border-t-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <FileText className="h-32 w-32" />
                    </div>
                    <div className="flex items-center gap-3 mb-10">
                      <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                        <Plus className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl font-display">Prescription Writer</h3>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mt-1">Generate digital prescription</p>
                      </div>
                    </div>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Medicine Name</label>
                            <Input className="rounded-2xl border-border/40 h-14 glass px-5 font-medium" placeholder="e.g. Augmentin 625 DUO" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Dosage & Frequency</label>
                            <Input className="rounded-2xl border-border/40 h-14 glass px-5 font-medium" placeholder="e.g. 1-0-1 after food" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Clinical Notes & Advice</label>
                         <textarea className="w-full p-5 rounded-[2rem] border border-border/40 bg-background/50 text-sm min-h-[150px] focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Patient advised to take complete rest and avoid cold drinks for 3 days..." />
                      </div>
                      <Button className="w-full bg-gradient-primary text-white font-bold h-16 rounded-[2rem] shadow-glow text-lg">
                        <CheckCircle2 className="h-5 w-5 mr-3" /> FINALIZE & SEND PRESCRIPTION
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-muted/50 to-muted/20 p-8 rounded-[3rem] shadow-soft border border-border/40 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xs font-black mb-8 flex items-center gap-3 text-primary uppercase tracking-[0.3em]">
                        <AlertCircle className="h-4 w-4" /> Medical Profile
                      </h3>
                      <div className="space-y-8">
                         <div className="space-y-2">
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Allergies & Contraindications</span>
                           <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                              <p className="text-sm font-bold text-red-600/80">{selectedPatient.allergies || "No drug allergies reported"}</p>
                           </div>
                         </div>
                         <div className="space-y-2">
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Chronic Conditions</span>
                           <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                              <p className="text-sm font-bold text-orange-600/80">{selectedPatient.chronicDiseases || "No chronic diseases recorded"}</p>
                           </div>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Vital Statistics</span>
                            <div className="grid grid-cols-2 gap-3">
                               <div className="p-3 rounded-xl glass border border-border/40 text-center">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase">BMI</p>
                                  <p className="text-sm font-bold">22.4</p>
                               </div>
                               <div className="p-3 rounded-xl glass border border-border/40 text-center">
                                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Visit</p>
                                  <p className="text-sm font-bold">2 Days ago</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-10 rounded-[3rem] shadow-soft border-dashed border-2 border-border/40 flex flex-col items-center justify-center text-center group hover:border-primary/40 transition-all cursor-pointer">
                     <div className="h-16 w-16 bg-muted/50 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="h-8 w-8 text-muted-foreground/40" />
                     </div>
                     <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Diagnostic Reports</p>
                     <p className="text-xs text-muted-foreground/60 mt-2 max-w-[200px]">Lab results, X-rays and scan reports appear here.</p>
                     <Button variant="link" className="text-sm font-black text-primary mt-4 tracking-widest hover:no-underline">
                        UPLOAD REPORT <ChevronRight className="h-4 w-4 ml-1" />
                     </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

