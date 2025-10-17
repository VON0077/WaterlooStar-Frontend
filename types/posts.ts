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

// Base post interface - common fields for all post types
export interface BasePost {
  // Identification
  id: string;

  // Content
  title: string;
  content: string; // Full detailed content/body
  author: PostAuthor; // Reference to PostAuthor type from users.ts
  images?: string[]; // Array of image URLs

  stats: {
    views: number;
    likes: number;
    stars: number;
    replies: number;
  };
  // Categorization
  category: PostCategory;

  // Dates
  createdAt: Date;
  updatedAt: Date;

  // Status
  status: PostStatus;
}

// Housing Request specific interface
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

  // Household & Poster Info
  // numberOfRoommates?: number;
  // posterGender?: "male" | "female" | "other";

  // Location
  // location: {
  //   address?: string;
  //   city: string;
  //   province: string;
  //   postalCode?: string;
  //   country: string;
  //   coordinates?: {
  //     lat: number;
  //     lng: number;
  //   };
  // };
}

// Sublet specific interface
export interface SubletPost extends BasePost {
  category: PostCategory.SUBLET;

  // Specific fields for sublets
  // bedrooms: number;
  // bathrooms: number;
  // roomSize?: number;
  // amenities?: Amenity[]; // e.g., ["parking", "laundry", "gym", "pool"]
  // petPolicy?: boolean;
  // utilities?: Utility[];
  // leaseTerm?: LeaseTerm;
  // genderPreference?: "male" | "female" | "other";
}
