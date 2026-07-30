/**
 * Site-wide copy and identity.
 * Change this file to rebrand — sections read from here, not hard-coded strings.
 */
export const site = {
  name: "Mars",
  title: "Mars — Work & Writing",
  description:
    "Portfolio of GitHub projects and writing about building software.",
  tagline: "I build things, then write about what I learned.",
  email: "hello@example.com",
  links: {
    github: "https://github.com/YOUR_GITHUB_USERNAME",
    linkedin: "https://linkedin.com/in/YOUR_HANDLE",
  },
  /** Used by the GitHub adapter when NEXT_PUBLIC_GITHUB_USER is unset */
  githubUsername: "YOUR_GITHUB_USERNAME",

  author: {
    name: "Mars",
    title: "Cloud & AI Infrastructure Engineer",
    bio: "I design agentic systems and calm cloud infrastructure — then write down what actually worked in production.",
  },

  about: {
    /** Short opener — capability without a pitch */
    lead: "I care about clear systems, honest interfaces, and work that still makes sense six months later.",
    body: "Most days that looks like shaping products end-to-end: from the first sketch of an idea to something people can actually use. I write about the parts that were messy, because the mess is usually where the skill shows.",
    /** Cycles on the page — soft proof of range */
    focus: [
      "shipping calm interfaces",
      "serverless backends that stay cheap",
      "turning repos into stories",
      "making complexity feel quiet",
    ],
    /**
     * Craft words — hover to reveal. Sells skill by invitation, not a list of bars.
     */
    craft: [
      {
        word: "TypeScript",
        note: "Typed systems that stay refactorable when the product moves.",
      },
      {
        word: "React",
        note: "Interfaces with clear hierarchy and motion that earns its place.",
      },
      {
        word: "Next.js",
        note: "App-router sites that load fast and stay easy to grow.",
      },
      {
        word: "AWS",
        note: "Serverless paths — API, Lambda, DynamoDB — matched to real traffic.",
      },
      {
        word: "Writing",
        note: "Turning builds into narratives people can follow and trust.",
      },
      {
        word: "Design",
        note: "Minimal layouts where brand and content do the heavy lifting.",
      },
    ],
  },

  contact: {
    headline: "If something here resonates",
    invite:
      "I’m open to thoughtful collaborations, product builds, and conversations about work worth doing.",
    prompt: "Say what you’re building — I’ll reply when I can give it real attention.",
  },
} as const;
