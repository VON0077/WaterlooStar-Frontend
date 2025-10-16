<!-- 9e17ea9b-6c76-4f58-9923-32c76ca51a57 2b44474d-1a88-44f2-8e68-5bffd5d5aead -->
# 论坛前端开发计划

## 1. 项目结构设计

创建清晰的目录结构来组织论坛相关代码：

```
app/
├── (auth)/              # 认证相关路由组
│   ├── login/
│   │   └── page.tsx    # 登录页面
│   └── register/
│       └── page.tsx    # 注册页面
├── (forum)/            # 论坛相关路由组
│   ├── posts/
│   │   ├── page.tsx           # 帖子列表页（统一入口）
│   │   ├── [id]/
│   │   │   └── page.tsx       # 帖子详情页
│   │   ├── renter/
│   │   │   ├── page.tsx       # Renter 帖子列表
│   │   │   └── create/
│   │   │       └── page.tsx   # 创建 Renter 帖子
│   │   └── rentee/
│   │       ├── page.tsx       # Rentee 帖子列表
│   │       └── create/
│   │           └── page.tsx   # 创建 Rentee 帖子
components/
├── auth/
│   ├── login-form.tsx         # 登录表单（Client Component）
│   └── register-form.tsx      # 注册表单（Client Component）
└── posts/
    ├── post-card.tsx          # 帖子卡片（Server Component）
    ├── post-list.tsx          # 帖子列表（Server Component）
    ├── post-form.tsx          # 创建帖子表单（Client Component）
    ├── delete-post-button.tsx # 删除按钮（Client Component）
    └── post-type-tabs.tsx     # Renter/Rentee 切换（Client Component）
lib/
├── actions/           # Server Actions
│   ├── auth.ts       # 登录、注册 actions
│   └── posts.ts      # 帖子 CRUD actions
├── api/              # API 调用函数（暂时用 mock 数据）
│   ├── auth.ts
│   └── posts.ts
└── types/            # TypeScript 类型定义
    ├── user.ts
    └── post.ts
```

**说明：**

- 使用路由组 `(auth)` 和 `(forum)` 来组织路由，不影响 URL 路径
- Server Components 用于数据展示（SEO 友好）
- Client Components 用于交互（表单、按钮）
- Server Actions 处理数据修改（登录、创建帖子等）

## 2. 类型定义（TypeScript）

在 `lib/types/` 中定义数据结构：

```typescript
// lib/types/user.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'renter' | 'rentee' | 'both';
  createdAt: Date;
}

// lib/types/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'renter' | 'rentee';
  authorId: string;
  author: {
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 3. Mock API 层

由于后端稍后对接，先创建 mock 数据函数：

```typescript
// lib/api/posts.ts
export async function getPosts(type?: 'renter' | 'rentee') {
  // 暂时返回模拟数据
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPosts.filter(p => !type || p.type === type);
}

export async function getPostById(id: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPosts.find(p => p.id === id);
}
```

**说明：** 后续只需替换这些函数的实现，调用真实 API，其他代码无需改动。

## 4. Server Actions

创建服务器端操作函数：

```typescript
// lib/actions/posts.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');
  const type = formData.get('type');
  
  // 验证数据
  // 调用 API
  // 重新验证缓存
  revalidatePath('/posts');
  redirect(`/posts/${type}`);
}

export async function deletePost(postId: string) {
  // 调用删除 API
  revalidatePath('/posts');
}
```

**说明：** Server Actions 是在服务器端运行的函数，可以直接在表单中使用，自动处理提交。

## 5. 核心页面实现

### 5.1 帖子列表页（Server Component）

```tsx
// app/(forum)/posts/renter/page.tsx
import { getPosts } from '@/lib/api/posts';
import PostList from '@/components/posts/post-list';

export default async function RenterPostsPage() {
  const posts = await getPosts('renter');
  
  return (
    <div>
      <h1>Renter 帖子列表</h1>
      <PostList posts={posts} />
    </div>
  );
}
```

**优点：** 直接在组件中 `await` 获取数据，代码简洁，SEO 友好。

### 5.2 创建帖子页（Client Component）

```tsx
// app/(forum)/posts/renter/create/page.tsx
import PostForm from '@/components/posts/post-form';

export default function CreateRenterPost() {
  return <PostForm type="renter" />;
}

// components/posts/post-form.tsx
'use client'
import { createPost } from '@/lib/actions/posts';

export default function PostForm({ type }) {
  return (
    <form action={createPost}>
      <input type="hidden" name="type" value={type} />
      <input name="title" placeholder="标题" required />
      <textarea name="content" placeholder="内容" required />
      <button type="submit">发布</button>
    </form>
  );
}
```

**说明：** 表单的 `action` 直接指向 Server Action，无需手动处理提交。

### 5.3 删除功能（Client Component）

```tsx
// components/posts/delete-post-button.tsx
'use client'
import { deletePost } from '@/lib/actions/posts';
import { useTransition } from 'react';

export default function DeletePostButton({ postId }) {
  const [isPending, startTransition] = useTransition();
  
  const handleDelete = () => {
    if (confirm('确定删除？')) {
      startTransition(() => deletePost(postId));
    }
  };
  
  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? '删除中...' : '删除'}
    </button>
  );
}
```

**说明：** `useTransition` 提供加载状态，用户体验更好。

## 6. 导航和路由

更新 `config/site.ts` 添加论坛导航：

```typescript
navItems: [
  { label: "Home", href: "/" },
  { label: "论坛", href: "/posts" },
  { label: "Renter 帖子", href: "/posts/renter" },
  { label: "Rentee 帖子", href: "/posts/rentee" },
  { label: "登录", href: "/login" },
]
```

## 7. 认证系统

### 7.1 登录页面

```tsx
// app/(auth)/login/page.tsx
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1>登录</h1>
      <LoginForm />
    </div>
  );
}

// components/auth/login-form.tsx
'use client'
import { login } from '@/lib/actions/auth';

export default function LoginForm() {
  return (
    <form action={login}>
      <input name="email" type="email" placeholder="邮箱" required />
      <input name="password" type="password" placeholder="密码" required />
      <button type="submit">登录</button>
    </form>
  );
}
```

### 7.2 注册页面（类似结构）

## 8. 样式美化

使用 HeroUI 组件美化界面：

- 使用 `Card` 组件显示帖子
- 使用 `Button` 组件处理操作
- 使用 `Input` 和 `Textarea` 组件处理表单
- 使用 `Tabs` 组件切换 Renter/Rentee

## 实施顺序

按照以下顺序实施可以逐步验证功能：

1. 创建类型定义和 mock 数据
2. 实现帖子列表页（先实现基本功能，再美化）
3. 实现帖子详情页
4. 实现创建帖子功能
5. 实现删除帖子功能
6. 实现 Renter/Rentee 切换
7. 实现认证系统（登录/注册）
8. 整体样式优化和响应式适配
9. 后端 API 对接（替换 mock 函数）

### To-dos

- [ ] 创建项目目录结构（app 路由、components、lib 文件夹）
- [ ] 定义 TypeScript 类型（User、Post）
- [ ] 创建 mock API 层和测试数据
- [ ] 实现帖子列表页（Renter 和 Rentee）
- [ ] 实现帖子详情页
- [ ] 创建 Server Actions（创建帖子、删除帖子）
- [ ] 实现创建帖子功能（表单和页面）
- [ ] 实现删除帖子功能
- [ ] 实现 Renter/Rentee 导航切换
- [ ] 实现认证系统（登录和注册页面）
- [ ] 使用 HeroUI 组件美化所有页面
- [ ] 更新导航配置，添加论坛相关链接