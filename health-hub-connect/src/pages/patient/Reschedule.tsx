import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, CheckCircle2, ShieldCheck, User, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from "@/store";
import { fetchPublicDoctorSlots } from "@/store/slices/dataSlice";
import api from "@/api/axios";
import { toast } from "sonner";
import { format, isSameDay, parseISO } from 'date-fns';

export default function Reschedule() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  
  const dispatch = useDispatch<AppDispatch>();
  const { slots, loading } = useSelector((state: RootState) => state.data);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchPublicDoctorSlots(doctorId));
    }
  }, [dispatch, doctorId]);

  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    slots.forEach(slot => {
      const date = parseISO(slot.startsAt);
      if (!dates.find(d => isSameDay(d, date))) {
        dates.push(date);
      }
    });
    return dates.sort((a, b) => a.getTime() - b.getTime());
  }, [slots]);

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const filteredSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter(slot => isSameDay(parseISO(slot.startsAt), selectedDate));
  }, [selectedDate, slots]);

  const handleReschedule = async () => {
    if (!selectedSlotId) {
      toast.error("Please select a new time slot");
      return;
    }

    setProcessing(true);
    try {
      await api.post("/appointments/reschedule", {
        appointmentId,
        newSlotId: selectedSlotId
      });

      toast.success("Appointment rescheduled successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Rescheduling failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading availability...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-2xl shadow-elegant">
           <RefreshCw className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Reschedule Appointment</h1>
          <p className="text-muted-foreground font-medium">Select a new date and time for your consultation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.6fr] gap-8">
        <div className="space-y-6">
           <div className="glass p-6 rounded-3xl border border-border/40 shadow-soft">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg"><Calendar className="h-5 w-5 text-primary" /> Select New Date</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {availableDates.length > 0 ? availableDates.map((date, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlotId(null);
                      }}
                      className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1 ${selectedDate && isSameDay(selectedDate, date) ? 'border-primary bg-primary/5 shadow-glow' : 'border-border/40 hover:border-primary/50 glass'}`}
                    >
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{format(date, 'MMM')}</p>
                      <p className="text-2xl font-bold tracking-tighter">{format(date, 'dd')}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">{format(date, 'EEE')}</p>
                    </button>
                  )) : (
                    <div className="col-span-full py-8 text-center bg-muted/30 rounded-2xl border border-dashed border-border/40">
                       <p className="text-sm text-muted-foreground italic">No availability found for this week.</p>
                    </div>
                  )}
              </div>
           </div>

           <div className="glass p-6 rounded-3xl border border-border/40 shadow-soft">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg"><Clock className="h-5 w-5 text-primary" /> Available Slots</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredSlots.length > 0 ? filteredSlots.map((slot) => (
                  <button 
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`py-3 px-4 rounded-xl border transition-all font-bold text-sm ${selectedSlotId === slot.id ? 'bg-primary text-white border-primary shadow-glow scale-[1.02]' : 'border-border/40 hover:border-primary/50 glass text-muted-foreground'}`}
                  >
                    {format(parseISO(slot.startsAt), 'hh:mm a')}
                  </button>
                )) : (
                  <div className="col-span-full py-6 text-center text-muted-foreground italic text-sm">
                    Please select a date first
                  </div>
                )}
              </div>
           </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border border-border/40 shadow-elegant sticky top-8 text-center">
            <h3 className="text-xl font-bold mb-6 font-display">Confirm Reschedule</h3>
            <p className="text-sm text-muted-foreground mb-8">
              Moving your appointment is free of charge. Your previous slot will be released for other patients.
            </p>
            
            <Button 
              className="w-full py-7 rounded-2xl text-lg font-bold bg-primary text-white shadow-glow hover:opacity-95 transition-all"
              onClick={handleReschedule}
              disabled={processing || !selectedSlotId}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  RESCHEDULING...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  CONFIRM NEW TIME
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-xs font-bold"
              onClick={() => navigate(-1)}
            >
              NEVERMIND, GO BACK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
