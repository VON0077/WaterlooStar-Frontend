export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Waterloo Star",
  description:
    "Waterloo Star is a platform for students to find and share housing requests and sublets.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

export const sidebarConfig = {
  sections: [
    {
      title: "Housing",
      items: [
        {
          label: "Housing Requests",
          href: "/housing-request",
          description: "Find and share housing requests",
        },
        {
          label: "Sublets",
          href: "/sublet",
          description: "Find and share sublets",
        },
      ],
    },
  ],
};
