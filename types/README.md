# Types Directory Structure

## 📁 File Organization

```
types/
├── index.ts           # Central export (barrel file)
├── users.ts           # User domain models
├── posts.ts           # Post domain models
├── api.ts             # Generic API wrapper types
├── components.ts      # React component prop types
├── common.ts          # Shared utility types (future)
├── forms.ts           # Form validation types (future)
└── USAGE_EXAMPLES.md  # Practical examples
```

---

## 🎯 What Goes Where?

### **`users.ts`** - User Domain Types (WHAT a User IS)

```typescript
✅ User                    // Basic user data
✅ UserProfile             // Extended user info
✅ UserAuth                // Authentication data
✅ PostAuthor              // Minimal user for posts
✅ UserRole                // Role enum
✅ UserRegistrationInput   // Registration form data
✅ UserUpdateInput         // Update form data
```

**Think:** "What is the shape of user data?"

---

### **`posts.ts`** - Post Domain Types (WHAT a Post IS)

```typescript
✅ BasePost               // Base post structure
✅ HousingRequestPost     // Housing-specific post
✅ SubletPost             // Sublet-specific post
✅ PostStatus             // Status enum
✅ PostCategory           // Category enum
✅ Amenity                // Amenity enum
✅ Utility                // Utility enum
```

**Think:** "What is the shape of post data?"

---

### **`api.ts`** - API Wrapper Types (HOW data is returned)

```typescript
✅ ApiResponse<T>         // Single item wrapper
✅ PaginatedResponse<T>   // List with pagination
✅ ApiError               // Error response structure
✅ ApiSuccess             // Success confirmation
✅ PaginationParams       // Request parameters
✅ PaginationMeta         // Pagination metadata
✅ SearchParams           // Search/filter params
```

**Think:** "What is the structure of API responses?"

---

### **`components.ts`** - React Component Types

```typescript
✅ IconSvgProps           // SVG icon component props
```

**Think:** "What props do components accept?"

---

## 🔗 How Types Work Together

### Visual Example: API Endpoint Returns User

```
┌─────────────────────────────────────────────────┐
│         Backend API Endpoint                     │
│         GET /api/users/123                       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  JSON Response │
         └────────┬───────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌─────────┐               ┌──────────┐
│ Wrapper │               │   Data   │
│  (HOW)  │               │  (WHAT)  │
├─────────┤               ├──────────┤
│ api.ts  │               │ users.ts │
└─────────┘               └──────────┘
    │                           │
    │                           │
    ▼                           ▼
ApiResponse<T>            UserProfile
    │                           │
    └──────────┬────────────────┘
               │
               ▼
    ApiResponse<UserProfile>
```

**Result:**

```typescript
{
  "data": {              // ← ApiResponse wrapper
    "id": "123",         // ← UserProfile data
    "username": "john",
    "email": "john@...",
    "level": 5,
    ...
  },
  "meta": {              // ← ApiResponse wrapper
    "timestamp": "..."
  }
}
```

---

## 📝 Type Composition Examples

### Example 1: Single User Endpoint

```typescript
// Import both domain and wrapper types
import { ApiResponse, UserProfile } from "@/types";

// Combine them
type GetUserResponse = ApiResponse<UserProfile>;

// Usage
async function fetchUser(id: string): Promise<UserProfile> {
  const response = await fetch(`/api/users/${id}`);
  const json: GetUserResponse = await response.json();
  return json.data; // Extract just the user data
}
```

---

### Example 2: User List Endpoint

```typescript
import { PaginatedResponse, User } from "@/types";

// Combine them
type GetUsersResponse = PaginatedResponse<User>;

// Usage
async function fetchUsers(page: number): Promise<PaginatedResponse<User>> {
  const response = await fetch(`/api/users?page=${page}`);
  return response.json();
}

// In component
const result = await fetchUsers(1);
console.log(result.data); // User[]
console.log(result.pagination); // PaginationMeta
```

---

### Example 3: Create User Endpoint

```typescript
import { ApiResponse, UserProfile, UserRegistrationInput } from "@/types";

// Request uses input type
type CreateUserRequest = UserRegistrationInput;

// Response uses wrapper + domain type
type CreateUserResponse = ApiResponse<UserProfile>;

// Usage
async function createUser(input: UserRegistrationInput): Promise<UserProfile> {
  const response = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(input),
  });

  const json: CreateUserResponse = await response.json();
  return json.data;
}
```

---

### Example 4: User's Posts Endpoint (Cross-Type)

```typescript
import { PaginatedResponse, BasePost } from "@/types";

// Notice: BasePost contains PostAuthor (from users.ts)
// This shows how domain types can reference each other
type GetUserPostsResponse = PaginatedResponse<BasePost>;

// Usage
async function fetchUserPosts(userId: string) {
  const response = await fetch(`/api/users/${userId}/posts`);
  const json: PaginatedResponse<BasePost> = await response.json();

  json.data.forEach((post) => {
    // TypeScript knows post.author is PostAuthor
    console.log(post.author.username);
    console.log(post.author.level);
  });
}
```

