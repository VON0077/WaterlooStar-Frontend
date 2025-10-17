// Server Actions - Wrapper around API calls with Next.js features
// Use these when you need: form handling, cookies, revalidation, or hiding API keys

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PostCategory, PostStatus } from "@/types";

const API_BASE_URL = process.env.API_URL || "http://localhost:3001"; // Server-side env var (not exposed to client)

/**
 * Get auth token from cookies (server-side only)
 * This keeps the token secure and not exposed to client
 */
async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("auth-token")?.value;
}

// ============================================
// Server Actions - Form Submissions
// ============================================

/**
 * Create post from form submission
 * Benefits:
 * - Automatic form handling (no need for onSubmit)
 * - Auth token from cookies (not exposed to client)
 * - Automatic revalidation
 * - Type-safe form data
 *
 * Usage in component:
 * <form action={createPostAction}>
 *   <input name="title" />
 *   <textarea name="content" />
 *   <button type="submit">Create</button>
 * </form>
 */
export async function createPostAction(formData: FormData) {
  // Get data from form
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as PostCategory;

  // Validate
  if (!title || !content || !category) {
    return { error: "All fields are required" };
  }

  // Get auth token from cookies (secure, server-side only)
  const authToken = await getAuthToken();
  if (!authToken) {
    redirect("/login");
  }

  try {
    // Call external backend
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title,
        content,
        category,
        status: PostStatus.PUBLISHED,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || "Failed to create post" };
    }

    const post = await response.json();

    // Revalidate the feed page to show new post
    revalidatePath(`/${category}/feed`);

    // Redirect to the new post
    redirect(`/${category}/${post.id}`);
  } catch (error) {
    console.error("Create post error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Delete post action
 * Benefits:
 * - Auth token from cookies
 * - Automatic revalidation
 * - Can be called from form or button
 */
export async function deletePostAction(postId: string, category: PostCategory) {
  const authToken = await getAuthToken();
  if (!authToken) {
    return { error: "Unauthorized" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      return { error: "Failed to delete post" };
    }

    // Revalidate relevant pages
    revalidatePath(`/${category}/feed`);
    revalidatePath(`/${category}/${postId}`);

    return { success: true };
  } catch (error) {
    console.error("Delete post error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Like post action (alternative to API function)
 * Use this if you want to hide the auth token from client
 */
export async function likePostAction(postId: string) {
  const authToken = await getAuthToken();
  if (!authToken) {
    return { error: "Unauthorized" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      return { error: "Failed to like post" };
    }

    // Revalidate to show updated like count
    revalidatePath(`/posts/${postId}`);

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
