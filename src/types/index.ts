// ─────────────────────────────────────────────
// Shared TypeScript types for CollegeHunt
// ─────────────────────────────────────────────

export type Role = "STUDENT" | "ADMIN";
export type CollegeType = "GOVERNMENT" | "PRIVATE" | "DEEMED" | "AUTONOMOUS";
export type ChanceLabel = "Safe" | "Good" | "Ambitious" | "Low";
export type ExamType = "JEE Main" | "JEE Advanced" | "NEET" | "CAT" | "XAT" | "GATE" | "CMAT" | "MAT";
export type Category = "General" | "OBC" | "SC" | "ST" | "EWS" | "PwD";

// ─── User ─────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  phone?: string | null;
  createdAt: string;
}

// ─── College (list card) ─────────────────────
export interface CollegeCard {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: CollegeType;
  ranking?: number | null;
  nirf?: number | null;
  annualFees?: number | null;
  accreditation?: string | null;
  logo?: string | null;
  image?: string | null;
  images?: string[];
  isVerified: boolean;
  approvedBy: string[];
  avgRating?: number | null;
  _count: {
    reviews: number;
    courses: number;
  };
}

// ─── College (full detail) ───────────────────
export interface CollegeDetail extends CollegeCard {
  description?: string | null;
  location: string;
  maxFees?: number | null;
  establishedYear?: number | null;
  website?: string | null;
  images: string[];
  totalStudents?: number | null;
  totalFaculty?: number | null;
  campusArea?: number | null;
  courses: Course[];
  placements: Placement[];
  reviews: Review[];
  cutoffs: CollegeCutoff[];
  questions: Question[];
  updatedAt: string;
}

// ─── Course ───────────────────────────────────
export interface Course {
  id: string;
  name: string;
  degree: string;
  duration: number;
  seats?: number | null;
  fees?: number | null;
  eligibility?: string | null;
  mode?: string | null;
  collegeId: string;
}

// ─── Placement ────────────────────────────────
export interface Placement {
  id: string;
  year: number;
  avgPackage?: number | null;
  highestPackage?: number | null;
  medianPackage?: number | null;
  placementRate?: number | null;
  totalPlaced?: number | null;
  topRecruiters: string[];
  collegeId: string;
}

// ─── Review ───────────────────────────────────
export interface Review {
  id: string;
  rating: number;
  academics?: number | null;
  infrastructure?: number | null;
  faculty?: number | null;
  placement?: number | null;
  hostel?: number | null;
  title: string;
  content: string;
  pros?: string | null;
  cons?: string | null;
  batch?: number | null;
  program?: string | null;
  verified: boolean;
  helpfulCount: number;
  user: Pick<User, "id" | "name" | "avatar">;
  collegeId: string;
  createdAt: string;
}

// ─── CollegeCutoff ────────────────────────────
export interface CollegeCutoff {
  id: string;
  exam: ExamType;
  category: Category;
  cutoffScore?: number | null;
  cutoffRank?: number | null;
  cutoffPercentile?: number | null;
  round?: string | null;
  year: number;
  collegeId: string;
  courseId?: string | null;
}

// ─── Question / Answer ────────────────────────
export interface Question {
  id: string;
  title: string;
  content: string;
  user: Pick<User, "id" | "name" | "avatar">;
  college?: Pick<CollegeCard, "id" | "name" | "slug"> | null;
  answers?: Answer[];
  _count?: { answers: number };
  createdAt: string;
}

export interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  helpfulCount: number;
  user: Pick<User, "id" | "name" | "avatar">;
  questionId: string;
  createdAt: string;
}

// ─── Saved ────────────────────────────────────
export interface SavedCollege {
  id: string;
  college: CollegeCard;
  createdAt: string;
}

export interface SavedComparison {
  id: string;
  name?: string | null;
  collegeIds: string[];
  createdAt: string;
}

// ─── Predictor ────────────────────────────────
export interface PredictorResult {
  chance: ChanceLabel;
  college: CollegeCard;
  course?: Pick<Course, "id" | "name" | "degree"> | null;
  cutoffRank?: number | null;
  cutoffScore?: number | null;
  cutoffPercentile?: number | null;
  category: Category;
  year: number;
}

// ─── API Response wrappers ────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

// ─── Filter state ─────────────────────────────
export interface CollegeFilters {
  search?: string;
  state?: string;
  city?: string;
  type?: CollegeType;
  accreditation?: string;
  minFees?: number;
  maxFees?: number;
  minRanking?: number;
  maxRanking?: number;
  approvedBy?: string;
  page?: number;
  limit?: number;
  sortBy?: "ranking" | "nirf" | "annualFees" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}
