
import { Doctor } from "../types/doctor";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    
    // Transform API data to match our Doctor interface
    return data.map((item: any) => ({
      id: Number(item.id),
      name: item.name,
      specialty: item.specialities ? item.specialities.map((s: any) => s.name) : [],
      experience: parseInt(item.experience) || 0, // Extract years from experience string
      fee: parseInt(item.fees?.replace(/[^\d]/g, '')) || 0, // Extract number from fee string
      ratings: 4.5, // Default rating since it's not in the API
      address: item.clinic?.address?.address_line1 || "",
      clinicName: item.clinic?.name || "",
      place: `${item.clinic?.address?.locality || ""}, ${item.clinic?.address?.city || ""}`,
      consultationMode: [
        ...(item.video_consult ? ["Video Consult"] : []),
        ...(item.in_clinic ? ["In Clinic"] : [])
      ] as ("Video Consult" | "In Clinic")[],
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error; // Re-throw the error so it can be caught by the component
  }
}

export function getAllSpecialties(doctors: Doctor[]): string[] {
  const specialtySet = new Set<string>();
  
  doctors.forEach(doctor => {
    doctor.specialty.forEach(specialty => {
      specialtySet.add(specialty);
    });
  });
  
  return Array.from(specialtySet).sort();
}

export function filterDoctors(
  doctors: Doctor[],
  filters: {
    search?: string;
    consultation?: 'Video Consult' | 'In Clinic';
    specialties?: string[];
    sort?: 'fees' | 'experience';
  }
): Doctor[] {
  let filteredDoctors = [...doctors];
  
  // Filter by search term
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by consultation mode
  if (filters.consultation) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.consultationMode.includes(filters.consultation as 'Video Consult' | 'In Clinic')
    );
  }
  
  // Filter by specialties
  if (filters.specialties && filters.specialties.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.specialty.some(specialty => filters.specialties?.includes(specialty))
    );
  }
  
  // Sort results
  if (filters.sort === 'fees') {
    filteredDoctors.sort((a, b) => a.fee - b.fee);
  } else if (filters.sort === 'experience') {
    filteredDoctors.sort((a, b) => b.experience - a.experience);
  }
  
  return filteredDoctors;
}
