import {
  Code,
  Cloud,
  Server,
  Database,
  Shield,
  Terminal,
  Bot,
  Users,
  Briefcase,
  Award,
  Globe,
} from "lucide-react";

export const techCareers = [
  // For Candidates
  {
    name: "Technical Interview Simulations",
    icon: Terminal,
    category: "Candidates",
  },
  {
    name: "Personalized Skill Assessments",
    icon: Code,
    category: "Candidates",
  },
  {
    name: "Career Path Recommendations",
    icon: Briefcase,
    category: "Candidates",
  },
  {
    name: "Professional Resume Optimization",
    icon: Award,
    category: "Candidates",
  },

  // For Freelancers
  { name: "Project-Based Learning", icon: Server, category: "Freelancers" },
  { name: "Client Communication Tools", icon: Users, category: "Freelancers" },
  { name: "Portfolio Builder", icon: Cloud, category: "Freelancers" },
  { name: "Freelance Marketplace", icon: Globe, category: "Freelancers" },

  // For HR Teams
  { name: "Pre-Vetted Candidate Pool", icon: Users, category: "HR Teams" },
  { name: "Skill-Based Matching", icon: Database, category: "HR Teams" },
  { name: "Diversity Analytics", icon: Shield, category: "HR Teams" },
  { name: "Interview Templates", icon: Terminal, category: "HR Teams" },

  // General Tech Roles (Optional)
  { name: "DevOps Engineer", icon: Cloud, category: "Infrastructure" },
  { name: "Full Stack Developer", icon: Code, category: "Development" },
  { name: "Cloud Architect", icon: Server, category: "Cloud" },
  { name: "AI Engineer", icon: Bot, category: "AI/ML" },
  { name: "Cybersecurity Specialist", icon: Shield, category: "Security" },
  { name: "Data Engineer", icon: Database, category: "Data" },
];
