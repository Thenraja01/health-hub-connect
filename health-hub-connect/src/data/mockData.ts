import doc1 from "@/assets/doc-1.jpg";
import doc2 from "@/assets/doc-2.jpg";
import doc3 from "@/assets/doc-3.jpg";
import doc4 from "@/assets/doc-4.jpg";

export const doctors = [
  {
    id: "ananya-rao",
    name: "Dr. Ananya Rao",
    specialty: "Cardiology",
    qualifications: "MBBS, MD, DM (Cardiology)",
    experience: 12,
    rating: 4.9,
    reviews: 642,
    fee: 800,
    image: doc1,
    hospital: "Apollo Heart Institute",
    location: "Bengaluru",
    languages: ["English", "Hindi", "Kannada"],
    consultationTypes: ["video", "in-person", "follow-up"],
    nextSlot: "Today, 6:30 PM",
    online: true,
    bio: "Senior interventional cardiologist focused on preventive care and heart-failure management.",
    about: "Dr. Ananya Rao is a board-certified cardiologist with 12+ years of clinical experience across India and the UK.",
    role: "DOCTOR",
    timings: [{ day: "Mon – Fri", hours: "10:00 AM – 7:00 PM" }]
  },
  {
    id: "marcus-cohen",
    name: "Dr. Marcus Cohen",
    specialty: "Dermatology",
    qualifications: "MBBS, MD (Dermatology)",
    experience: 9,
    rating: 4.8,
    reviews: 411,
    fee: 600,
    image: doc2,
    hospital: "Skinwell Clinic",
    location: "Mumbai",
    languages: ["English", "Hindi", "Marathi"],
    consultationTypes: ["video", "instant", "in-person"],
    nextSlot: "Today, 5:00 PM",
    online: true,
    bio: "Cosmetic & medical dermatologist. Acne, pigmentation, hair restoration.",
    about: "Dr. Marcus Cohen blends evidence-based dermatology with modern aesthetic care.",
    role: "DOCTOR",
    timings: [{ day: "Mon – Sat", hours: "11:00 AM – 8:00 PM" }]
  },
  {
    id: "zara-okafor",
    name: "Dr. Zara Okafor",
    specialty: "Pediatrics",
    qualifications: "MBBS, MD (Paediatrics)",
    experience: 7,
    rating: 4.95,
    reviews: 528,
    fee: 500,
    image: doc3,
    hospital: "Little Stars Children's Hospital",
    location: "Hyderabad",
    languages: ["English", "Telugu", "Hindi"],
    consultationTypes: ["video", "in-person", "follow-up"],
    nextSlot: "Tomorrow, 9:30 AM",
    online: false,
    bio: "Paediatrician & lactation expert. Newborn to teen care.",
    about: "Dr. Zara Okafor is loved by parents for her gentle approach and detailed consults.",
    role: "DOCTOR",
    timings: [{ day: "Mon – Fri", hours: "9:00 AM – 6:00 PM" }]
  }
];

export const patients = [
  { id: "P-1024", name: "Rahul Deshmukh", age: 28, gender: "Male", bloodGroup: "O+", email: "rahul@example.com", phone: "+91 98765 43210", lastVisit: "2 days ago", status: "Ready", role: "PATIENT" },
  { id: "P-1025", name: "Ananya Iyer", age: 24, gender: "Female", bloodGroup: "B-", email: "ananya@example.com", phone: "+91 88765 43211", lastVisit: "5 days ago", status: "Waiting", role: "PATIENT" },
  { id: "P-1026", name: "Suresh Kumar", age: 45, gender: "Male", bloodGroup: "A+", email: "suresh@example.com", phone: "+91 78765 43212", lastVisit: "1 week ago", status: "Lab", role: "PATIENT" }
];

export const hospitals = [
  { id: "h1", name: "City General Hospital", location: "Bengaluru", type: "Multi-specialty", status: "Active" },
  { id: "h2", name: "Metro Heart Institute", location: "Delhi", type: "Cardiology", status: "Active" },
  { id: "h3", name: "Sunrise Children's Clinic", location: "Mumbai", type: "Pediatrics", status: "Active" }
];

export const tasks = [
  { title: "Review Lab Reports", patient: "Rahul Deshmukh", priority: "High", due: "10:00 AM", status: "pending" },
  { title: "Evening Rounds", patient: "Ward A - Cardiology", priority: "Medium", due: "04:30 PM", status: "pending" },
  { title: "Submit Monthly Audit", patient: "Administration", priority: "Low", due: "06:00 PM", status: "completed" }
];

export const medicationHistory = [
  { name: "Amoxicillin", dosage: "500mg", timing: "Twice daily", status: "Completed" },
  { name: "Paracetamol", dosage: "650mg", timing: "As needed", status: "Active" },
  { name: "Cetirizine", dosage: "10mg", timing: "Nightly", status: "Active" }
];

export const schedules = [
  { day: "Monday", time: "09:00 AM - 05:00 PM", status: "Active" },
  { day: "Tuesday", time: "09:00 AM - 05:00 PM", status: "Active" },
  { day: "Wednesday", time: "09:00 AM - 12:00 PM", status: "Half Day" },
  { day: "Thursday", time: "09:00 AM - 05:00 PM", status: "Active" },
  { day: "Friday", time: "09:00 AM - 05:00 PM", status: "Active" }
];

export const specialties = [
  { name: "Cardiology", icon: "heart-pulse", count: 124 },
  { name: "Dermatology", icon: "sparkles", count: 86 },
  { name: "Pediatrics", icon: "baby", count: 152 },
  { name: "Neurology", icon: "brain", count: 64 },
  { name: "Orthopedics", icon: "bone", count: 91 },
  { name: "Gynecology", icon: "flower", count: 73 },
  { name: "Dentistry", icon: "smile", count: 110 },
  { name: "Psychiatry", icon: "cloud-sun", count: 58 },
];
