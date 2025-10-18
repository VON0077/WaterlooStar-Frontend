import {
  ApiResponse,
  ApiStatusResponse,
  SearchParams,
  PaginationParams,
  PaginatedResponse,
  BasePost,
  PostCategory,
  CreatePostInput,
  UpdatePostInput,
} from "@/types";

const API_BASE_URL = process.env.API_URL;
const USE_MOCKS = process.env.USE_MOCKS === "true";

/**
 * Get posts by category with filters and pagination
 */
export async function getPosts(
  category: PostCategory,
  search?: SearchParams,
  pagination?: PaginationParams
): Promise<PaginatedResponse<BasePost>> {
  // Use mocks if enabled
  if (USE_MOCKS) {
    const {
      getMockPostsByCategory,
      createMockPaginatedResponse,
      simulateApiCall,
    } = await import("@/mocks");

    const mockData = getMockPostsByCategory(category);
    const response = createMockPaginatedResponse(
      mockData,
      pagination?.page || 1,
      pagination?.pageSize || 10
    );

    // Simulate network delay
    return simulateApiCall(response, 500, 1000);
  }

  // Build query parameters
  const params = new URLSearchParams();
  params.append("category", category);

  // Add pagination
  if (pagination?.page) params.append("page", pagination.page.toString());
  if (pagination?.pageSize)
    params.append("pageSize", pagination.pageSize.toString());
  if (search?.sortBy) params.append("sortBy", search.sortBy);
  if (search?.sortOrder) params.append("sortOrder", search.sortOrder);

  // Add filters
  if (search?.filters && search.filters.length > 0) {
    params.append("filters", JSON.stringify(search.filters));
  }

  // Make API request
  const response = await fetch(`${API_BASE_URL}/posts?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  // Handle errors
  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new Error(errorData.message || "Failed to fetch posts");
  }

  return response.json();
}

/**
 * Get single post by ID
 */
export async function getPostById(id: string): Promise<ApiResponse<BasePost>> {
  if (USE_MOCKS) {
    const {
      getMockPost,
      createMockApiResponse,
      simulateApiCall,
      mockApiErrors,
    } = await import("@/mocks");
    const post = getMockPost(id);

    if (!post) {
      throw mockApiErrors.notFound;
    }

    const response = createMockApiResponse(post);
    return simulateApiCall(response, 500, 1000);
  }

  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new Error(errorData.message || "Failed to fetch post");
  }

  return response.json();
}

/**
 * Create new post (requires authentication)
 * @param data - Post data WITHOUT server-generated fields (id, dates, stats, author)
 */
export async function createPost(
  data: CreatePostInput,
  authToken: string
): Promise<ApiResponse<BasePost>> {
  if (USE_MOCKS) {
    const { generateRandomPost, createMockApiResponse, simulateApiCall } =
      await import("@/mocks");
    const newPost = generateRandomPost(data.category, data);
    const response = createMockApiResponse(newPost);
    return simulateApiCall(response, 500, 1000);
  }

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new Error(errorData.message || "Failed to create post");
  }

  return response.json();
}

/**
 * Update existing post
 * @param data - Partial post data (only fields to update)
 */
export async function updatePost(
  id: string,
  data: UpdatePostInput,
  authToken: string
): Promise<ApiResponse<BasePost>> {
  if (USE_MOCKS) {
    const {
      getMockPost,
      createMockApiResponse,
      simulateApiCall,
      mockApiErrors,
    } = await import("@/mocks");

    const existingPost = getMockPost(id);
    if (!existingPost) {
      throw mockApiErrors.notFound;
    }

    const updatedPost = { ...existingPost, ...data, updatedAt: new Date() };
    const response = createMockApiResponse(updatedPost);
    return simulateApiCall(response, 500, 1000);
  }

  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new Error(errorData.message || "Failed to update post");
  }

  return response.json();
}

/**
 * Delete post
 */
export async function deletePost(
  id: string,
  authToken: string
): Promise<ApiStatusResponse> {
  if (USE_MOCKS) {
    const { createMockStatusResponse, simulateApiCall } = await import(
      "@/mocks"
    );
    const response = createMockStatusResponse("Post deleted successfully");
    return simulateApiCall(response, 300, 700);
  }

  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorData: ApiResponse<never> = await response.json();
    throw new Error(errorData.message || "Failed to delete post");
  }

  return response.json();
}
