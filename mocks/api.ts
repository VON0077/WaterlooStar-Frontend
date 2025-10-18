// Mock API responses - matches types from @/types/api

import {
  ApiResponse,
  ApiStatusResponse,
  PaginatedResponse,
  PaginationMeta,
} from "@/types";

/**
 * Helper: Create mock ApiResponse wrapper
 */
export function createMockApiResponse<T>(data: T): ApiResponse<T> {
  return {
    code: 200,
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: `req-${Date.now()}`,
    },
  };
}

/**
 * Helper: Create mock error response
 */
export function createMockErrorResponse(
  code: number,
  message: string
): ApiResponse<never> {
  return {
    code,
    success: false,
    message,
  };
}

/**
 * Helper: Create mock PaginatedResponse wrapper
 */
export function createMockPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10,
  totalCount?: number
): PaginatedResponse<T> {
  const total = totalCount ?? data.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const pagination: PaginationMeta = {
    page,
    pageSize,
    totalPages,
    totalCount: total,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return {
    code: 200,
    success: true,
    meta: pagination,
    data: paginatedData,
  };
}

/**
 * Helper: Create mock ApiStatusResponse
 */
export function createMockStatusResponse(
  message: string = "Operation completed successfully"
): ApiStatusResponse {
  return {
    code: 200,
    success: true,
    message,
  };
}

/**
 * Mock API error responses
 */
export const mockApiErrors = {
  unauthorized: {
    code: 401,
    success: false,
    message: "You must be logged in to perform this action",
  } as ApiResponse<never>,

  forbidden: {
    code: 403,
    success: false,
    message: "You don't have permission to access this resource",
  } as ApiResponse<never>,

  notFound: {
    code: 404,
    success: false,
    message: "The requested resource was not found",
  } as ApiResponse<never>,

  validationError: {
    code: 400,
    success: false,
    message: "Invalid input data. Please check your fields and try again.",
  } as ApiResponse<never>,

  serverError: {
    code: 500,
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  } as ApiResponse<never>,

  rateLimitExceeded: {
    code: 429,
    success: false,
    message: "Too many requests. Please try again later.",
  } as ApiResponse<never>,
};

/**
 * Helper: Simulate API delay (for testing loading states)
 */
export function delay(ms: number = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Helper: Simulate API call with random delay
 */
export async function simulateApiCall<T>(
  data: T,
  minDelay: number = 500,
  maxDelay: number = 1500
): Promise<T> {
  const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay;
  await delay(randomDelay);
  return data;
}

/**
 * Helper: Simulate API call that might fail
 */
export async function simulateApiCallWithError<T>(
  data: T,
  errorRate: number = 0.1 // 10% chance of error
): Promise<T> {
  await delay(800);

  if (Math.random() < errorRate) {
    throw createMockErrorResponse(500, "Simulated API error");
  }

  return data;
}
