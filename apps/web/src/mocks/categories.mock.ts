import type { JobCategory } from "../types";

export const categoriesData: JobCategory[] = [
  {
    id: "cat_eng",
    name: "Engineering",
    icon: "Code2",
    jobCount: 1240,
    description: "Software, DevOps & Cloud",
  },
  {
    id: "cat_des",
    name: "Design",
    icon: "Palette",
    jobCount: 840,
    description: "UI/UX, Visual & Brand",
  },
  {
    id: "cat_prod",
    name: "Product",
    icon: "Layers",
    jobCount: 620,
    description: "Management & Strategy",
  },
  {
    id: "cat_mark",
    name: "Marketing",
    icon: "Megaphone",
    jobCount: 450,
    description: "Growth, Content & Brand",
  },
  {
    id: "cat_sales",
    name: "Sales",
    icon: "TrendingUp",
    jobCount: 510,
    description: "Account Execs & BDRs",
  },
  {
    id: "cat_ops",
    name: "Operations",
    icon: "Settings2",
    jobCount: 380,
    description: "People, Support & IT",
  },
];
