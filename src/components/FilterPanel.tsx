
import { Button } from './ui/button';

interface FilterPanelProps {
  specialties: string[];
  filters: {
    consultation?: 'Video Consult' | 'In Clinic';
    specialties: string[];
    sort?: 'fees' | 'experience';
  };
  onFilterChange: (filterType: string, value: any) => void;
}

const FilterPanel = ({ specialties, filters, onFilterChange }: FilterPanelProps) => {
  const clearFilters = () => {
    onFilterChange('consultation', undefined);
    onFilterChange('specialties', []);
    onFilterChange('sort', undefined);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        {(filters.consultation || filters.specialties.length > 0 || filters.sort) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-medical-600 hover:text-medical-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Consultation Mode Filter */}
      <div>
        <h3 data-testid="filter-header-moc" className="text-lg font-medium mb-3">
          Consultation Mode
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="filter-video-consult"
              checked={filters.consultation === 'Video Consult'}
              onChange={() => onFilterChange('consultation', 'Video Consult')}
              className="w-4 h-4 text-medical-600 focus:ring-medical-500"
            />
            <span>Video Consult</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="filter-in-clinic"
              checked={filters.consultation === 'In Clinic'}
              onChange={() => onFilterChange('consultation', 'In Clinic')}
              className="w-4 h-4 text-medical-600 focus:ring-medical-500"
            />
            <span>In Clinic</span>
          </label>
        </div>
      </div>

      {/* Specialties Filter */}
      <div>
        <h3 data-testid="filter-header-speciality" className="text-lg font-medium mb-3">
          Specialties
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {specialties.map((specialty) => (
            <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                data-testid={`filter-specialty-${specialty}`}
                checked={filters.specialties.includes(specialty)}
                onChange={() => {
                  const newSpecialties = filters.specialties.includes(specialty)
                    ? filters.specialties.filter(s => s !== specialty)
                    : [...filters.specialties, specialty];
                  onFilterChange('specialties', newSpecialties);
                }}
                className="w-4 h-4 text-medical-600 focus:ring-medical-500 rounded"
              />
              <span>{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 data-testid="filter-header-sort" className="text-lg font-medium mb-3">
          Sort By
        </h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="sort-fees"
              checked={filters.sort === 'fees'}
              onChange={() => onFilterChange('sort', 'fees')}
              className="w-4 h-4 text-medical-600 focus:ring-medical-500"
            />
            <span>Fees (Low to High)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              data-testid="sort-experience"
              checked={filters.sort === 'experience'}
              onChange={() => onFilterChange('sort', 'experience')}
              className="w-4 h-4 text-medical-600 focus:ring-medical-500"
            />
            <span>Experience (High to Low)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
