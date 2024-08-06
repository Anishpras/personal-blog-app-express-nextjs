import { getPostById, getPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import PostPageClient from "@/components/molecules/PostPageClient";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}
export const revalidate = 5;
export default async function PostPage({ params }: { params: { id: string } }) {
  let post;
  try {
    post = await getPostById(params.id);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return <PostPageClient initialPost={post} />;
}
