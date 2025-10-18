import { PostAuthor } from "./users";

// Post status enum
export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

// Post category enum
export enum PostCategory {
  HOUSING_REQUEST = "housing-request",
  SUBLET = "sublet",
}

export enum Amenity {
  PARKING = "parking",
  IN_UNIT_LAUNDRY = "in-unit-laundry",
  DISHWASHER = "dishwasher",
  GYM = "gym",
  GARAGE = "garage",
  ELEVATOR = "elevator",
  BALCONY = "balcony",
  PRIVATE_BATHROOM = "private-bathroom",
  TV = "tv",
}

export enum Utility {
  WIFI = "wifi",
  WATER = "water",
  ELECTRICITY = "electricity",
  TV = "tv",
}

export interface LeaseTerm {
  startDate: Date;
  endDate: Date;
}

// ============================================
// API Response Types (What backend returns)
// ============================================

/**
 * Base post interface - returned from API
 * Contains all fields including server-generated ones
 */
export interface BasePost {
  // Server-generated fields
  id: string;
  createdAt: Date;
  updatedAt: Date;
  author: PostAuthor;
  stats: {
    views: number;
    likes: number;
    stars: number;
    replies: number;
  };

  // User-provided fields
  title: string;
  content: string;
  category: PostCategory;
  status: PostStatus;
  images?: string[];
}

/**
 * Housing Request post (from API)
 */
export interface HousingRequestPost extends BasePost {
  category: PostCategory.HOUSING_REQUEST;

  // leaseTerm?: LeaseTerm;
  // maxBudget?: number;
  // minBudget?: number;
  // preferredRoomSize?: number;
  // Amenities preferences
  // preferredAmenities?: Amenity[];

  // Policies
  // petFriendly?: boolean;

  // Utilities
  // preferredUtilities?: Utility[];
}

export interface SubletPost extends BasePost {
  category: PostCategory.SUBLET;
}
/**
 * Data required to CREATE a new post
 * Does NOT include server-generated fields (id, dates, stats, author)
 */
export interface CreatePostInput {
  title: string;
  content: string;
  category: PostCategory;
  images?: string[];
}

/**
 * Data to UPDATE an existing post
 * All fields are optional (partial update)
 */
export interface UpdatePostInput {
  title?: string;
  content?: string;
  status?: PostStatus;
  images?: string[];
  // Note: category usually can't be changed after creation
}

/**
 * Create housing request post
 */
export interface CreateHousingRequestInput extends CreatePostInput {
  category: PostCategory.HOUSING_REQUEST;
  // Future fields:
  // leaseTerm?: LeaseTerm;
  // maxBudget?: number;
  // minBudget?: number;
}

/**
 * Create sublet post
 */
export interface CreateSubletInput extends CreatePostInput {
  category: PostCategory.SUBLET;
  // Future fields:
  // bedrooms?: number;
  // bathrooms?: number;
  // leaseTerm?: LeaseTerm;
}

// ============================================
// Helper Type: Post without server fields
// ============================================

/**
 * Utility type: Post data without server-generated fields
 * Useful for forms and drafts
 */
export type PostFormData = Omit<
  BasePost,
  "id" | "createdAt" | "updatedAt" | "author" | "stats"
>;
