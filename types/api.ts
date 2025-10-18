// Generic API response/request types - HOW data is returned from APIs

/**
 * Standard pagination parameters (for requests)
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Standard pagination metadata (in responses)
 */
export interface PaginationMeta {
  // TODO : Needs discussion on the fields
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic paginated API response
 * Usage: ApiResponse<User[]> or ApiResponse<Post[]>
 */
export interface PaginatedResponse<T> {
  code: number;
  success: boolean;
  message?: string;
  meta: PaginationMeta;
  data: T[];
}

/**
 * Generic single item API response
 * Usage: ApiResponse<User> or ApiResponse<Post>
 */
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message?: string;
  meta?: Record<string, any>;
  data?: T;
}

/**
 * API error response
 */
export interface ApiStatusResponse {
  code: number;
  success: boolean;
  message?: string;
}

export interface FilterParams {
  field: string;
  operator: "eq" | "ne" | "lt" | "lte" | "gt" | "gte" | "btw";
  value: string | number | boolean | [string, string] | [string, string];
}
/**
 * Search/filter parameters (generic)
 */
export interface SearchParams extends PaginationParams {
  filters?: FilterParams[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * File upload response
 */
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}
