"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { createPost, getUserPosts } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/components/Post";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Loading } from "@/components/Loading";
import { Post as PostType } from "@/types";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user.id) {
      fetchUserPosts();
    }
  }, [session]);

  const fetchUserPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const posts = await getUserPosts(session?.user?.id!);
      setUserPosts(posts);
    } catch (err) {
      setError("Failed to fetch user posts");
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await createPost(
        title,
        content,
        session?.user?.id!,
        session?.user?.accessToken!
      );
      setTitle("");
      setContent("");
      fetchUserPosts();
    } catch (err) {
      setError("Failed to create post");
    }
    setIsLoading(false);
  };

  if (status === "loading") return <Loading />;
  if (!session)
    return <ErrorMessage message="Please log in to access the dashboard." />;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {error && <ErrorMessage message={error} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <Post key={post.id} {...post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
