import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { Contact } from "@/components/sections/Contact";
import { getFeaturedProjects } from "@/lib/content/projects";
import { getLatestPosts } from "@/lib/content/posts";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getFeaturedProjects(),
    getLatestPosts(3),
  ]);

  /* Sibling sections only — no nested <section> wrappers */
  return (
    <>
      <Hero />
      <About />
      <FeaturedWork projects={projects} />
      <LatestPosts posts={posts} />
      <Contact />
    </>
  );
}
