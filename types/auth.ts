import type { UserAuth } from "./users";

export interface LoginInput {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: UserAuth;
}
