# Mock Data Directory

This directory contains mock data for development, testing, and prototyping when the backend is not available or you want to work offline.

## 📁 Structure

```
mocks/
├── index.ts       # Central export
├── users.ts       # Mock user data
├── posts.ts       # Mock post data
├── api.ts         # Mock API responses & helpers
└── README.md      # This file
```

---

## 🎯 When to Use Mock Data

### ✅ **Use Mocks For:**

1. **Development** - Work on UI without backend
2. **Prototyping** - Quickly test ideas and layouts
3. **Testing** - Unit and integration tests
4. **Demos** - Showcase features without real data
5. **Offline Development** - Work without internet
6. **Component Stories** - Storybook examples

### ❌ **Don't Use Mocks For:**

1. **Production** - Use real API calls
2. **End-to-End Tests** - Use staging/test backend
3. **Data Validation** - Use real backend for validation

---

## 📚 Usage Examples

### Example 1: Display Mock Posts in a Page

```typescript
// app/housing-request/feed/page.tsx
import { mockHousingRequestPosts, createMockPaginatedResponse } from "@/mocks";

export default function HousingRequestFeedPage() {
  // Simulate paginated API response
  const response = createMockPaginatedResponse(mockHousingRequestPosts, 1, 10);

  return (
    <div>
      <h1>Housing Requests ({response.meta.totalCount})</h1>

      {response.data.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>By: {post.author.username}</p>
          <p>{post.content}</p>
          <p>Views: {post.stats.views} | Likes: {post.stats.likes}</p>
        </div>
      ))}

      <p>
        Page {response.meta.page} of {response.meta.totalPages}
      </p>
    </div>
  );
}
```

---

### Example 2: Mock API Function (Development Mode)

```typescript
// lib/api/posts.ts
import { PaginatedResponse, BasePost, PostCategory } from "@/types";
import {
  getMockPostsByCategory,
  createMockPaginatedResponse,
  simulateApiCall,
} from "@/mocks";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export async function fetchPosts(
  category: PostCategory,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<BasePost>> {
  // Use mocks in development
  if (USE_MOCKS) {
    const mockData = getMockPostsByCategory(category);
    const response = createMockPaginatedResponse(mockData, page, pageSize);

    // Simulate network delay for realistic testing
    return simulateApiCall(response, 500, 1000);
  }

  // Real API call
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts?category=${category}&page=${page}&pageSize=${pageSize}`
  );

  return response.json();
}
```

**Add to `.env.local`:**

```env
NEXT_PUBLIC_USE_MOCKS=true  # Enable mocks
```

---

### Example 3: Mock User Profile

```typescript
// app/users/[id]/page.tsx
import { getMockUserProfile, createMockApiResponse } from "@/mocks";

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const user = getMockUserProfile(params.id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <img src={user.avatar} alt={user.username} />
      <h1>{user.username}</h1>
      <p>{user.bio}</p>
      <p>Level {user.level} | {user.stats.postsCount} posts</p>
      <p>Followers: {user.stats.followers} | Following: {user.stats.following}</p>
    </div>
  );
}
```

---

### Example 4: Testing with Mock Data

```typescript
// __tests__/components/PostCard.test.tsx
import { render, screen } from "@testing-library/react";
import PostCard from "@/components/posts/PostCard";
import { mockPosts } from "@/mocks";

describe("PostCard", () => {
  it("should render post information", () => {
    const post = mockPosts[0];

    render(<PostCard post={post} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(post.author.username)).toBeInTheDocument();
    expect(screen.getByText(`${post.stats.views} views`)).toBeInTheDocument();
  });

  it("should display post images", () => {
    const postWithImages = mockPosts.find((p) => p.images && p.images.length > 0)!;

    render(<PostCard post={postWithImages} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(postWithImages.images!.length + 1); // +1 for avatar
  });
});
```

---

### Example 5: Storybook Stories

```typescript
// components/posts/PostCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import PostCard from "./PostCard";
import { mockPosts, generateRandomPost } from "@/mocks";
import { PostCategory } from "@/types";

const meta: Meta<typeof PostCard> = {
  title: "Components/PostCard",
  component: PostCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const HousingRequest: Story = {
  args: {
    post: mockPosts[0], // Use first mock post
  },
};

export const Sublet: Story = {
  args: {
    post: mockPosts[3], // Use a sublet post
  },
};

export const WithMultipleImages: Story = {
  args: {
    post: mockPosts.find((p) => p.images && p.images.length > 2)!,
  },
};

export const NoImages: Story = {
  args: {
    post: mockPosts.find((p) => !p.images || p.images.length === 0)!,
  },
};

export const RandomPost: Story = {
  args: {
    post: generateRandomPost(PostCategory.HOUSING_REQUEST),
  },
};
```

---

### Example 6: Simulate API Errors

```typescript
// lib/api/users.ts
import { UserProfile, ApiResponse } from "@/types";
import {
  getMockUserProfile,
  createMockApiResponse,
  mockApiErrors,
} from "@/mocks";

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

  if (USE_MOCKS) {
    // Simulate not found error
    if (userId === "not-found") {
      throw mockApiErrors.notFound;
    }

    // Simulate unauthorized error
    if (userId === "unauthorized") {
      throw mockApiErrors.unauthorized;
    }

    const user = getMockUserProfile(userId);
    if (!user) {
      throw mockApiErrors.notFound;
    }

    const response = createMockApiResponse(user);
    return response.data;
  }

  // Real API call
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
  );
  const json: ApiResponse<UserProfile> = await response.json();
  return json.data;
}
```

---

### Example 7: Client Component with Loading State

```typescript
// components/posts/PostList.tsx
"use client";

