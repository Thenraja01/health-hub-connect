import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Palette, Percent, 
  Layout, Image as ImageIcon, Save, Loader2, Upload
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/axios";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: 'Medi Slot',
    commissionRate: 20,
    brandingColor: '#000000',
    appLogo: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/admin/settings");
      setSettings(response.data.data);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/admin/settings", settings);
      
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
        await api.post("/admin/settings/logo", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" /> Configuration
        </h1>
        <p className="text-muted-foreground">Manage global application settings, branding, and commissions.</p>
      </div>

      <div className="grid gap-8">
        {/* General Settings */}
        <div className="glass rounded-[2rem] p-8 shadow-soft border border-border/40 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Layout className="h-5 w-5 text-blue-500" /> Branding & Identity
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input 
                id="appName" 
                value={settings.appName} 
                onChange={(e) => setSettings({...settings, appName: e.target.value})}
                className="rounded-xl border-border/40"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Primary Branding Color</Label>
              <div className="flex gap-4">
                <Input 
                  id="color" 
                  type="color" 
                  value={settings.brandingColor || '#000000'} 
                  onChange={(e) => setSettings({...settings, brandingColor: e.target.value})}
                  className="h-10 w-20 p-1 rounded-lg border-border/40"
                />
                <Input 
                  value={settings.brandingColor || '#000000'} 
                  onChange={(e) => setSettings({...settings, brandingColor: e.target.value})}
                  className="rounded-xl border-border/40"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/10">
            <Label>Application Logo</Label>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-2xl bg-secondary/30 border-2 border-dashed border-border/40 flex items-center justify-center overflow-hidden">
                {logoFile ? (
                  <img src={URL.createObjectURL(logoFile)} alt="Preview" className="h-full w-full object-contain p-2" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                )}
              </div>
              <div className="space-y-2">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="max-w-xs rounded-xl"
                />
                <p className="text-[10px] text-muted-foreground">PNG or JPG recommended. Max 2MB.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="glass rounded-[2rem] p-8 shadow-soft border border-border/40 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Percent className="h-5 w-5 text-emerald-500" /> Revenue & Fees
          </h3>
          
          <div className="max-w-xs space-y-2">
            <Label htmlFor="commission">Platform Commission (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="commission" 
                type="number" 
                value={settings.commissionRate} 
                onChange={(e) => setSettings({...settings, commissionRate: parseInt(e.target.value)})}
                className="pl-10 rounded-xl border-border/40"
              />
            </div>
            <p className="text-xs text-muted-foreground">Percentage taken from every successful booking.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="rounded-2xl px-8 py-6 h-auto text-lg font-bold shadow-elegant hover:shadow-none transition-all"
          >
            {saving ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> SAVING...</>
            ) : (
              <><Save className="h-5 w-5 mr-2" /> SAVE CHANGES</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
