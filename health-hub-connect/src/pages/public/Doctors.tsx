import React from 'react';
import { Search, Filter, Star, MapPin, ChevronRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { DoctorCard } from '@/components/site/DoctorCard';
import { fetchDoctors } from '@/store/slices/dataSlice';

export default function Doctors() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const hospitalId = searchParams.get('hospitalId');
  const specialty = searchParams.get('specialty');
  const searchParam = searchParams.get('search') || "";
  const locationParam = searchParams.get('location') || "";

  const [localSearch, setLocalSearch] = React.useState(searchParam);
  const [localLocation, setLocalLocation] = React.useState(locationParam);

  const { doctors, loading, hospitals } = useSelector((state: RootState) => state.data);

  React.useEffect(() => {
    dispatch(fetchDoctors({ 
      hospitalId, 
      specialty, 
      search: searchParam, 
      location: locationParam 
    }));
  }, [dispatch, hospitalId, specialty, searchParam, locationParam]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (localSearch) newParams.set('search', localSearch);
    else newParams.delete('search');
    
    if (localLocation) newParams.set('location', localLocation);
    else newParams.delete('location');
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setLocalSearch("");
    setLocalLocation("");
    setSearchParams({});
  };

  const filteredHospital = hospitalId 
    ? hospitals.find(h => h.id === hospitalId || h._id === hospitalId)
    : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight">
            {filteredHospital ? `Doctors at ${filteredHospital.hospitalName}` : 
             specialty ? `${specialty} Specialists` : "Find your doctor"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {filteredHospital 
              ? `Showing specialists available at ${filteredHospital.city || filteredHospital.location}` :
              specialty ? `Showing top-rated ${specialty} experts near you.`
              : "Book with top-rated specialists in your city."
            }
          </p>
        </div>
        
        <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
               className="pl-10 w-full sm:w-64 rounded-xl glass" 
               placeholder="Name or specialty..." 
               value={localSearch}
               onChange={(e) => setLocalSearch(e.target.value)}
             />
          </div>
          <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
               className="pl-10 w-full sm:w-48 rounded-xl glass" 
               placeholder="City or state..." 
               value={localLocation}
               onChange={(e) => setLocalLocation(e.target.value)}
             />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 sm:flex-none rounded-xl bg-primary text-primary-foreground shadow-elegant">
               Search
            </Button>
            {(searchParam || locationParam || specialty || hospitalId) && (
              <Button type="button" variant="ghost" onClick={clearFilters} className="rounded-xl glass px-3">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {doctors.map(d => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
          {doctors.length === 0 && (
            <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-border">
              <p className="text-muted-foreground font-medium italic">No doctors found matching your criteria.</p>
              <Button variant="link" className="mt-2 text-primary" onClick={clearFilters}>
                View All Doctors
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
