# Mock Data Strategies Comparison

## Current Implementation: Inline Conditionals

```typescript
// lib/api/posts.ts
export async function getPosts() {
  if (USE_MOCKS) {
    const { getMockData } = await import("@/mocks");
    return getMockData();
  }
  return fetch(API_URL);
}
```

### ✅ Pros:

- Simple to understand
- Everything in one file
- Easy to add/remove mocking

### ❌ Cons:

- Mock code included in production bundle (even if not used)
- Mixed concerns in one file
- Repetitive if-statements
- Hard to maintain as codebase grows

---

## Better Approach 1: Separate Files (Factory Pattern) ⭐⭐⭐

### Structure:

```
lib/api/
├── posts.ts         # Main export (factory)
├── posts.real.ts    # Real API implementation
└── posts.mock.ts    # Mock API implementation
```

### Implementation:

```typescript
// posts.real.ts - Real API
export async function getPosts(category, filters, pagination) {
  const response = await fetch(`${API_URL}/posts?...`);
  return response.json();
}

// posts.mock.ts - Mock API
export async function getPosts(category, filters, pagination) {
  const mockData = getMockPostsByCategory(category);
  return createMockPaginatedResponse(mockData);
}

// posts.ts - Factory (chooses which to use)
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export async function getPosts(category, filters, pagination) {
  if (USE_MOCKS) {
    const api = await import("./posts.mock");
    return api.getPosts(category, filters, pagination);
  }
  const api = await import("./posts.real");
  return api.getPosts(category, filters, pagination);
}
```

### ✅ Pros:

- Clean separation of concerns
- Real/mock implementations completely separate
- Tree-shaking removes unused code in production
- Easy to test each implementation
- No if-statements polluting business logic

### ❌ Cons:

- More files to maintain
- Slightly more boilerplate
- Need to keep function signatures in sync

---

## Better Approach 2: MSW (Mock Service Worker) ⭐⭐⭐⭐⭐

### Installation:

```bash
npm install msw --save-dev
```

### Setup:

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { mockPosts } from "@/mocks";

export const handlers = [
  http.get("/api/posts", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    const posts = getMockPostsByCategory(category);
    return HttpResponse.json(createMockPaginatedResponse(posts));
  }),

  http.get("/api/posts/:id", ({ params }) => {
    const post = getMockPost(params.id);
    return HttpResponse.json(createMockApiResponse(post));
  }),
];

// mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

// app/providers.tsx
if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
  const { worker } = await import("@/mocks/browser");
  await worker.start();
}
```

### API stays clean:

```typescript
// lib/api/posts.ts - NO mocking logic!
export async function getPosts(category, filters, pagination) {
  const response = await fetch(`${API_URL}/posts?...`);
  return response.json();
}
```

### ✅ Pros:

- ⭐ **Best approach** - Industry standard
- API code has ZERO mock logic
- Intercepts at network level (works with any HTTP client)
- Browser DevTools shows mock requests as real
- Works with React Query, SWR, etc. automatically
- Same mocks for development AND testing
- Can mock 3rd party APIs too

### ❌ Cons:

- Additional dependency
- Slightly more complex setup
- Need to maintain handlers

---

## Approach 3: Next.js API Routes as Proxy

```typescript
// app/api/posts/route.ts
export async function GET(request: Request) {
  if (process.env.USE_MOCKS === "true") {
    const mockData = getMockPostsByCategory("housing");
    return Response.json(mockData);
  }

  // Forward to real backend
  const response = await fetch(`${BACKEND_URL}/posts`);
  return response;
}

// lib/api/posts.ts
export async function getPosts() {
  // Always call local API route
  const response = await fetch("/api/posts");
  return response.json();
}
```

### ✅ Pros:

- Clean client code
- Server-side mocking
- Can add auth, validation, caching
- One place to control API behavior

### ❌ Cons:

- Extra API layer (performance overhead)
- More complex architecture
- Deploy Next.js API routes

---

## Comparison Summary

| Approach                | Simplicity | Performance | Bundle Size | Scalability | Testing    |
| ----------------------- | ---------- | ----------- | ----------- | ----------- | ---------- |
| **Inline Conditionals** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐      | ⭐⭐        | ⭐⭐        | ⭐⭐⭐     |
| **Separate Files**      | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐    | ⭐⭐⭐⭐    | ⭐⭐⭐⭐   |
| **MSW**                 | ⭐⭐⭐     | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐ |
| **API Routes**          | ⭐⭐       | ⭐⭐⭐      | ⭐⭐⭐⭐⭐  | ⭐⭐⭐      | ⭐⭐⭐⭐   |

---

## Recommendation

### For Small Projects (< 10 API functions):

✅ **Current approach is fine** (inline conditionals)

### For Medium Projects (10-50 API functions):

✅ **Use separate files** (Factory Pattern)

- Easy to implement now
- Better organization
- Tree-shaking removes unused code

### For Large Projects / Teams:

✅ **Use MSW** (Mock Service Worker)

- Industry best practice
- No mock logic in API code
- Works with any testing framework
- Reusable across projects

---

## Migration Guide

### From Current → Separate Files:

```bash
# 1. Create separate files
touch lib/api/posts.real.ts
touch lib/api/posts.mock.ts

# 2. Move implementations
# posts.real.ts gets all fetch() code
# posts.mock.ts gets all mock code

# 3. Update posts.ts to be a factory
# (see example above)
```

### From Current → MSW:

```bash
# 1. Install MSW
npm install msw --save-dev

# 2. Initialize MSW
npx msw init public/

# 3. Create handlers (see example above)

# 4. Remove all mock logic from API files

# 5. Start worker in app (see example above)
```

---

## My Recommendation for Your Project

**Stick with current approach for now** ✅

Reasons:

1. Your project is still small (few API functions)
2. Current approach is working
3. Easy to understand for contributors
4. Can migrate later if needed

**Consider migrating to MSW when:**

- You have >20 API functions
- Multiple developers working on the project
- You want cleaner API code
- You're setting up comprehensive testing

---

## Example: Your Current Code is Good!

```typescript
// This is perfectly fine for your project size:
export async function getPosts() {
  if (USE_MOCKS) {
    const { getMockData } = await import("@/mocks");
    return getMockData();
  }
  return fetch(...);
}
```

Don't over-engineer! Your current solution is **simple, works, and maintainable**. 🎉

Only refactor when you feel pain from the current approach.
