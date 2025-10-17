// User domain types - what a User IS

/**
 * Base user information (minimal)
 * Used when showing user in lists, author info, etc.
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
}

export interface UserStats {
  postsCount: number;
  likesReceived: number;
  followers: number;
  following: number;
  starPoints: number;
  memberSince: Date;
}

/**
 * Full user profile (extended)
 * Used when viewing user's profile page
 */
export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;

  // Statistics
  stats: UserStats;

  // Preferences
  // TODO: Add fields here
}

/**
 * User authentication data
 * Used during login/registration
 */
export interface UserAuth {
  id: string;
  username: string;
  email: string;
}

/**
 * User for post author (minimal, embedded in posts)
 */
export interface PostAuthor {
  id: string;
  username: string;
  avatar?: string;
  level: number;
}

/**
 * User registration data (input)
 */
export interface UserRegistrationInput {
  username: string;
  email: string;
  password: string;
}

/**
 * User update data (input)
 */
export interface UserUpdateInput {
  // TODO: Add fields here
}
