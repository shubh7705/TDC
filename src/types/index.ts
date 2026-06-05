export type UserRole = 'matchmaker' | 'admin';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  name?: string;
  createdAt?: string;
}

export type CustomerStatus = 
  | 'Profile Review'
  | 'Verified'
  | 'Needs Match'
  | 'Match Sent'
  | 'Feedback Pending'
  | 'Meeting Scheduled'
  | 'Successful Match'
  | 'Closed';

export interface Customer {
  id: string;
  matchmakerId: string;
  
  // Personal
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  age: number;
  country: string;
  city: string;
  height: number; // in cm
  weight: number; // in kg

  // Contact
  email: string;
  phone: string;

  // Education
  undergraduateCollege: string;
  degree: string;
  postgraduateDegree?: string;

  // Professional
  currentCompany: string;
  designation: string;
  income: number; // yearly in INR
  industry: string;

  // Family
  siblings: number;
  familyType: 'Nuclear' | 'Joint' | 'Other';
  familyValues: 'Orthodox' | 'Traditional' | 'Moderate' | 'Liberal';

  // Cultural
  religion: string;
  caste?: string;
  motherTongue: string;
  languagesKnown: string[];
  manglik: 'Yes' | 'No' | 'Anshik' | 'Not Applicable';

  // Lifestyle
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan';
  smoking: 'No' | 'Occasionally' | 'Yes';
  drinking: 'No' | 'Occasionally' | 'Yes';
  hobbies: string[];
  fitnessLevel: 'Sedentary' | 'Active' | 'Very Active';

  // Preferences
  wantKids: 'Yes' | 'No' | 'Maybe';
  openToRelocate: boolean;
  openToPets: boolean;

  // Partner Preferences
  partnerAgeRange: [number, number]; // [min, max]
  partnerHeightRange: [number, number]; // [min, max]
  partnerCities: string[];
  partnerReligion: string[];
  partnerEducation: string[];

  // Meta
  status: CustomerStatus;
  matchCount: number;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchScoreBreakdown {
  age: number;
  children: number;
  height: number;
  income: number;
  religion: number;
  language: number;
  education: number;
  lifestyle: number;
  values: number;
  career: number;
  relocation: number;
}

export interface MatchExplanation {
  overallScore: number;
  compatibilityFactors: MatchScoreBreakdown;
  strengths: string[];
  concerns: string[];
  summary: string; // AI generated summary
}

export interface Match {
  id: string; // Customer ID of the match
  score: number;
  breakdown: MatchScoreBreakdown;
  explanation?: MatchExplanation;
  generatedAt: string;
}

export type MatchActionStatus = 'Sent' | 'Viewed' | 'Accepted' | 'Rejected' | 'Expired';

export interface MatchAction {
  id: string;
  customerId: string;
  matchId: string;
  score: number;
  sentAt: string;
  status: MatchActionStatus;
  introduction?: string;
}

export interface Note {
  id: string;
  customerId: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface Activity {
  id: string;
  customerId: string;
  matchmakerId: string;
  type: 'NoteAdded' | 'StatusChanged' | 'MatchSent' | 'MeetingScheduled';
  description: string;
  timestamp: string;
}
