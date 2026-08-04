import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { Contact } from "@/components/sections/Contact";
import { getProjects } from "@/lib/content/projects";
import { getLatestPosts } from "@/lib/content/posts";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getProjects(),
    getLatestPosts(3),
  ]);
  const featured = projects.filter((p) => p.featured && !p.draft);

  /* Sibling sections only — no nested <section> wrappers */
  return (
    <>
      <Hero />
      <About latestPosts={posts} projects={projects} />
      <FeaturedWork projects={featured} />
      <LatestPosts posts={posts} />
      <Contact />
    </>
  );
}
