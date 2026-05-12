import React, { useEffect } from 'react';
import { Building, MapPin, Search, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchHospitals } from '../../store/slices/dataSlice';
import { Link } from 'react-router-dom';

export default function Hospitals() {
  const dispatch = useDispatch<AppDispatch>();
  const { hospitals, loading } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    if (hospitals.length === 0) {
      dispatch(fetchHospitals());
    }
  }, [dispatch, hospitals.length]);

  if (loading && hospitals.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[40vh]">
        <div className="animate-pulse text-muted-foreground font-medium">Loading hospitals...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-display mb-8">Partner Hospitals</h1>
      {hospitals.length === 0 ? (
        <div className="text-center py-12 glass rounded-3xl border border-border/20">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">No hospitals found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hospitals.map(h => (
            <div key={h.id} className="glass rounded-[2rem] p-6 shadow-soft hover-lift border border-border/20">
               <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Building className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-bold">{h.name}</h3>
               <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-3.5 w-3.5" /> {h.location}
               </div>
               <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{h.type}</span>
                  <Link to={`/hospitals/${h.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs font-bold p-0 h-auto hover:bg-transparent text-primary">
                      View Details <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
