import React, { useState } from "react";
import { Plus, Trash2, FileText, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/api/axios";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
}

interface PrescriptionBuilderProps {
  appointmentId: string;
  patientId: string;
  onSuccess?: () => void;
}

export default function PrescriptionBuilder({ appointmentId, patientId, onSuccess }: PrescriptionBuilderProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", frequency: "", duration: "", instruction: "" }
  ]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", instruction: "" }]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/prescriptions", {
        appointmentId,
        patientId,
        medicines,
        doctorNotes: notes,
      });
      toast.success("Prescription created and uploaded!");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong rounded-[2rem] p-8 shadow-elegant border border-border/40 space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary shadow-glow" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight">Prescription Builder</h2>
          <p className="text-xs text-muted-foreground font-medium">Create digital prescription for patient</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Medicines</Label>
            <Button type="button" onClick={addMedicine} variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold">
              <Plus className="h-3 w-3 mr-1" /> Add Medicine
            </Button>
          </div>

          <div className="space-y-3">
            {medicines.map((med, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 p-4 bg-secondary/30 rounded-2xl border border-border/20 animate-pop">
                <div className="col-span-4 space-y-1">
                  <Input 
                    placeholder="Medicine Name" 
                    value={med.name} 
                    onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                    className="h-9 text-xs rounded-lg border-border/40"
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Input 
                    placeholder="Dosage" 
                    value={med.dosage} 
                    onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                    className="h-9 text-xs rounded-lg border-border/40"
                    required
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Input 
                    placeholder="Freq" 
                    value={med.frequency} 
                    onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                    className="h-9 text-xs rounded-lg border-border/40"
                    required
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <Input 
                    placeholder="Duration" 
                    value={med.duration} 
                    onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                    className="h-9 text-xs rounded-lg border-border/40"
                    required
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <button type="button" onClick={() => removeMedicine(index)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="col-span-12">
                   <Input 
                    placeholder="Instruction (e.g. After food)" 
                    value={med.instruction} 
                    onChange={(e) => updateMedicine(index, 'instruction', e.target.value)}
                    className="h-8 text-[10px] rounded-lg border-border/40"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase font-bold tracking-widest text-muted-foreground ml-1">Doctor's Advice / Notes</Label>
          <Textarea 
            placeholder="Write additional advice or notes for the patient..." 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] rounded-2xl border-border/40 text-sm focus:ring-primary/20"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-primary text-white font-bold rounded-xl shadow-glow">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Complete & Send Prescription</>}
        </Button>
      </form>
    </div>
  );
}
