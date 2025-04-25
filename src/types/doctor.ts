
export interface Doctor {
  id: number;
  name: string;
  specialty: string[];
  experience: number;
  fee: number;
  ratings: number;
  address: string;
  clinicName: string;
  place: string;
  consultationMode: ('Video Consult' | 'In Clinic')[];
}

export interface DoctorFilters {
  search?: string;
  consultation?: 'Video Consult' | 'In Clinic';
  specialties?: string[];
  sort?: 'fees' | 'experience';
}
