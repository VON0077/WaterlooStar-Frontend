<!-- 2e0e926b-27c6-4088-9f23-cf615a51d0dc b3f0311c-b8ba-476f-930e-e216bbeae228 -->
# Build Collapsible Sidebar with HeroUI

## Overview

You'll create a collapsible sidebar that shows forum sections and subsections. The sidebar will use HeroUI's Accordion component for collapsible sections and will be visible across all pages.

## Step 1: Update Site Configuration

In `config/site.ts`, add a new configuration for sidebar items:

```typescript
export const sidebarConfig = {
  sections: [
    {
      title: "Housing",
      items: [
        {
          label: "Housing Requests",
          href: "/housing-request/feed",
          description: "Find or post housing requests"
        },
        {
          label: "Sublets",
          href: "/sublet/feed",
          description: "Browse available sublets"
        }
      ]
    },
    // Future sections can be added here:
    // {
    //   title: "Academic",
    //   items: [...]
    // },
    // {
    //   title: "Discounts",
    //   items: [...]
    // }
  ]
};
```

## Step 2: Build the Sidebar Component

In `components/sidebar.tsx`, create a collapsible sidebar:

### Key Components to Use:

- `@heroui/accordion` - For collapsible sections
- `@heroui/link` - For navigation items
- `framer-motion` - For collapse animation
- Icons from `components/icons.tsx` (or add new ones)

### Structure:

```typescript
"use client";

import { useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";
import clsx from "clsx";

// Import your sidebar config
import { sidebarConfig } from "@/config/site";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={clsx(
        "fixed left-0 top-16 h-[calc(100vh-4rem)]",
        "bg-background border-r border-divider",
        "transition-all duration-300 z-40"
      )}
    >
      {/* Collapse Toggle Button */}
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="absolute -right-3 top-4"
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        {/* Add chevron icon */}
      </Button>

      {/* Sidebar Content */}
      <div className="p-4 overflow-y-auto h-full">
        {!isCollapsed ? (
          <Accordion selectionMode="multiple" defaultExpandedKeys={["0"]}>
            {sidebarConfig.sections.map((section, idx) => (
              <AccordionItem
                key={idx}
                title={section.title}
                className="text-lg font-semibold"
              >
                <div className="flex flex-col gap-2 pl-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      as={NextLink}
                      href={item.href}
                      className={clsx(
                        "p-2 rounded-lg",
                        pathname.startsWith(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-default-100"
                      )}
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-default-500">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          // Collapsed view with icons only
          <div className="flex flex-col gap-4">
            {/* Add icon-only view */}
          </div>
        )}
      </div>
    </motion.aside>
  );
};
```

## Step 3: Add Icons

In `components/icons.tsx`, add icons for the collapse button and sections:

```typescript
export const ChevronLeftIcon = (props: IconSvgProps) => (
  <svg /* ... chevron left SVG */ />
);

export const ChevronRightIcon = (props: IconSvgProps) => (
  <svg /* ... chevron right SVG */ />
);

export const HousingIcon = (props: IconSvgProps) => (
  <svg /* ... housing/home SVG */ />
);
```

## Step 4: Update Root Layout

In `app/layout.tsx`:

1. Import the Sidebar component
2. Modify the layout structure to accommodate the sidebar
3. Add padding to the main content area to prevent overlap
```typescript
import { Sidebar } from "@/components/sidebar";

// In the return statement, update the structure:
<div className="relative flex flex-col h-screen">
  <Navbar />
  <div className="flex flex-1">
    <Sidebar />
    <main className="flex-1 ml-[280px] pt-16 px-6">
      {/* Add responsive ml: ml-0 on mobile, ml-[280px] on desktop */}
      {children}
    </main>
  </div>
  <footer>{/* ... */}</footer>
</div>
```


## Step 5: Add Responsive Behavior

Add responsive classes to hide sidebar on mobile and show a menu button:

- Hide sidebar on mobile: `hidden md:block`
- Adjust main content margin: `ml-0 md:ml-[280px]`
- Optional: Add a mobile drawer that opens on button click

## Step 6: Style Refinements

Add these styling considerations:

- Active link highlighting based on current route
- Smooth transitions for collapse/expand
- Proper z-index to avoid navbar overlap
- Scrollable sidebar content if sections grow
- Consider dark mode compatibility

## Testing Checklist

1. Navigate between different sections - active state updates
2. Collapse/expand functionality works smoothly
3. Responsive behavior on mobile devices
4. Add new sections to verify extensibility
5. Check dark mode appearance

## Future Enhancements

When adding new sections (Academic, Discounts, etc.), simply:

1. Add new section object to `sidebarConfig.sections` in `config/site.ts`
2. Optionally add section-specific icons
3. No changes needed to the Sidebar component itself