import { useState, useEffect } from "react";
import { BasePost, PostCategory } from "@/types";
import { getMockPostsByCategory, simulateApiCall } from "@/mocks";

export function PostList({ category }: { category: PostCategory }) {
  const [posts, setPosts] = useState<BasePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);

      // Simulate API call with delay
      const mockData = getMockPostsByCategory(category);
      const data = await simulateApiCall(mockData, 500, 1000);

      setPosts(data);
      setLoading(false);
    }

    loadPosts();
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

---

## 🛠️ Helper Functions

### Mock API Response Wrappers

```typescript
import { createMockApiResponse, createMockPaginatedResponse } from "@/mocks";

// Single item response
const user = getMockUser("user-1");
const response = createMockApiResponse(user);
// { code: 200, success: true, data: {...}, meta: {...} }

// Paginated response
const posts = mockPosts;
const paginatedResponse = createMockPaginatedResponse(posts, 1, 10);
// { code: 200, success: true, data: [...], meta: { page, totalPages, ... } }
```

---

### Simulate Network Conditions

```typescript
import { simulateApiCall, simulateApiCallWithError } from "@/mocks";

// Simulate delay (500-1500ms)
const data = await simulateApiCall(mockUsers, 500, 1500);

// Simulate with 20% error rate
try {
  const data = await simulateApiCallWithError(mockUsers, 0.2);
} catch (error) {
  console.error("Simulated error:", error);
}
```

---

### Generate Random Data

```typescript
import { generateRandomUser, generateRandomPost } from "@/mocks";

// Generate random user
const user = generateRandomUser({ level: 10 });

// Generate random post
const post = generateRandomPost(PostCategory.HOUSING_REQUEST, {
  title: "Custom title",
});
```

---

### Get Specific Mock Data

```typescript
import {
  getMockUser,
  getMockUserProfile,
  getMockPost,
  getMockPostsByCategory,
  getMockPostsByAuthor,
  getRecentMockPosts,
} from "@/mocks";

// Get single items
const user = getMockUser("user-1");
const profile = getMockUserProfile("user-1");
const post = getMockPost("post-1");

// Get filtered collections
const housingPosts = getMockPostsByCategory(PostCategory.HOUSING_REQUEST);
const userPosts = getMockPostsByAuthor("user-1");
const recentPosts = getRecentMockPosts(5);
```

---

## 🎨 Environment Setup

### Development with Mocks

```env
# .env.local
NEXT_PUBLIC_USE_MOCKS=true
```

```typescript
// Check in your code
if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
  // Use mocks
} else {
  // Use real API
}
```

---

### Production (No Mocks)

```env
# .env.production
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_URL=https://api.waterloostar.com
```

---

## 📝 Best Practices

### 1. **Keep Mocks Synchronized with Types**

```typescript
// ✅ Good - Uses actual types
import { User } from "@/types";

export const mockUser: User = {
  id: "1",
  username: "john",
  // ... all required fields
};
```

---

### 2. **Use Realistic Data**

```typescript
// ✅ Good - Realistic data
export const mockUser: User = {
  id: "user-1",
  username: "john_doe",
  email: "john@uwaterloo.ca",
  avatar: "https://i.pravatar.cc/150?img=1",
  level: 5,
  starPoints: 1250,
};

// ❌ Bad - Unrealistic data
export const mockUser: User = {
  id: "1",
  username: "test",
  email: "test",
  avatar: "image",
  level: 999,
  starPoints: 99999,
};
```

---

### 3. **Create Helper Functions**

```typescript
// ✅ Good - Reusable helpers
export function getMockPostsByCategory(category: PostCategory) {
  return mockPosts.filter((post) => post.category === category);
}

// ❌ Bad - Inline filtering everywhere
const housingPosts = mockPosts.filter((p) => p.category === "housing-request");
```

---

### 4. **Simulate Real API Behavior**

```typescript
// ✅ Good - Simulates delay and errors
export async function fetchPosts() {
  if (USE_MOCKS) {
    // Simulate network delay
    await delay(1000);

    // Occasionally simulate errors
    if (Math.random() < 0.1) {
      throw mockApiErrors.serverError;
    }

    return createMockPaginatedResponse(mockPosts);
  }

  return realApiFetch();
}
```

---

## 🔄 Migration Path

### Phase 1: Development (Use Mocks)

```typescript
const USE_MOCKS = true;
```

### Phase 2: Integration (Mix Mocks & Real API)

```typescript
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
```

### Phase 3: Production (Real API Only)

```typescript
const USE_MOCKS = false;
```

---

## 📊 Mock Data Statistics

Current mock data includes:

- **5 Users** - Various levels and profiles
- **6 Posts** - Mix of housing requests and sublets
- **5 Post Authors** - Derived from users
- **6 API Error Types** - Common HTTP errors
- **Helper Functions** - 15+ utility functions

---

## 🚀 Quick Start

### 1. Import mocks

```typescript
import { mockUsers, mockPosts, createMockPaginatedResponse } from "@/mocks";
```

### 2. Use in component

```typescript
export default function MyPage() {
  const response = createMockPaginatedResponse(mockPosts, 1, 10);
  return <div>{response.data.map(...)}</div>;
}
```

### 3. Enable in environment

```env
NEXT_PUBLIC_USE_MOCKS=true
```

---

## 📚 See Also

- **[../types/README.md](../types/README.md)** - Type definitions
- **[../lib/README.md](../lib/README.md)** - API functions (if available)

---

## 💡 Summary

**Mock data provides:**

- ✅ **Fast Development** - No backend needed
- ✅ **Consistent Testing** - Predictable data
- ✅ **Offline Work** - No internet required
- ✅ **Type Safety** - Uses real type definitions
- ✅ **Easy Migration** - Switch to real API anytime

Happy mocking! 🎉
