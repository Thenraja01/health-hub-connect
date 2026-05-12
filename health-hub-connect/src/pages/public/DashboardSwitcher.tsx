import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function DashboardSwitcher() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user?.role === 'DOCTOR') {
    return <DoctorDashboard />;
  }

  return <UserDashboard />;
}
