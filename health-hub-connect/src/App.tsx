import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/public/Home.tsx";
import DoctorsList from "./pages/public/Doctors.tsx";
import DoctorDetails from "./pages/public/DoctorDetails.tsx";
import BookDoctor from "./pages/patient/Booking.tsx";
import BookingSuccess from "./pages/patient/BookingSuccess.tsx";
import PaymentCancel from "./pages/patient/PaymentCancel.tsx";
import Dashboard from "./pages/public/DashboardSwitcher.tsx";
import AuthPage from "./pages/public/Auth.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import HospitalsPage from "./pages/public/Hospitals.tsx";
import HospitalDetails from "./pages/public/HospitalDetails.tsx";

import DoctorOnboarding from "./pages/doctor/Onboarding.tsx";
import DoctorPatients from "./pages/doctor/Patients.tsx";
import DoctorTasks from "./pages/doctor/Tasks.tsx";
import DoctorSchedule from "./pages/doctor/Schedule.tsx";
import DoctorEarnings from "./pages/doctor/Earnings.tsx";
import DoctorProfile from "./pages/doctor/Profile.tsx";
import AdminUsers from "./pages/admin/Users.tsx";

import { Toaster } from "./components/ui/sonner";

import { useSelector } from "react-redux";
import { RootState } from "./store";
import {AdminDashboard} from "./components/dashboard/AdminDashboard.tsx";

const RoleBasedIndex = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || user?.role === 'PATIENT') {
    return <Home />;
  }

  if (user?.role === 'DOCTOR') {
    return <DoctorProfile />;
  }

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  return <Home />;
};

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<RoleBasedIndex />} />
        <Route path="doctors" element={<DoctorsList />} />
        <Route path="doctors/:doctorId" element={<DoctorDetails />} />
        <Route path="hospitals" element={<HospitalsPage />} />
        <Route path="hospitals/:hospitalId" element={<HospitalDetails />} />
        
        {/* Protected Routes WITH Navbar */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="book/:doctorId" element={<BookDoctor />} />
          <Route path="booking/success" element={<BookingSuccess />} />
          <Route path="payment-cancel" element={<PaymentCancel />} />
          
          {/* Doctor Specific */}
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="tasks" element={<DoctorTasks />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="earnings" element={<DoctorEarnings />} />
          <Route path="profile" element={<DoctorProfile />} />
          
          {/* Admin Specific */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>

      {/* Routes WITHOUT Navbar/Layout */}
      <Route element={<ProtectedRoute />}>
         <Route path="onboarding" element={<DoctorOnboarding />} />
      </Route>

      <Route path="login" element={<AuthPage />} />
      <Route path="signup" element={<AuthPage />} />
    </Routes>
    </>
  );
}

export default App;
