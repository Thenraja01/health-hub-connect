import React, { useEffect, useState } from 'react';
import { XCircle, ArrowLeft, RefreshCcw, AlertTriangle, ShieldX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/api/axios';
import { toast } from 'sonner';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointment_id');
  const [cancelling, setCancelling] = useState(!!appointmentId);

  useEffect(() => {
    if (appointmentId) {
      handleCancel();
    }
  }, [appointmentId]);

  const handleCancel = async () => {
    try {
      await api.post('/appointments/cancel', { appointmentId });
      toast.info("Appointment session cancelled and slot released.");
    } catch (err) {
      console.error("Cancellation failed", err);
      // We don't necessarily show an error toast here as the user already knows they cancelled
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="relative mx-auto w-24 h-24">
           <div className="absolute inset-0 bg-destructive/20 rounded-full" />
           <div className="relative bg-destructive text-white rounded-full w-24 h-24 flex items-center justify-center shadow-glow-destructive">
              <XCircle className="h-12 w-12" />
           </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display text-destructive">Payment Cancelled</h1>
          <p className="text-muted-foreground">The payment process was interrupted or cancelled. No charges were made to your account.</p>
        </div>

        <div className="glass rounded-3xl p-6 border border-border/40 text-left space-y-4">
           <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-xs font-bold text-muted-foreground uppercase">Status</span>
              <span className="text-xs font-bold text-destructive uppercase">TRANSACTION CANCELLED</span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive">
                 <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] uppercase font-bold text-muted-foreground">Appointment ID</p>
                 <p className="text-sm font-bold">{appointmentId ? appointmentId.slice(-8).toUpperCase() : 'N/A'}</p>
              </div>
           </div>
           
           <div className="pt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
             <ShieldX className="h-3 w-3 text-destructive" />
             No funds were deducted from your card
           </div>
        </div>

        <div className="flex flex-col gap-3">
           <Button asChild className="bg-primary text-white h-12 rounded-xl font-bold shadow-glow">
              <Link to="/doctors"><RefreshCcw className="mr-2 h-4 w-4" /> Try Booking Again</Link>
           </Button>
           <Button variant="ghost" asChild className="rounded-xl h-12">
              <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Go to Dashboard</Link>
           </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          If you encountered a technical issue, please <Link to="/support" className="text-primary hover:underline">contact support</Link>.
        </p>
      </div>
    </div>
  );
}
