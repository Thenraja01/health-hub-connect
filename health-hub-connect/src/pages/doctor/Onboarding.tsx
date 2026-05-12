import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Stethoscope, 
  Building, 
  FileText, 
  Award, 
  MapPin, 
  Upload, 
  User, 
  Phone, 
  Calendar, 
  Briefcase, 
  ShieldCheck, 
  Heart,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  DollarSign,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DoctorOnboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as any)?.role || 'doctor';

  const stepsForRole = {
    patient: [1],
    doctor: [1, 2, 3],
    admin: [1, 3]
  };

  const activeSteps = (stepsForRole as any)[role] || [1, 2, 3];
  const totalSteps = activeSteps.length;
  const currentStepId = activeSteps[step - 1];

  const [formData, setFormData] = useState({
    // Personal Info
    doctorName: '',
    gender: '',
    dob: '',
    phone: '',
    alternatePhone: '',
    profileImage: null,

    // Professional
    qualification: '',
    experienceYears: '',
    licenseNumber: '',
    specialization: 'General Physician',
    bio: '',

    // Practice
    hospitalName: '',
    consultationFee: '',
    followupFee: '',
    consultationType: 'IN_PERSON',
    city: '',
    state: '',
    pincode: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      nextStep();
    } else {
      console.log('Form Submitted for role:', role, formData);
      navigate('/dashboard');
    }
  };

  const getStepLabel = (stepId: number) => {
    switch(stepId) {
      case 1: return 'Personal';
      case 2: return 'Professional';
      case 3: return 'Practice';
      default: return '';
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {activeSteps.map((s: number, idx: number) => (
        <React.Fragment key={s}>
          <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
            step > idx ? 'bg-primary border-primary text-white shadow-glow' : 
            step === idx + 1 ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground'
          }`}>
            {step > idx + 1 ? <CheckCircle2 className="h-6 w-6" /> : <span className="font-bold">{idx + 1}</span>}
            <span className="absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              {getStepLabel(s)}
            </span>
          </div>
          {idx < totalSteps - 1 && (
            <div className={`w-20 h-0.5 transition-all duration-500 ${step > idx + 1 ? 'bg-primary' : 'bg-border'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-soft py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary animate-bounce-subtle">
            {role === 'doctor' ? <Stethoscope className="h-8 w-8" /> : role === 'admin' ? <ShieldCheck className="h-8 w-8" /> : <User className="h-8 w-8" />}
          </div>
          <h1 className="text-4xl font-bold font-display tracking-tight capitalize">{role} Onboarding</h1>
          <p className="text-muted-foreground mt-2">Complete your profile to get started with Health Hub.</p>
        </div>

        {renderStepIndicator()}

        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-elegant relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl" />

          <form onSubmit={handleComplete} className="space-y-8 relative z-10">
            {currentStepId === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl" 
                        placeholder="Dr. John Doe" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl" 
                        placeholder="+1 234 567 890" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-border bg-secondary/20">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Upload your photo</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                    <Input type="file" className="hidden" id="profile-upload" />
                    <Button type="button" variant="outline" className="ml-auto rounded-xl h-9" onClick={() => document.getElementById('profile-upload')?.click()}>
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStepId === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Medical License Number</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl" 
                        placeholder="LIC-98765432" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl" 
                        placeholder="10" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <select 
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm"
                    required
                  >
                    <option>General Physician</option>
                    <option>Cardiologist</option>
                    <option>Dermatologist</option>
                    <option>Pediatrician</option>
                    <option>Neurologist</option>
                    <option>Orthopedic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-2xl border border-input bg-background text-sm min-h-[120px] focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="Describe your medical background, expertise, and patient care philosophy..."
                  />
                </div>
              </div>
            )}

            {currentStepId === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <Label>Hospital / Clinic Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                      className="pl-10 h-12 rounded-xl" 
                      placeholder="St. Mary's Medical Center" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Consultation Fee ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl" 
                        placeholder="100" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Follow-up Fee ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number"
                        name="followupFee"
                        value={formData.followupFee}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl" 
                        placeholder="50" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input name="city" value={formData.city} onChange={handleInputChange} className="h-11 rounded-xl" placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input name="state" value={formData.state} onChange={handleInputChange} className="h-11 rounded-xl" placeholder="NY" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Input name="pincode" value={formData.pincode} onChange={handleInputChange} className="h-11 rounded-xl" placeholder="10001" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 space-y-4">
                  <h3 className="text-sm font-bold text-destructive flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      placeholder="Contact Name" 
                      className="h-10 bg-background" 
                    />
                    <Input 
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      placeholder="Contact Phone" 
                      className="h-10 bg-background" 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <Button 
                  type="button" 
                  onClick={prevStep}
                  variant="outline" 
                  className="h-14 px-8 rounded-2xl font-bold flex-1"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" /> Back
                </Button>
              )}
              <Button 
                type="submit" 
                className={`h-14 px-8 rounded-2xl font-bold shadow-glow transition-all flex-[2] ${
                  step === totalSteps ? 'bg-gradient-success text-white' : 'bg-gradient-primary text-white'
                }`}
              >
                {step === totalSteps ? 'Complete Onboarding' : 'Continue'}
                {step !== totalSteps && <ChevronRight className="ml-2 h-5 w-5" />}
                {step === totalSteps && <CheckCircle2 className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
