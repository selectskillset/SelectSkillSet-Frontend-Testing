export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'interviewer' | 'corporate';
  avatar?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  interviewerId: string;
  dateTime: string;
  status: 'pending' | 'confirmed' | 'completed';
  meetLink?: string;
  topic: string;
}

export interface Interviewer {
  id: string;
  name: string;
  experience: number;
  totalInterviews: number;
  pricing: number;
  expertise: string[];
  availability: string[];
  rating: number;
}