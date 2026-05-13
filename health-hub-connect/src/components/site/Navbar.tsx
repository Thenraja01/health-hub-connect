import { Link, NavLink } from "react-router-dom";
import { 
  Activity, CalendarCheck, LayoutDashboard, Menu, Search, 
  Stethoscope, LogOut, User, ListChecks, Users, ShieldCheck, 
  Building2, Home, Settings,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";  
import { logout } from "../../store/slices/authSlice";
import api from "@/api/axios";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [appSettings, setAppSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/admin/settings/public");
        setAppSettings(res.data.data);
      } catch (error) {
        console.error("Failed to fetch app settings", error);
      }
    };
    fetchSettings();
  }, []);

  const navLinks = useMemo(() => {
    if (!isAuthenticated) return [
      { to: "/", label: "Home", icon: Home },
      { to: "/doctors", label: "Find Doctors", icon: Search },
      { to: "/hospitals", label: "Hospitals", icon: Building2 },
    ];

    switch (user?.role) {
      case 'DOCTOR':
        return [
          { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { to: "/patients", label: "My Patients", icon: Users },
        ];
      case 'ADMIN':
        return [
          { to: "/dashboard", label: "Admin Panel", icon: ShieldCheck },
          { to: "/users", label: "Manage Users", icon: Users },
          { to: "/hospitals", label: "Institutions", icon: Building2 },
          { to: "/settings", label: "App Settings", icon: Settings },
        ];
      case 'PATIENT':
      default:
        return [
          { to: "/", label: "Home", icon: Home },
          { to: "/doctors", label: "Find Doctors", icon: Search },
          { to: "/hospitals", label: "Hospitals", icon: Building2 },
          { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        ];
    }
  }, [user, isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-glow overflow-hidden">
               <img 
                 src={`${import.meta.env.VITE_API_URL}/admin/settings/logo`} 
                 alt="Logo" 
                 className="h-full w-full object-cover"
                 onError={(e) => {
                   (e.target as HTMLImageElement).style.display = 'none';
                   (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="text-white h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>';
                 }}
               />
            </div>
            <span className="font-display text-xl font-bold tracking-tight hidden sm:block">
              {appSettings?.appName || 'Medi Slot'}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" className="hidden md:inline-flex bg-gradient-primary text-primary-foreground shadow-elegant rounded-full px-6 font-bold" asChild>
                  <Link to="/signup">Join Now</Link>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end mr-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-tighter leading-none">{user?.role}</span>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full bg-secondary/50 hover:bg-destructive/10 hover:text-destructive" onClick={() => dispatch(logout())}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
              <Menu />
            </Button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border/60 px-4 py-3 animate-fade-in bg-background/95 backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-3"
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              ))}
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-gradient-primary text-white" onClick={() => setOpen(false)}>
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              ) : (
                <Button variant="destructive" className="mt-4 w-full" onClick={() => { dispatch(logout()); setOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
