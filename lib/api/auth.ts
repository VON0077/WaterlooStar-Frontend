import type { ApiResponse, AuthSession, LoginInput } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function login(input: LoginInput): Promise<AuthSession> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload: ApiResponse<AuthSession> = await response.json();

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to sign in");
  }

  return payload.data;
}

export async function getCurrentUser(
  token: string
): Promise<AuthSession["user"]> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload: ApiResponse<AuthSession["user"]> = await response.json();

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to load user");
  }

  return payload.data;
}
