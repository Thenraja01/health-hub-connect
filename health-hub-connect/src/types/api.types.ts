/**
 * Shared TypeScript Types for API Communication
 * Defines all API request/response interfaces for type safety
 */

// ============================================================================
// Common Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  error?: string | string[];
  code?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: Record<string, any>;
}

// ============================================================================
// User Types
// ============================================================================

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'DELETED';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'PATIENT' | 'DOCTOR';
}

export interface OTPVerificationRequest {
  email: string;
  code: string;
  role?: UserRole;
}

export interface PasswordResetRequest {
  email: string;
  newPassword: string;
  code: string;
}

// ============================================================================
// Patient Types
// ============================================================================

export interface Patient extends User {
  role: 'PATIENT';
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string[];
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface PatientProfile extends Patient {
  appointmentCount: number;
  totalSpent: number;
  averageRating: number;
}

// ============================================================================
// Doctor Types
// ============================================================================

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ConsultationType = 'VIDEO' | 'AUDIO' | 'CHAT' | 'IN_PERSON' | 'INSTANT' | 'FOLLOWUP';

export interface Doctor extends User {
  role: 'DOCTOR';
  qualification?: string;
  experienceYears?: number;
  licenseNumber?: string;
  specialization?: string;
  bio?: string;
  consultationFee?: number;
  followupFee?: number;
  averageRating?: number;
  totalReviews?: number;
  hospitalName?: string;
  location?: string;
  kycStatus: ApprovalStatus;
  isApproved: boolean;
  isOnline: boolean;
  stripeAccountId?: string;
  stripeOnboardingComplete: boolean;
}

export interface DoctorProfile extends Doctor {
  availableSlots: AppointmentSlot[];
  schedule: DoctorSchedule[];
  languages: string[];
  totalEarnings: number;
  walletBalance: number;
}

export interface DoctorSchedule {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  slotDuration: number;
  breakStartTime?: string;
  breakEndTime?: string;
  maxPatients: number;
  isActive: boolean;
}

// ============================================================================
// Appointment Types
// ============================================================================

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED'
  | 'MISSED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';

export interface AppointmentSlot {
  id: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  slotStatus: SlotStatus;
  isBookable: boolean;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  symptoms?: string;
  consultationType: ConsultationType;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  appointmentStatus: AppointmentStatus;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  doctor?: Doctor;
  patient?: Patient;
}

export interface BookAppointmentRequest {
  doctorId: string;
  slotId: string;
  symptoms?: string;
  consultationType: ConsultationType;
}

export interface RescheduleAppointmentRequest {
  newSlotId: string;
  reason?: string;
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentType = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET' | 'CASH' | 'INSURANCE';

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  transactionId: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCheckoutRequest {
  appointmentId: string;
  amount: number;
  paymentType: PaymentType;
}

export interface PaymentVerifyRequest {
  appointmentId: string;
  paymentIntentId: string;
  sessionId?: string;
}

// ============================================================================
// Prescription Types
// ============================================================================

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  severity: SeverityLevel;
  notes?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  medicines: Medicine[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  medicines: Medicine[];
  notes?: string;
}

// ============================================================================
// Hospital Types
// ============================================================================

export interface Hospital {
  id: string;
  hospitalName: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  openingTime?: string;
  closingTime?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Review Types
// ============================================================================

export interface PatientReview {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  rating: number; // 1-5
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  appointmentId: string;
  doctorId: string;
  rating: number;
  review: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface DashboardMetrics {
  totalAppointments: number;
  totalRevenue: number;
  averageRating: number;
  patientCount: number;
  appointmentsThisMonth: number;
  appointmentsThisWeek: number;
  pendingPayments: number;
  completedAppointments: number;
}

export interface DoctorAnalytics {
  doctorId: string;
  totalAppointments: number;
  totalEarnings: number;
  averageRating: number;
  patientCount: number;
  appointmentsThisMonth: number;
  completionRate: number;
  cancelledAppointments: number;
}
