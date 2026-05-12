import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, Activity, TrendingUp, 
  DollarSign, Clock, CheckCircle2, XCircle,
  BarChart3, Calendar, ArrowUpRight, Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    totalRevenue: 0
  });
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setStats(response.data.data.stats);
      // Fetch pending doctors
      const doctorsRes = await api.get("/admin/doctors/pending");
      setPendingDoctors(doctorsRes.data.data);
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
      setPendingDoctors(pendingDoctors.filter((d: any) => d.id !== id));
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Admin Insights</h1>
          <p className="text-muted-foreground">Monitor platform growth, revenue, and verification requests.</p>
        </div>
        <Button variant="outline" className="rounded-xl border-border/40 glass">
          <Download className="h-4 w-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Patients", value: stats.patients, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Doctors", value: stats.doctors, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Total Appointments", value: stats.appointments, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-border/40 shadow-soft hover:shadow-elegant transition-all">
            <div className={`${stat.bg} ${stat.color} h-10 w-10 rounded-xl flex items-center justify-center mb-4`}>
               <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{stat.label}</p>
            <h2 className="text-2xl font-bold mt-1">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8">
        {/* Pending Approvals */}
        <div className="glass rounded-[2rem] p-8 shadow-soft border border-border/40">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             <Clock className="h-5 w-5 text-amber-500" /> Pending Verification
           </h3>
           <div className="space-y-4">
             {pendingDoctors.length > 0 ? pendingDoctors.map((doc: any) => (
               <div key={doc.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/20 group hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                       {doc.doctorName.charAt(0)}
                     </div>
                     <div>
                       <p className="font-bold text-sm">Dr. {doc.doctorName}</p>
                       <p className="text-xs text-muted-foreground">{doc.qualification} • {doc.experienceYears} yrs exp</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Button size="sm" onClick={() => handleApproval(doc.id, 'reject')} variant="ghost" className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10">
                       <XCircle className="h-5 w-5" />
                     </Button>
                     <Button size="sm" onClick={() => handleApproval(doc.id, 'approve')} variant="ghost" className="h-9 w-9 rounded-xl text-emerald-500 hover:bg-emerald-500/10">
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

        {/* Platform Health / Activity */}
        <div className="glass rounded-[2rem] p-8 shadow-soft border border-border/40">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             <Activity className="h-5 w-5 text-primary" /> Recent Activity
           </h3>
           <div className="space-y-6">
              {[
                { event: "New Doctor Registered", time: "2 mins ago", icon: UserCheck },
                { event: "Withdrawal Request - ₹5,000", time: "1 hour ago", icon: DollarSign },
                { event: "Appointment Confirmed", time: "3 hours ago", icon: Calendar },
                { event: "Dispute Resolved #4421", time: "5 hours ago", icon: Activity },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                   {i < 3 && <div className="absolute left-[11px] top-6 w-[2px] h-full bg-border/40" />}
                   <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                      <item.icon className="h-3 w-3 text-primary" />
                   </div>
                   <div>
                     <p className="text-sm font-bold">{item.event}</p>
                     <p className="text-[10px] text-muted-foreground font-medium uppercase">{item.time}</p>
                   </div>
                </div>
              ))}
           </div>
           <Button variant="ghost" className="w-full mt-8 text-xs font-bold text-primary rounded-xl">VIEW AUDIT LOGS</Button>
        </div>
      </div>
    </div>
  );
}
