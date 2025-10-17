// Mock data for users - matches types from @/types/users

import { User, UserProfile, PostAuthor, UserStats } from "@/types";

/**
 * Mock user statistics
 */
export const mockUserStats: UserStats = {
  postsCount: 42,
  likesReceived: 150,
  followers: 89,
  following: 67,
  starPoints: 1250,
  memberSince: new Date("2024-01-15"),
};

/**
 * Mock basic users (for lists, author info, etc.)
 */
export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "john_doe",
    email: "john@uwaterloo.ca",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: 5,
  },
  {
    id: "user-2",
    username: "jane_smith",
    email: "jane@uwaterloo.ca",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: 3,
  },
  {
    id: "user-3",
    username: "alex_chen",
    email: "alex@uwaterloo.ca",
    avatar: "https://i.pravatar.cc/150?img=3",
    level: 7,
  },
  {
    id: "user-4",
    username: "sarah_wilson",
    email: "sarah@uwaterloo.ca",
    avatar: "https://i.pravatar.cc/150?img=4",
    level: 4,
  },
  {
    id: "user-5",
    username: "mike_brown",
    email: "mike@uwaterloo.ca",
    avatar: "https://i.pravatar.cc/150?img=5",
    level: 6,
  },
];

/**
 * Mock user profiles (for profile pages)
 */
export const mockUserProfiles: UserProfile[] = [
  {
    id: "user-1",
    username: "john_doe",
    email: "john@uwaterloo.ca",
    avatar: "https://i.pravatar.cc/150?img=1",
    level: 5,
    bio: "Computer Science student at UWaterloo. Looking for housing near campus.",
    location: "Waterloo, ON",
    website: "https://johndoe.dev",
    phone: "+1 (519) 555-0123",
    stats: {
      postsCount: 42,
      likesReceived: 150,
      followers: 89,
      following: 67,
      starPoints: 1250,
      memberSince: new Date("2024-01-15"),
    },
  },
  {
    id: "user-2",
    username: "jane_smith",
    email: "jane@uwaterloo.ca",
    avatar: "https://i.pravatar.cc/150?img=2",
    level: 3,
    bio: "Engineering student. Pet-friendly housing preferred!",
    location: "Waterloo, ON",
    stats: {
      postsCount: 18,
      likesReceived: 65,
      followers: 34,
      following: 45,
      starPoints: 680,
      memberSince: new Date("2024-03-20"),
    },
  },
];

/**
 * Mock post authors (minimal user info for posts)
 */
export const mockPostAuthors: PostAuthor[] = mockUsers.map((user) => ({
  id: user.id,
  username: user.username,
  avatar: user.avatar,
  level: user.level,
}));

/**
 * Helper: Get a single mock user by ID
 */
export function getMockUser(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

/**
 * Helper: Get a single mock user profile by ID
 */
export function getMockUserProfile(id: string): UserProfile | undefined {
  return mockUserProfiles.find((user) => user.id === id);
}

/**
 * Helper: Get a mock post author by ID
 */
export function getMockPostAuthor(id: string): PostAuthor | undefined {
  return mockPostAuthors.find((author) => author.id === id);
}

/**
 * Helper: Generate random user
 */
export function generateRandomUser(overrides?: Partial<User>): User {
  const id = `user-${Date.now()}`;
  return {
    id,
    username: `user_${Math.random().toString(36).substring(7)}`,
    email: `user${id}@uwaterloo.ca`,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    level: Math.floor(Math.random() * 10) + 1,
    ...overrides,
  };
}
