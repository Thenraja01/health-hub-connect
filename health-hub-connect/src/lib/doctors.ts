export type ConsultationType = "video" | "in-person" | "instant" | "follow-up";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  image: string;
  hospital: string;
  location: string;
  languages: string[];
  consultationTypes: ConsultationType[];
  nextSlot: string;
  isOnline: boolean;
  bio: string;
  about: string;
  timings: { day: string; hours: string }[];
}

export const consultationLabels: Record<ConsultationType, string> = {
  video: "Video",
  "in-person": "In-person",
  instant: "Instant",
  "follow-up": "Follow-up",
};

export function generateSlots(date: Date): string[] {
  const slots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30",
  ];
  // pseudo-random by date
  const seed = date.getDate();
  return slots.filter((_, i) => (i + seed) % 4 !== 0);
}
