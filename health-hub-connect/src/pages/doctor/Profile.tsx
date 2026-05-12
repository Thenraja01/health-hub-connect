import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Award, BookOpen, IndianRupee, FileText, Save, Loader2, CheckCircle, MapPin, Stethoscope, Languages, Plus } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('certification', file);

      const res = await api.post('/doctors/upload-certification', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("Certification uploaded successfully");
      setProfileData(res.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Stethoscope className="h-3.5 w-3.5" /> Hospital
              </label>
              <Input 
                value={profileData?.hospitalName || ''} 
                onChange={(e) => setProfileData({...profileData, hospitalName: e.target.value})}
                placeholder="e.g. City General Hospital"
                className="rounded-xl h-12 glass border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> Location
              </label>
              <Input 
                value={profileData?.location || ''} 
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                placeholder="e.g. New York, USA"
                className="rounded-xl h-12 glass border-border/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Languages className="h-3.5 w-3.5" /> Languages (Comma separated)
              </label>
              <Input 
                value={profileData?.languages?.map((l: any) => l.language).join(', ') || ''} 
                onChange={(e) => {
                  const langs = e.target.value.split(',').map(s => ({ language: s.trim() }));
                  setProfileData({...profileData, languages: langs});
                }}
                placeholder="e.g. English, Spanish"
                className="rounded-xl h-12 glass border-border/40"
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

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Award className="h-3.5 w-3.5" /> Certifications & Documents
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {profileData?.kycDocuments?.map((doc: any, i: number) => (
                 <div key={i} className="flex items-center justify-between p-3 glass rounded-xl border border-border/40">
                    <div className="flex items-center gap-3">
                       <FileText className="h-5 w-5 text-primary" />
                       <div>
                          <p className="text-xs font-bold truncate max-w-[150px]">{doc.name}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[10px]" asChild>
                       <a href={doc.url} target="_blank" rel="noreferrer">View</a>
                    </Button>
                 </div>
               ))}
               
               <div className="relative group">
                 <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                 />
                 <div className="h-14 border-2 border-dashed border-border/60 rounded-2xl flex items-center justify-center gap-2 text-muted-foreground group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-tight">Upload Certification</span>
                 </div>
               </div>
            </div>
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
