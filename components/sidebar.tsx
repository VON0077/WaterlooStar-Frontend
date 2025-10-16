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
import { DetailsIcon } from "./icons";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 40 : 270 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={clsx(
        "sticky top-0 self-start shrink-0",
        "h-full",
        "bg-background border-r border-divider",
        "relative"
      )}
    >
      {/* Collapse Toggle Button */}
      <Button
        isIconOnly
        size="sm"
        variant="flat"
        className="absolute -right-4 top-2 !text-foreground z-50"
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <DetailsIcon />
      </Button>

      {/* Sidebar Content */}
      <div className="p-4 overflow-y-auto h-full overflow-x-hidden">
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
          // show nothing after collapsed
          <div className="flex flex-col gap-4">{/* empty */}</div>
        )}
      </div>
    </motion.aside>
  );
};
