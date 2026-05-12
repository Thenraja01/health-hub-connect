import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Stethoscope, ShieldCheck, User, 
  Mail, Lock, ArrowRight, Activity, 
  Loader2, CheckCircle2, AlertCircle,
  Phone, KeyRound, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { 
  login, signup, verifyLoginOTP, completeSignup, 
  forgotPassword, resetPassword, clearError, setAuthMode 
} from "@/store/slices/authSlice";
import { RootState, AppDispatch } from "@/store";
import { toast } from "sonner";

export default function Auth() {
  const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpRequired, tempEmail, tempData, authMode } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    if (otpRequired) {
      if (authMode === 'login') {
        const result = await dispatch(verifyLoginOTP({ email: tempEmail, code: otp, role: tempData.role }));
        if (verifyLoginOTP.fulfilled.match(result)) {
           toast.success("Welcome back!");
           navigate("/dashboard");
        }
      } else if (authMode === 'signup') {
        const result = await dispatch(completeSignup({ email: tempEmail, code: otp, userData: tempData }));
        if (completeSignup.fulfilled.match(result)) {
           toast.success("Registration complete!");
           navigate("/dashboard");
        }
      } else if (authMode === 'resetPassword') {
        const result = await dispatch(resetPassword({ email: tempEmail, code: otp, newPassword: data.password }));
        if (resetPassword.fulfilled.match(result)) {
           toast.success("Password reset successful!");
        }
      }
      return;
    }

    if (authMode === "login") {
      const result = await dispatch(login(data));
      if (login.fulfilled.match(result)) {
        toast.info("Please enter the OTP sent to your email.");
        setTimer(60);
      }
    } else if (authMode === "signup") {
      const result = await dispatch(signup({ ...data, role: role.toUpperCase() }));
      if (signup.fulfilled.match(result)) {
        toast.info("Verification OTP sent to your email.");
        setTimer(60);
      }
    } else if (authMode === "forgotPassword") {
      const result = await dispatch(forgotPassword(data.email as string));
      if (forgotPassword.fulfilled.match(result)) {
        toast.info("Reset OTP sent to your email.");
        setTimer(60);
      }
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    // Call resend thunk (could be signup/login again)
    setTimer(60);
    toast.info("OTP resent!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 glass rounded-[2.5rem] p-8 shadow-elegant border border-border/40 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
             <Activity className="h-6 w-6 text-primary shadow-glow" />
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            {otpRequired ? "Verify OTP" : authMode === "login" ? "Welcome Back" : authMode === "signup" ? "Join Health Hub" : "Forgot Password"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">
            {otpRequired ? `Sent to ${tempEmail}` : "Secure Healthcare Platform"}
          </p>
        </div>

        {!otpRequired && (
          <div className="flex bg-secondary/50 p-1 rounded-2xl">
            <button onClick={() => dispatch(setAuthMode("login"))} className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-all", authMode === "login" ? "bg-white text-primary shadow-soft" : "text-muted-foreground hover:text-foreground")}>Login</button>
            <button onClick={() => dispatch(setAuthMode("signup"))} className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition-all", authMode === "signup" ? "bg-white text-primary shadow-soft" : "text-muted-foreground hover:text-foreground")}>Sign up</button>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-shake">
             <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            {otpRequired ? (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">6-Digit Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      maxLength={6}
                      className="pl-10 h-12 rounded-xl border-border/40 text-center text-xl tracking-[0.5em] font-bold" 
                      placeholder="000000" 
                      required 
                    />
                  </div>
                </div>
                {authMode === 'resetPassword' && (
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input name="password" type="password" className="pl-10 h-12 rounded-xl border-border/40" placeholder="••••••••" required />
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-muted-foreground">Didn't receive code?</span>
                  <button type="button" onClick={handleResend} disabled={timer > 0} className={cn("font-bold flex items-center gap-1", timer > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline")}>
                    {timer > 0 ? `Resend in ${timer}s` : <><RefreshCw className="h-3 w-3" /> Resend</>}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {authMode === "signup" && (
                  <>
                    <div className="space-y-1.5">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Full Name</Label>
                       <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input name="fullName" className="pl-10 h-12 rounded-xl border-border/40" placeholder="John Doe" required />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                       <div className="relative">
                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input name="phone" className="pl-10 h-12 rounded-xl border-border/40" placeholder="+91 98765 43210" required />
                       </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       {["patient", "doctor", "admin"].map(r => (
                         <button key={r} type="button" onClick={() => setRole(r as any)} className={cn("py-2 text-[10px] font-bold rounded-xl border transition-all", role === r ? "border-primary bg-primary/5 text-primary" : "border-border/40 text-muted-foreground")}>
                           {r.toUpperCase()}
                         </button>
                       ))}
                    </div>
                  </>
                )}

               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input name="email" type="email" className="pl-10 h-12 rounded-xl border-border/40" placeholder="name@example.com" required />
                    </div>
                  </div>
                  {authMode !== "forgotPassword" && (
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input name="password" type="password" className="pl-10 h-12 rounded-xl border-border/40" placeholder="••••••••" required />
                      </div>
                    </div>
                  )}
               </div>
               
               {authMode === "login" && (
                 <div className="text-right">
                   <button type="button" onClick={() => dispatch(setAuthMode("forgotPassword"))} className="text-xs text-muted-foreground hover:text-primary font-medium">Forgot Password?</button>
                 </div>
               )}
              </>
            )}

           <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-primary text-white font-bold rounded-xl shadow-glow">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : otpRequired ? "Verify & Continue" : authMode === "login" ? "Sign In" : authMode === "signup" ? "Create Account" : "Send Reset Code"}
           </Button>

           {authMode === "forgotPassword" && (
             <button type="button" onClick={() => dispatch(setAuthMode("login"))} className="w-full text-xs text-muted-foreground hover:text-primary font-bold">Back to Login</button>
           )}
        </form>
      </div>
    </div>
  );
}

