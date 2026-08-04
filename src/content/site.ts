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
    github: "https://github.com/MarvelousUkuesa",
    linkedin: "https://www.linkedin.com/in/marvelous-ukuesa-22ba86250",
  },
  /** Used by the GitHub adapter when NEXT_PUBLIC_GITHUB_USER is unset */
  githubUsername: "MarvelousUkuesa",

  author: {
    name: "Mars",
    title: "Cloud & AI Infrastructure Engineer",
    bio: "I design agentic systems and calm cloud infrastructure — then write down what actually worked in production.",
  },

  about: {
    /** Short opener — who you are */
    lead: "Hi, I'm Ukuesa Marvelous — most people call me Mars, and you're welcome to do the same.",
    /** Longer story — rendered as stacked paragraphs */
    body: [
      "I'm from Nigeria, where I studied Chemistry before curiosity about technology brought me to Germany for a Bachelor's in Software Engineering.",
      "I build reliable, secure, and scalable systems — backend, cloud, DevSecOps, and AI apps — always asking not just how something works, but why it was designed that way. This site is where I write and share what I'm building.",
      "When I'm not coding, I'm usually reading, playing football, jogging, or learning something that challenges how I think.",
    ],
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
