import type {
  User,
  University,
  Program,
  Scholarship,
  Application,
  BlogPost,
  ContactInquiry
} from "@shared/schema";

export type {
  User,
  University,
  Program,
  Scholarship,
  Application,
  BlogPost,
  ContactInquiry
};

export interface DashboardStats {
  totalStudents: number;
  totalUniversities: number;
  totalScholarships: number;
  totalApplications: number;
  recentApplications: Application[];
}

export interface UniversityFilters {
  country?: string;
  ranking?: string;
  tuition?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ScholarshipFilters {
  type?: string;
  level?: string;
  countries?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApplicationFilters {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface BlogFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
