import React, { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, Clock, ArrowRight, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import api from '@/api/axios';
import { toast } from 'sonner';

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const appointmentId = searchParams.get('appointment_id');
  
  const [verifying, setVerifying] = useState(!!sessionId);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionId && appointmentId) {
      confirmBooking();
    }
  }, [sessionId, appointmentId]);

  const confirmBooking = async () => {
    try {
      await api.post('/appointments/confirm', {
        appointmentId,
        sessionId
      });
      toast.success("Payment verified and appointment confirmed!");
    } catch (err) {
      console.error("Confirmation failed", err);
      setError(true);
      toast.error("Failed to verify payment. Please contact support.");
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 space-y-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Verifying your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 space-y-6">
        <div className="bg-destructive/10 p-6 rounded-full">
           <ShieldCheck className="h-12 w-12 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Verification Failed</h1>
          <p className="text-muted-foreground">We couldn't verify your payment. If the amount was deducted, please contact support.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="relative mx-auto w-24 h-24">
           <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
           <div className="relative bg-success text-white rounded-full w-24 h-24 flex items-center justify-center shadow-glow">
              <CheckCircle2 className="h-12 w-12" />
           </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display">Booking Confirmed!</h1>
          <p className="text-muted-foreground">Your consultation has been successfully scheduled and payment is verified.</p>
        </div>

        <div className="glass rounded-3xl p-6 border border-border/40 text-left space-y-4">
           <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-bold text-muted-foreground uppercase">Status</span>
              <span className="text-xs font-bold text-success uppercase">PAID & CONFIRMED</span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                 <Calendar className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] uppercase font-bold text-muted-foreground">Appointment ID</p>
                 <p className="text-sm font-bold">{appointmentId?.slice(-8).toUpperCase()}</p>
              </div>
           </div>
           
           <div className="pt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
             <ShieldCheck className="h-3 w-3 text-success" />
             Verified secure payment via Stripe
           </div>
        </div>

        <div className="flex flex-col gap-3">
           <Button asChild className="bg-gradient-primary text-white h-12 rounded-xl font-bold shadow-glow">
              <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
           </Button>
           <Button variant="ghost" asChild className="rounded-xl">
              <Link to="/">Back to Home</Link>
           </Button>
        </div>
      </div>
    </div>
  );
}
