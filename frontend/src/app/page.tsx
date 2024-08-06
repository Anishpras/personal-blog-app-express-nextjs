import HomePageClient from "@/components/molecules/HomePageClient";
import { getPosts, getAuthors } from "@/lib/api";

export default async function Page() {
  const posts = await getPosts();
  const authors = await getAuthors();

  return <HomePageClient initialPosts={posts} initialAuthors={authors} />;
}
