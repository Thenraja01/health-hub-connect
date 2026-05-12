import React, { useEffect, useState } from 'react';
import { CalendarCheck, Clock, Settings, Plus, Loader2, X, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchSchedules, createSchedule, fetchDoctorSlots } from '../../store/slices/dataSlice';
import { toast } from "sonner";
import api from '@/api/axios';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorSchedule() {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, slots, loading } = useSelector((state: RootState) => state.data);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: "1",
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
    isActive: true
  });

  useEffect(() => {
    dispatch(fetchSchedules());
    dispatch(fetchDoctorSlots());
  }, [dispatch]);

  const handleUpdateSlotStatus = async (slotId: string, status: string) => {
    try {
      await api.patch(`/doctors/slots/${slotId}`, { status });
      toast.success(`Slot marked as ${status}`);
      dispatch(fetchDoctorSlots()); // Refresh slots
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update slot");
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createSchedule({
        ...newSlot,
        dayOfWeek: parseInt(newSlot.dayOfWeek)
      })).unwrap();
      toast.success("Schedule slot added");
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error || "Failed to add slot");
    }
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Availability Schedule</h1>
          <p className="text-muted-foreground">Manage your working hours and consultation slots.</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-primary text-white rounded-xl shadow-glow"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Slot
        </Button>
      </div>

      {showAddForm && (
        <div className="glass rounded-3xl p-8 border border-primary/20 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">New Availability Slot</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)} className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleAddSlot} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Day</label>
              <Select value={newSlot.dayOfWeek} onValueChange={(v) => setNewSlot({...newSlot, dayOfWeek: v})}>
                <SelectTrigger className="rounded-xl glass border-border/40">
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Start Time</label>
              <Input 
                type="time" 
                value={newSlot.startTime} 
                onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                className="rounded-xl glass border-border/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">End Time</label>
              <Input 
                type="time" 
                value={newSlot.endTime} 
                onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                className="rounded-xl glass border-border/40"
              />
            </div>
            <Button type="submit" className="bg-primary text-white rounded-xl h-11 font-bold shadow-glow">
              <Save className="h-4 w-4 mr-2" /> SAVE SLOT
            </Button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        <h2 className="text-xl font-bold font-display mt-8">Weekly Schedule Template</h2>
        {schedules.length > 0 ? schedules.map((s: any, i: number) => (
          <div key={i} className="glass rounded-3xl p-6 shadow-soft flex items-center justify-between border border-border/20">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                {DAYS[s.dayOfWeek]?.[0]}
              </div>
              <div>
                <h3 className="font-bold">{DAYS[s.dayOfWeek]}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                   <Clock className="h-3.5 w-3.5" /> {s.startTime} - {s.endTime} ({s.slotDuration} min)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${s.isActive ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                {s.isActive ? 'Active' : 'Inactive'}
              </span>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 glass rounded-3xl border border-dashed border-border/40">
            <CalendarCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground italic">No schedules found. Add your first slot to get started.</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-display mt-8">Upcoming Generated Slots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots && slots.length > 0 ? slots.map((slot: any, i: number) => (
            <div key={i} className={`p-4 rounded-2xl border transition-all ${slot.slotStatus === 'BOOKED' ? 'bg-primary/5 border-primary/20 shadow-soft' : 'glass border-border/40'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(slot.startsAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  slot.slotStatus === 'AVAILABLE' ? 'bg-success/10 text-success' : 
                  slot.slotStatus === 'BOOKED' ? 'bg-primary/10 text-primary' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {slot.slotStatus}
                </span>
              </div>
              <p className="text-lg font-bold tracking-tight">{new Date(slot.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              
              <div className="mt-3 flex items-center justify-between gap-2">
                {slot.slotStatus === 'AVAILABLE' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-[10px] h-7 rounded-lg border-destructive/20 text-destructive hover:bg-destructive/10"
                    onClick={() => handleUpdateSlotStatus(slot.id, 'BLOCKED')}
                  >
                    Block Slot
                  </Button>
                ) : slot.slotStatus === 'BLOCKED' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-[10px] h-7 rounded-lg border-success/20 text-success hover:bg-success/10"
                    onClick={() => handleUpdateSlotStatus(slot.id, 'AVAILABLE')}
                  >
                    Unblock Slot
                  </Button>
                ) : slot.slotStatus === 'BOOKED' ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-[10px] h-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => toast.info("Please use Appointments tab to manage booked appointments")}
                  >
                    Manage Booking
                  </Button>
                ) : null}
              </div>

              {slot.appointment && (
                <div className="mt-2 pt-2 border-t border-border/40">
                  <p className="text-[10px] font-medium truncate text-muted-foreground">Patient ID: {slot.bookedPatientId?.slice(-6).toUpperCase()}</p>
                </div>
              )}
            </div>
          )) : (
             <div className="col-span-full text-center py-10 glass rounded-3xl border border-dashed border-border/40">
                <Clock className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No slots generated yet. Slots appear automatically when you create a schedule.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}