---

## 🎨 Type Naming Conventions

### Domain Types (users.ts, posts.ts)

- **Entities:** `User`, `Post`, `Comment`
- **Extended:** `UserProfile`, `PostDetail`
- **Minimal:** `PostAuthor`, `UserSummary`
- **Input:** `UserUpdateInput`, `PostCreateInput`
- **Enums:** `UserRole`, `PostStatus`, `PostCategory`

### API Types (api.ts)

- **Responses:** `ApiResponse<T>`, `PaginatedResponse<T>`
- **Errors:** `ApiError`, `ValidationError`
- **Params:** `PaginationParams`, `SearchParams`
- **Metadata:** `PaginationMeta`, `ResponseMeta`

### Component Types (components.ts)

- **Props:** `IconSvgProps`, `ButtonProps`
- **Event Handlers:** `OnClickHandler`, `OnChangeHandler`

---

## 📊 Type Hierarchy

```
User (basic)
  │
  ├─ UserProfile (extended)
  │    ├─ stats
  │    └─ preferences
  │
  ├─ PostAuthor (minimal)
  │    └─ Used in BasePost
  │
  └─ UserAuth (authentication)
       └─ role: UserRole

BasePost
  ├─ author: PostAuthor  ← References users.ts
  ├─ category: PostCategory
  └─ status: PostStatus

API Wrappers (generic)
  ├─ ApiResponse<T>
  │    └─ data: T
  │
  └─ PaginatedResponse<T>
       ├─ data: T[]
       └─ pagination: PaginationMeta
```

---

## ✅ Best Practices

### 1. **Separate Concerns**

```typescript
✅ DO: Keep domain types separate from API wrapper types
❌ DON'T: Mix response structure with domain data

// ❌ Bad - Mixing concerns
export interface UserResponse {
  data: {
    id: string;
    username: string;
  };
  pagination: {...};
}

// ✅ Good - Separated
export interface User {
  id: string;
  username: string;
}

type UserListResponse = PaginatedResponse<User>;
```

---

### 2. **Use Generic Types**

```typescript
✅ DO: Reuse generic wrappers
❌ DON'T: Create custom response types for each endpoint

// ❌ Bad - Duplicating structure
export interface UsersResponse {
  data: User[];
  pagination: {...};
}
export interface PostsResponse {
  data: Post[];
  pagination: {...};
}

// ✅ Good - Using generic
type UsersResponse = PaginatedResponse<User>;
type PostsResponse = PaginatedResponse<Post>;
```

---

### 3. **Create Minimal Types for Embedding**

```typescript
✅ DO: Create minimal types for nested data
❌ DON'T: Embed full objects when you only need a few fields

// ✅ Good - Minimal PostAuthor
export interface PostAuthor {
  id: string;
  username: string;
  avatar?: string;
  level: number;
}

export interface BasePost {
  author: PostAuthor; // Only includes necessary fields
}
```

---

### 4. **Use Type References**

```typescript
✅ DO: Reference types across files
❌ DON'T: Duplicate type definitions

// posts.ts
import { PostAuthor } from "./users";

export interface BasePost {
  author: PostAuthor; // ✅ Reusing type
}

// ❌ Bad - Duplicating
export interface BasePost {
  author: {
    id: string;
    username: string;
  };
}
```

---

## 🚀 Quick Reference

| Need                 | File            | Type                     |
| -------------------- | --------------- | ------------------------ |
| User data structure  | `users.ts`      | `User`, `UserProfile`    |
| Post data structure  | `posts.ts`      | `BasePost`, `SubletPost` |
| API response wrapper | `api.ts`        | `ApiResponse<T>`         |
| Paginated list       | `api.ts`        | `PaginatedResponse<T>`   |
| API error            | `api.ts`        | `ApiError`               |
| Form input           | `users.ts`      | `UserUpdateInput`        |
| Component props      | `components.ts` | `IconSvgProps`           |

---

## 📚 See Also

- **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - Real-world examples with code
- **[../lib/README.md](../lib/README.md)** - API and actions guide (if available)

---

## 💡 Summary

**The Pattern:**

```typescript
Domain Type (WHAT) + API Wrapper (HOW) = Complete Type
```

**Example:**

```typescript
UserProfile + ApiResponse<T> = ApiResponse<UserProfile>
User[]      + PaginatedResponse<T> = PaginatedResponse<User>
```

This separation gives you:

- ✅ **Reusability** - Generic wrappers work with any domain type
- ✅ **Maintainability** - Change once, affects all endpoints
- ✅ **Type Safety** - TypeScript catches errors at compile time
- ✅ **Documentation** - Types serve as API documentation

**Happy typing!** 🎉
