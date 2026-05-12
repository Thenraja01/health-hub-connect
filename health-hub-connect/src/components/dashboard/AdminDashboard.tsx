import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserPlus, FileText, Database, 
  Settings, Users, Building2, TrendingUp,
  Activity, AlertCircle, Stethoscope, 
  Clock, CheckCircle2, XCircle, DollarSign,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import api from "@/api/axios";
import { toast } from "sonner";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/doctors/pending")
      ]);
      setStats(statsRes.data.data.stats);
      setLogs(statsRes.data.data.logs || []);
      setPendingDoctors(pendingRes.data.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, action: 'approve' | 'reject') => {
    try {
      await api.post(`/admin/doctors/${id}/${action}`);
      toast.success(`Doctor ${action}d successfully`);
      setPendingDoctors(prev => prev.filter(d => d.id !== id));
      fetchData(); // Refresh stats
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Control Center</h1>
          <p className="text-muted-foreground">Manage platform security, users, and institutional partners.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-border/60 glass">
             <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-destructive text-destructive-foreground rounded-xl shadow-elegant">
            <AlertCircle className="h-4 w-4 mr-2" /> System Lockdown
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Doctors", val: stats?.doctors || "0", icon: Stethoscope, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Patients", val: stats?.patients || "0", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Appointments", val: stats?.appointments || "0", icon: Building2, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Revenue", val: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
        ].map((x, i) => (
          <div key={i} className="glass p-6 rounded-3xl shadow-card relative overflow-hidden group border border-border/40">
            <div className="flex justify-between items-start relative z-10">
              <div className={`h-10 w-10 ${x.bg} rounded-xl flex items-center justify-center ${x.color}`}>
                <x.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full uppercase">Live</span>
            </div>
            <div className="mt-4 relative z-10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{x.label}</p>
              <p className="text-3xl font-bold mt-1 tracking-tight">{x.val}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <x.icon className="h-24 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Verification Queue */}
        <div className="glass rounded-[2.5rem] p-8 shadow-soft border border-border/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" /> Verification Queue
            </h2>
            <span className="text-xs font-bold bg-secondary px-3 py-1 rounded-full">{pendingDoctors.length} Pending</span>
          </div>
          <div className="space-y-4">
            {pendingDoctors.length > 0 ? pendingDoctors.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-secondary/30 rounded-3xl border border-border/20 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center font-bold text-xs text-primary shadow-soft">
                    {doc.doctorName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">Dr. {doc.doctorName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{doc.qualification} · {doc.experienceYears} yrs exp</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" onClick={() => handleApproval(doc.id, 'reject')} className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10">
                    <XCircle className="h-5 w-5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleApproval(doc.id, 'approve')} className="h-9 w-9 rounded-xl text-emerald-500 hover:bg-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                 <CheckCircle2 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                 <p className="text-sm text-muted-foreground font-medium">All clear! No pending requests.</p>
              </div>
            )}
          </div>
        </div>

        {/* System Activity */}
        <div className="glass rounded-[2.5rem] p-8 shadow-soft border border-border/40">
           <h3 className="font-bold mb-6 flex items-center gap-2">
             <Activity className="h-5 w-5 text-primary" /> Platform Activity
           </h3>
           <div className="space-y-6">
              {logs.length > 0 ? logs.map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                   {i < logs.length - 1 && <div className="absolute left-[11px] top-6 w-[2px] h-full bg-border/40" />}
                   <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                      <Activity className="h-3 w-3 text-primary" />
                   </div>
                   <div>
                     <p className="text-sm font-bold">{item.action}</p>
                     <p className="text-[10px] text-muted-foreground font-medium uppercase">{item.module} · {new Date(item.createdAt).toLocaleTimeString()}</p>
                   </div>
                </div>
              )) : (
                <div className="text-center py-8">
                   <p className="text-xs text-muted-foreground italic">No recent activity found.</p>
                </div>
              )}
           </div>
           <Button variant="ghost" className="w-full mt-8 text-xs font-bold text-primary rounded-xl">VIEW FULL LOGS</Button>
        </div>
      </div>
    </div>
  );
};

