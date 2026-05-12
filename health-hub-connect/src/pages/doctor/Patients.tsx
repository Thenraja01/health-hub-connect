import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Mail, Phone, ChevronRight, 
  X, Pill, FileText, History, Plus, CheckCircle2,
  AlertCircle, Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDoctorPatients } from '../../store/slices/dataSlice';

export default function DoctorPatients() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { patients } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchDoctorPatients());
  }, [dispatch]);

  const prescriptions = selectedPatient?.prescriptions || [];
  const medicationHistory = prescriptions.flatMap((p: any) => 
    (p.medicines || []).map((m: any) => ({
      name: m.name,
      dosage: m.dosage,
      timing: m.timing || "As prescribed",
      status: p.nextFollowupDate ? "Active" : "Completed"
    }))
  );

  return (
    <div className="p-8 space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">My Patients</h1>
          <p className="text-muted-foreground">Manage your patient records and history.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 w-64 rounded-xl glass border-border/40 h-11" placeholder="Search patients..." />
          </div>
          <Button variant="outline" className="rounded-xl h-11 px-4 border-border/40 glass">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {patients.map((p, i) => (
          <div 
            key={p.id || i} 
            onClick={() => setSelectedPatient(p)}
            className="glass rounded-3xl p-6 shadow-soft hover-lift group border border-border/20 cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold shadow-soft transition-transform group-hover:scale-105">
                {(p.fullName || p.name || "?")[0]}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                   <h3 className="text-lg font-bold">{p.fullName || p.name}</h3>
                   <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-bold text-muted-foreground uppercase">{p.patientCode || p.id?.slice(-6)}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {p.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {p.phone}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Status</p>
                <p className="text-sm font-semibold text-success">{p.status || "ACTIVE"}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="h-full w-full max-w-4xl bg-background shadow-2xl overflow-y-auto animate-rise">
            <div className="sticky top-0 z-10 glass-strong border-b border-border/60 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-soft">
                  {(selectedPatient.fullName || selectedPatient.name || "?")[0]}
                </div>
                <div>
                   <h2 className="text-2xl font-bold font-display">{selectedPatient.fullName || selectedPatient.name}</h2>
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Case ID: {selectedPatient.patientCode || selectedPatient.id}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => setSelectedPatient(null)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-8 space-y-10">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Age", val: selectedPatient.age || "N/A", icon: Activity },
                    { label: "Gender", val: selectedPatient.gender || "N/A", icon: Users },
                    { label: "Blood Group", val: selectedPatient.bloodGroup || "N/A", icon: History },
                    { label: "Weight", val: selectedPatient.weight ? `${selectedPatient.weight} kg` : "N/A", icon: Filter },
                  ].map((d, i) => (
                    <div key={i} className="glass p-4 rounded-2xl border border-border/40">
                       <d.icon className="h-4 w-4 text-primary mb-2" />
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{d.label}</p>
                       <p className="text-sm font-bold">{d.val}</p>
                    </div>
                  ))}
               </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.7fr] gap-8">
                <div className="space-y-8">
                  <div className="glass rounded-[2rem] p-6 shadow-soft">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-9 w-9 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        <Pill className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-lg">Intaken Medications</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40">
                            <th className="pb-4 px-2">Medicine</th>
                            <th className="pb-4 px-2">Dosage</th>
                            <th className="pb-4 px-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {medicationHistory.map((m: any, i: number) => (
                            <tr key={i} className="border-b border-border/20 last:border-0">
                              <td className="py-4 px-2 font-semibold">{m.name}</td>
                              <td className="py-4 px-2 text-xs text-muted-foreground">{m.dosage} · {m.timing}</td>
                              <td className="py-4 px-2 text-right">
                                <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase ${m.status === 'Active' ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground'}`}>
                                  {m.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="glass rounded-[2.5rem] p-8 shadow-soft border-l-8 border-l-primary">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-lg">Prescription Writer</h3>
                    </div>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Medicine Name</label>
                            <Input className="rounded-xl border-border/40 h-11" placeholder="e.g. Paracetamol" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted-foreground">Dosage</label>
                            <Input className="rounded-xl border-border/40 h-11" placeholder="e.g. 500mg" />
                         </div>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs font-bold text-muted-foreground">Special Instructions</label>
                         <textarea className="w-full p-4 rounded-xl border border-border/40 bg-background text-sm min-h-[100px]" placeholder="Before food, avoid cold drinks..." />
                      </div>
                      <Button className="w-full bg-gradient-primary text-white font-bold h-12 rounded-xl shadow-glow">
                        <Plus className="h-4 w-4 mr-2" /> ADD TO PRESCRIPTION
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-soft p-6 rounded-[2rem] shadow-soft">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-primary">
                      <AlertCircle className="h-4 w-4" /> Medical History
                    </h3>
                    <div className="space-y-4">
                       <div className="space-y-1">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">Allergies</span>
                         <p className="text-sm font-bold">{selectedPatient.allergies || "None reported"}</p>
                       </div>
                       <div className="space-y-1">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">Chronic Diseases</span>
                         <p className="text-sm font-bold">{selectedPatient.chronicDiseases || "None reported"}</p>
                       </div>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-[2rem] shadow-soft border-dashed border-2 border-border/40 flex flex-col items-center justify-center text-center">
                     <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
                     <p className="text-xs font-bold text-muted-foreground uppercase">Previous Reports</p>
                     <p className="text-[10px] text-muted-foreground mt-1">No previous lab reports found for this patient.</p>
                     <Button variant="link" className="text-xs font-bold text-primary mt-2">UPLOAD NOW</Button>
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
