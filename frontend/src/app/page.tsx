import { getPosts } from "@/lib/api";
import { Post } from "@/components/Post";

export const revalidate = 60; // Revalidate this page every 60 seconds

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Latest Blog Posts</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post, index) => (
            <div
              key={post.id}
              className="opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "forwards",
              }}>
              <Post {...post} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No posts available at the moment. Check back later!
        </p>
      )}
    </div>
  );
}
