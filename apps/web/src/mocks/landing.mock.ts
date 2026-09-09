export interface HeroMetric {
  value: string;
  label: string;
  iconName: "Briefcase" | "Users" | "TrendingUp";
}

export interface CareerMilestone {
  step: number;
  title: string;
  status: "completed" | "current" | "upcoming";
}

export const mockHeroMetrics: HeroMetric[] = [
  {
    value: "10,000+",
    label: "Active Jobs",
    iconName: "Briefcase",
  },
  {
    value: "5,000+",
    label: "Companies",
    iconName: "Users",
  },
  {
    value: "50,000+",
    label: "Candidates Placed",
    iconName: "TrendingUp",
  },
];

export const mockPopularSearches: string[] = [
  "React Developer",
  "Product Designer",
  "Data Scientist",
  "DevOps",
];

export const mockWhyChoosePoints: string[] = [
  "Curated job listings from top companies",
  "AI-matched recommendations",
  "One-click apply with saved profile",
  "Real-time application status tracking",
  "Expert career resources and guides",
  "Free to use for candidates",
];

export const mockCareerMilestones: CareerMilestone[] = [
  { step: 1, title: "Resume uploaded", status: "completed" },
  { step: 2, title: "Profile reviewed", status: "completed" },
  { step: 3, title: "Interview scheduled", status: "completed" },
  { step: 4, title: "Offer received", status: "completed" },
];
