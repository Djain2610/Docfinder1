
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import DoctorCard from '../components/DoctorCard';
import { Doctor, DoctorFilters } from '../types/doctor';
import { fetchDoctors, getAllSpecialties, filterDoctors } from '../services/doctorService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<DoctorFilters>({
    search: searchParams.get('search') || '',
    consultation: (searchParams.get('consultation') as 'Video Consult' | 'In Clinic') || undefined,
    specialties: searchParams.get('specialties') ? searchParams.get('specialties')!.split(',') : [],
    sort: (searchParams.get('sort') as 'fees' | 'experience') || undefined,
  });
  
  // Fetch doctors on component mount
  useEffect(() => {
    const getDoctors = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const data = await fetchDoctors();
        setDoctors(data);
        setSpecialties(getAllSpecialties(data));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to fetch doctors. Please try again later.");
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    getDoctors();
  }, []);
  
  // Apply filters whenever filters or doctors change
  useEffect(() => {
    if (doctors.length > 0) {
      const results = filterDoctors(doctors, filters);
      setFilteredDoctors(results);
      
      // Update URL params
      const params: Record<string, string> = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.consultation) params.consultation = filters.consultation;
      if (filters.specialties && filters.specialties.length > 0) {
        params.specialties = filters.specialties.join(',');
      }
      if (filters.sort) params.sort = filters.sort;
      
      setSearchParams(params, { replace: true });
    }
  }, [doctors, filters, setSearchParams]);
  
  // Update filters based on user selections
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };
  
  // Handle search term changes
  const handleSearchChange = (term: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      search: term
    }));
  };

  // Add function to retry fetching
  const handleRetry = () => {
    const getDoctors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDoctors();
        setDoctors(data);
        setSpecialties(getAllSpecialties(data));
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Failed to fetch doctors. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    getDoctors();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search Bar */}
      <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-medical-800">Find Doctors</h1>
            <SearchBar 
              doctors={doctors}
              searchTerm={filters.search || ''}
              setSearchTerm={handleSearchChange}
            />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterPanel 
              specialties={specialties}
              filters={{
                consultation: filters.consultation,
                specialties: filters.specialties || [],
                sort: filters.sort
              }}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Doctor List */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <div className="space-y-2 flex-grow">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-4 pt-2">
                          <Skeleton className="h-10 w-20" />
                          <Skeleton className="h-10 w-20" />
                          <Skeleton className="h-10 w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className="text-red-500">{error}</AlertDescription>
                </Alert>
                <button 
                  onClick={handleRetry}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500"
                >
                  Try Again
                </button>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No doctors found matching your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">{filteredDoctors.length} doctors found</p>
                <div className="space-y-4">
                  {filteredDoctors.map(doctor => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Doctors;
