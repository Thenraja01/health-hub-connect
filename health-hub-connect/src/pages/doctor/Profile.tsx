import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Award, BookOpen, IndianRupee, FileText, Save, Loader2, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import api from '@/api/axios';
import { toast } from "sonner";
import { updateProfile } from '../../store/slices/authSlice';

export default function DoctorProfile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doctors/${user?.id}`);
      setProfileData(res.data.data);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put('/doctor/profile', profileData);
      toast.success("Profile updated successfully");
      // Update local storage/redux if needed
      dispatch(updateProfile(res.data.data));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profileData && loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your professional identity and consultation preferences.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="glass rounded-3xl p-8 shadow-soft border border-border/20 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Full Name
              </label>
              <Input 
                value={profileData?.doctorName || ''} 
                onChange={(e) => setProfileData({...profileData, doctorName: e.target.value})}
                className="rounded-xl h-12 glass border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> Email Address
              </label>
              <Input 
                value={profileData?.email || ''} 
                disabled
                className="rounded-xl h-12 bg-muted/20 border-border/20 text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> Phone Number
              </label>
              <Input 
                value={profileData?.phone || ''} 
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="rounded-xl h-12 glass border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5" /> Qualification
              </label>
              <Input 
                value={profileData?.qualification || ''} 
                onChange={(e) => setProfileData({...profileData, qualification: e.target.value})}
                placeholder="e.g. MBBS, MD (Cardiology)"
                className="rounded-xl h-12 glass border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Award className="h-3.5 w-3.5" /> Experience (Years)
              </label>
              <Input 
                type="number"
                value={profileData?.experienceYears || 0} 
                onChange={(e) => setProfileData({...profileData, experienceYears: parseInt(e.target.value)})}
                className="rounded-xl h-12 glass border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <IndianRupee className="h-3.5 w-3.5" /> Consultation Fee (₹)
              </label>
              <Input 
                type="number"
                value={profileData?.consultationFee || 0} 
                onChange={(e) => setProfileData({...profileData, consultationFee: parseFloat(e.target.value)})}
                className="rounded-xl h-12 glass border-border/40 text-primary font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" /> Professional Bio
            </label>
            <Textarea 
              value={profileData?.bio || ''} 
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              placeholder="Tell patients about your expertise and approach to care..."
              className="rounded-2xl min-h-[150px] glass border-border/40 resize-none p-4"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border/20">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" /> Verified Professional Account
            </p>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-primary text-white rounded-xl px-10 h-12 shadow-glow font-bold"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              SAVE CHANGES
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
