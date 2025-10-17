// Mock data for posts - matches types from @/types/posts

import {
  BasePost,
  HousingRequestPost,
  SubletPost,
  PostStatus,
  PostCategory,
} from "@/types";
import { mockPostAuthors } from "./users";

/**
 * Mock housing request posts
 */
export const mockHousingRequestPosts: HousingRequestPost[] = [
  {
    id: "post-1",
    title: "Looking for 1BR near UWaterloo campus",
    content:
      "Hi! I'm a grad student looking for a 1-bedroom apartment near UWaterloo campus for Fall 2024. Budget is $1200-1500/month. Prefer a quiet area with good internet. Non-smoker, no pets. Please let me know if you have anything available!",
    author: mockPostAuthors[0],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    stats: {
      views: 245,
      likes: 12,
      stars: 8,
      replies: 5,
    },
    category: PostCategory.HOUSING_REQUEST,
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
    status: PostStatus.PUBLISHED,
  },
  {
    id: "post-2",
    title: "Roommate needed for 2BR apartment",
    content:
      "Looking for a roommate to share a 2BR apartment starting May 2024. Rent is $800/month per person, utilities included. Close to university, gym in building, parking available. Prefer someone clean and respectful.",
    author: mockPostAuthors[1],
    images: [],
    stats: {
      views: 189,
      likes: 8,
      stars: 4,
      replies: 12,
    },
    category: PostCategory.HOUSING_REQUEST,
    createdAt: new Date("2024-01-16T14:20:00Z"),
    updatedAt: new Date("2024-01-16T14:20:00Z"),
    status: PostStatus.PUBLISHED,
  },
  {
    id: "post-3",
    title: "Looking for pet-friendly housing",
    content:
      "Engineering student with a small dog looking for pet-friendly housing near campus. Budget up to $1400/month. Willing to pay pet deposit. Looking for May-August 2024 term.",
    author: mockPostAuthors[2],
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    stats: {
      views: 156,
      likes: 15,
      stars: 6,
      replies: 8,
    },
    category: PostCategory.HOUSING_REQUEST,
    createdAt: new Date("2024-01-17T09:15:00Z"),
    updatedAt: new Date("2024-01-17T09:15:00Z"),
    status: PostStatus.PUBLISHED,
  },
];

/**
 * Mock sublet posts
 */
export const mockSubletPosts: SubletPost[] = [
  {
    id: "post-4",
    title: "Sublet Available: 1BR near campus - May-Aug 2024",
    content:
      "Subletting my 1-bedroom apartment from May to August 2024. $1300/month, utilities included. 10-minute walk to campus, in-unit laundry, gym access, parking spot available. Fully furnished. Available for viewing!",
    author: mockPostAuthors[3],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    ],
    stats: {
      views: 342,
      likes: 28,
      stars: 15,
      replies: 18,
    },
    category: PostCategory.SUBLET,
    createdAt: new Date("2024-01-14T16:45:00Z"),
    updatedAt: new Date("2024-01-14T16:45:00Z"),
    status: PostStatus.PUBLISHED,
  },
  {
    id: "post-5",
    title: "Room available in 4BR house - $650/month",
    content:
      "One room available in a 4-bedroom house. $650/month + utilities (~$100). Great location, 15-min bus ride to campus. Shared kitchen and living room. Current roommates are all students. Looking for someone starting February 2024.",
    author: mockPostAuthors[4],
    images: ["https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800"],
    stats: {
      views: 278,
      likes: 19,
      stars: 11,
      replies: 22,
    },
    category: PostCategory.SUBLET,
    createdAt: new Date("2024-01-16T11:30:00Z"),
    updatedAt: new Date("2024-01-16T11:30:00Z"),
    status: PostStatus.PUBLISHED,
  },
  {
    id: "post-6",
    title: "Luxury 2BR Condo Sublet - Short Term Available",
    content:
      "Subletting my 2BR condo for the summer (May-August 2024). $1800/month. Brand new building with rooftop pool, gym, study rooms. Walking distance to campus. Fully furnished with modern appliances. Perfect for couples or friends.",
    author: mockPostAuthors[0],
    images: [
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800",
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
    ],
    stats: {
      views: 456,
      likes: 42,
      stars: 23,
      replies: 31,
    },
    category: PostCategory.SUBLET,
    createdAt: new Date("2024-01-13T08:00:00Z"),
    updatedAt: new Date("2024-01-13T08:00:00Z"),
    status: PostStatus.PUBLISHED,
  },
];

/**
 * All mock posts combined
 */
export const mockPosts: BasePost[] = [
  ...mockHousingRequestPosts,
  ...mockSubletPosts,
].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first

/**
 * Helper: Get posts by category
 */
export function getMockPostsByCategory(category: PostCategory): BasePost[] {
  return mockPosts.filter((post) => post.category === category);
}

/**
 * Helper: Get a single post by ID
 */
export function getMockPost(id: string): BasePost | undefined {
  return mockPosts.find((post) => post.id === id);
}

/**
 * Helper: Get posts by author
 */
export function getMockPostsByAuthor(authorId: string): BasePost[] {
  return mockPosts.filter((post) => post.author.id === authorId);
}

/**
 * Helper: Get recent posts
 */
export function getRecentMockPosts(limit: number = 5): BasePost[] {
  return mockPosts.slice(0, limit);
}

/**
 * Helper: Generate random post
 */
export function generateRandomPost(
  category: PostCategory,
  overrides?: Partial<BasePost>
): BasePost {
  const id = `post-${Date.now()}`;
  return {
    id,
    title: `Random ${category} post ${id}`,
    content: "This is a randomly generated post for testing purposes.",
    author: mockPostAuthors[Math.floor(Math.random() * mockPostAuthors.length)],
    images: [],
    stats: {
      views: Math.floor(Math.random() * 500),
      likes: Math.floor(Math.random() * 50),
      stars: Math.floor(Math.random() * 30),
      replies: Math.floor(Math.random() * 20),
    },
    category,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: PostStatus.PUBLISHED,
    ...overrides,
  } as BasePost;
}
