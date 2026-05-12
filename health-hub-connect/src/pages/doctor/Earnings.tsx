import React, { useEffect, useState } from 'react';
import { TrendingUp, Wallet, Download, Calendar, ArrowUpRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchEarnings, fetchWallet, onboardStripe } from '../../store/slices/dataSlice';
import { toast } from 'sonner';
import api from '../../api/axios';

export default function DoctorEarnings() {
  const dispatch = useDispatch<AppDispatch>();
  const { earnings, wallet, loading, profile } = useSelector((state: RootState) => state.data);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchEarnings());
    dispatch(fetchWallet());
  }, [dispatch]);

  const handleWithdraw = async () => {
    if (!wallet?.availableBalance || wallet.availableBalance <= 0) {
      toast.error("No balance available for withdrawal");
      return;
    }

    setProcessing(true);
    try {
      await api.post('/doctor/withdraw', { amount: wallet.availableBalance });
      toast.success("Withdrawal processed successfully!");
      dispatch(fetchWallet());
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleStripeOnboard = async () => {
    setProcessing(true);
    try {
      const result = await dispatch(onboardStripe()).unwrap();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      toast.error(error || "Failed to start onboarding");
    } finally {
      setProcessing(false);
    }
  };

  if (loading && !earnings && !wallet) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const transactions = earnings?.recentTransactions || [];
  const isStripeConnected = profile?.stripeOnboardingComplete;

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Earnings & Payouts</h1>
          <p className="text-muted-foreground">Track your revenue and manage your financial reports.</p>
        </div>
        <div className="flex gap-4">
          {!isStripeConnected && (
            <Button onClick={handleStripeOnboard} disabled={processing} className="rounded-xl bg-primary text-white shadow-glow">
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wallet className="h-4 w-4 mr-2" />}
              Connect Stripe
            </Button>
          )}
          <Button variant="outline" className="rounded-xl border-border/40 glass">
            <Download className="h-4 w-4 mr-2" /> Download Report
          </Button>
        </div>
      </div>

      {!isStripeConnected && (
        <div className="bg-warning/10 border border-warning/20 p-6 rounded-3xl flex items-center gap-4 text-warning">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-bold">Stripe Connect Required</p>
            <p className="text-sm opacity-90">Please connect your Stripe account to receive payments directly and enable withdrawals.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-hero p-8 rounded-[2.5rem] text-primary-foreground shadow-elegant relative overflow-hidden">
           <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Available Balance</p>
           <h2 className="text-4xl font-bold mt-2">${wallet?.availableBalance?.toFixed(2) || '0.00'}</h2>
           <Button 
            onClick={handleWithdraw} 
            disabled={processing || !isStripeConnected || !wallet?.availableBalance}
            className="mt-6 bg-white text-primary font-bold rounded-xl px-6 h-11 hover:bg-white/90 shadow-glow"
           >
             {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
             WITHDRAW NOW
           </Button>
           <Wallet className="absolute -right-6 -bottom-6 h-32 w-32 opacity-10" />
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-soft border border-border/10 flex flex-col justify-between">
           <div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Revenue</p>
             <h2 className="text-3xl font-bold mt-2 text-foreground">${wallet?.totalEarned?.toFixed(2) || '0.00'}</h2>
           </div>
           <div className="flex items-center gap-2 text-success text-xs font-bold mt-4">
             <TrendingUp className="h-4 w-4" /> +12.5% from last month
           </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-soft border border-border/10 flex flex-col justify-between">
           <div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Admin Commission (20%)</p>
             <h2 className="text-3xl font-bold mt-2 text-warning">${(wallet?.totalEarned * 0.25).toFixed(2) || '0.00'}</h2>
           </div>
           <p className="text-xs text-muted-foreground mt-4 italic">Automatically deducted via Stripe</p>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-8 shadow-soft overflow-hidden">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
           <Calendar className="h-5 w-5 text-primary" /> Recent Transactions
        </h3>
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40">
              <th className="pb-4 px-2">Transaction ID</th>
              <th className="pb-4 px-2">Patient</th>
              <th className="pb-4 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {transactions.length > 0 ? transactions.map((t: any, i: number) => (
              <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="py-4 px-2">
                  <div className="font-bold">{t.id}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(t.date).toLocaleDateString()}</div>
                </td>
                <td className="py-4 px-2 text-muted-foreground font-medium">{t.patientName}</td>
                <td className="py-4 px-2 text-right font-bold text-primary">${t.amount}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="py-12 text-center text-muted-foreground italic">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

