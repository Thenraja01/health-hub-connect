import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, CheckCircle2, ShieldCheck, User, CreditCard, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from "@/store";
import { fetchDoctors, fetchPublicDoctorSlots } from "@/store/slices/dataSlice";
import api from "@/api/axios";
import { toast } from "sonner";
import { format, isSameDay, parseISO } from 'date-fns';

export default function Booking() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { doctors, slots, loading } = useSelector((state: RootState) => state.data);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors({}));
    }
    if (doctorId) {
      dispatch(fetchPublicDoctorSlots(doctorId));
    }
  }, [dispatch, doctorId, doctors.length]);

  // Group slots by unique dates
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

  // Set initial selected date
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // Filter slots for the selected date
  const filteredSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter(slot => isSameDay(parseISO(slot.startsAt), selectedDate));
  }, [selectedDate, slots]);

  const doctor = doctors.find(d => d.id === doctorId);

  if (loading && !doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading availability...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="h-16 w-16 rounded-full bg-error/10 flex items-center justify-center text-error">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold">Doctor not found</h2>
        <Button onClick={() => navigate('/doctors')}>Browse Doctors</Button>
      </div>
    );
  }

  const consultationFee = doctor.consultationFee || 500;
  const bookingFee = 50; 
  const total = consultationFee + bookingFee;

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!selectedSlotId) {
      toast.error("Please select a time slot");
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post("/appointments", {
        doctorId,
        slotId: selectedSlotId,
        consultationType: "VIDEO",
        symptoms: "General checkup"
      });

      const { stripeSession } = response.data.data;

      if (stripeSession && stripeSession.url) {
        window.location.href = stripeSession.url;
      } else {
        throw new Error("Failed to create payment session");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-elegant">
           {doctor.doctorName?.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Book Consultation</h1>
          <p className="text-muted-foreground font-medium">with <span className="font-bold text-primary">Dr. {doctor.doctorName}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.6fr] gap-8">
        <div className="space-y-6">
           <div className="glass p-6 rounded-3xl border border-border/40 shadow-soft">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg"><Calendar className="h-5 w-5 text-primary" /> Select Date</h3>
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

           <div className="bg-secondary/30 p-6 rounded-3xl border border-border/40 space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground"><ShieldCheck className="h-4 w-4" /> Secure Consultation</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your consultation is fully encrypted and private. You can cancel or reschedule up to 12 hours before the start time for a full refund.
              </p>
           </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border border-border/40 shadow-elegant sticky top-8">
            <h3 className="text-xl font-bold mb-6 font-display">Booking Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Consultation Fee</span>
                <span className="font-bold">₹{consultationFee}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Platform Fee</span>
                <span className="font-bold">₹{bookingFee}</span>
              </div>
              <div className="h-px bg-border/40 my-4" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Total Amount</span>
                <span className="text-2xl font-bold font-display text-primary tracking-tighter">₹{total}</span>
              </div>
            </div>

            <Button 
              className="w-full py-7 rounded-2xl text-lg font-bold bg-gradient-primary text-white shadow-glow hover:opacity-95 transition-all group"
              onClick={handleBooking}
              disabled={processing || !selectedSlotId}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  PAY & CONFIRM
                </>
              )}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium uppercase tracking-widest">
              Powered by <span className="font-bold text-primary">Stripe Secure</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
