import React from 'react';
import { Search, Filter, Star, MapPin, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { DoctorCard } from '@/components/site/DoctorCard';
import { fetchDoctors } from '@/store/slices/dataSlice';

export default function Doctors() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const hospitalFilter = searchParams.get('hospitalId');
  const specialtyFilter = searchParams.get('specialty');
  const { doctors, loading, hospitals } = useSelector((state: RootState) => state.data);

  React.useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const filteredDoctors = doctors.filter(d => {
    const matchesHospital = !hospitalFilter || (d.hospitalId === hospitalFilter || d.hospital?._id === hospitalFilter || d.hospital?.id === hospitalFilter);
    const matchesSpecialty = !specialtyFilter || (d.specialization?.typeName === specialtyFilter || d.specialty === specialtyFilter);
    return matchesHospital && matchesSpecialty;
  });

  const filteredHospital = hospitalFilter 
    ? hospitals.find(h => h.id === hospitalFilter || h._id === hospitalFilter)
    : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight">
            {filteredHospital ? `Doctors at ${filteredHospital.name}` : 
             specialtyFilter ? `${specialtyFilter} Specialists` : "Find your doctor"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {filteredHospital 
              ? `Showing specialists available at ${filteredHospital.location}` :
              specialtyFilter ? `Showing top-rated ${specialtyFilter} experts near you.`
              : "Book with top-rated specialists in your city."
            }
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input className="pl-10 w-64 rounded-xl glass" placeholder="Search by name or specialty..." />
          </div>
          <Button variant="outline" className="rounded-xl glass">
             <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredDoctors.map(d => (
          <DoctorCard key={d.id} doctor={d} />
        ))}
        {filteredDoctors.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground font-medium italic">No doctors found matching your criteria.</p>
            {(hospitalFilter || specialtyFilter) && (
              <Button variant="link" className="mt-2 text-primary" onClick={() => window.location.search = ''}>
                View All Doctors
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
