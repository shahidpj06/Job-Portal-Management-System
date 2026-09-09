import type { User } from "../types";

export const mockCandidate: User = {
  id: "user_1",
  email: "candidate@example.com",
  firstName: "Jane",
  lastName: "Doe",
  role: "CANDIDATE",
  headline: "Senior Frontend Engineer",
  location: "San Francisco, CA",
  phone: "+1 555-0199",
  bio: "Passionate about building accessible, performant, and beautiful web interfaces. Experienced with React, TypeScript, and modern CSS.",
  skills: ["React", "TypeScript", "Tailwind CSS", "Figma", "Node.js"],
  joinedAt: "2025-01-15T08:00:00Z",
};

export const mockAdmin: User = {
  id: "admin_1",
  email: "admin@jobnest.com",
  firstName: "Alex",
  lastName: "Manager",
  role: "ADMIN",
  headline: "Talent Acquisition Lead",
  location: "New York, NY",
  joinedAt: "2024-10-01T09:00:00Z",
};

export const mockUsers = [mockCandidate, mockAdmin];
