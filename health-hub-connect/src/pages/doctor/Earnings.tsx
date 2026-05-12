import React, { useEffect } from 'react';
import { TrendingUp, Wallet, Download, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchEarnings } from '../../store/slices/dataSlice';

export default function DoctorEarnings() {
  const dispatch = useDispatch<AppDispatch>();
  const { earnings, loading } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchEarnings());
  }, [dispatch]);

  if (loading && !earnings) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const transactions = earnings?.recentTransactions || [];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Earnings & Payouts</h1>
          <p className="text-muted-foreground">Track your revenue and manage your financial reports.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-border/40 glass">
          <Download className="h-4 w-4 mr-2" /> Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-hero p-8 rounded-[2.5rem] text-primary-foreground shadow-elegant relative overflow-hidden">
           <p className="text-xs font-bold opacity-70 uppercase tracking-widest">Available Balance</p>
           <h2 className="text-4xl font-bold mt-2">₹{earnings?.netEarnings?.toLocaleString() || '0.00'}</h2>
           <Button className="mt-6 bg-white text-primary font-bold rounded-xl px-6 h-11 hover:bg-white/90">
             WITHDRAW NOW
           </Button>
           <Wallet className="absolute -right-6 -bottom-6 h-32 w-32 opacity-10" />
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-soft border border-border/10 flex flex-col justify-between">
           <div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Revenue</p>
             <h2 className="text-3xl font-bold mt-2 text-foreground">₹{earnings?.totalEarnings?.toLocaleString() || '0.00'}</h2>
           </div>
           <div className="flex items-center gap-2 text-success text-xs font-bold mt-4">
             <TrendingUp className="h-4 w-4" /> +12.5% from last month
           </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] shadow-soft border border-border/10 flex flex-col justify-between">
           <div>
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Platform Fee (10%)</p>
             <h2 className="text-3xl font-bold mt-2 text-warning">₹{earnings?.commission?.toLocaleString() || '0.00'}</h2>
           </div>
           <p className="text-xs text-muted-foreground mt-4">Calculated per transaction</p>
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
                <td className="py-4 px-2 text-right font-bold text-primary">₹{t.amount}</td>
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

