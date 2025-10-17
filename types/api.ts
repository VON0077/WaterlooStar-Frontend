// Generic API response/request types - HOW data is returned from APIs

/**
 * Standard pagination parameters (for requests)
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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
  data: T;
}

/**
 * API error response
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>; // Field-specific errors
    statusCode: number;
  };
}

/**
 * API success response (for operations without data)
 * E.g., delete, update confirmation
 */
export interface ApiSuccess {
  success: boolean;
  message?: string;
}

/**
 * Search/filter parameters (generic)
 */
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, string | number | boolean>;
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
