import React, { useEffect } from 'react';
import { Users as UsersIcon, UserCheck, Shield, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchAdminUsers } from '../../store/slices/dataSlice';

export default function AdminUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, doctors } = useSelector((state: RootState) => state.data);
  
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const users = [
    ...doctors.map(d => ({ ...d, name: d.name, role: "DOCTOR" })),
    ...patients.map(p => ({ ...p, name: p.fullName || p.name, role: "PATIENT" }))
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage accounts, roles, and platform permissions.</p>
        </div>
        <Button className="bg-gradient-primary text-white rounded-xl shadow-glow">
          <UserCheck className="h-4 w-4 mr-2" /> Invite User
        </Button>
      </div>

      <div className="glass rounded-[2rem] p-6 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40">
              <th className="pb-4 px-2">User</th>
              <th className="pb-4 px-2">Role</th>
              <th className="pb-4 px-2">Status</th>
              <th className="pb-4 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((u, i) => (
              <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="py-4 px-2">
                  <div className="font-bold">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>
                <td className="py-4 px-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    u.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 
                    u.role === 'DOCTOR' ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {u.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    u.status === 'Active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-4 px-2 text-right">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
