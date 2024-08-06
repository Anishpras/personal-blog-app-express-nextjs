"use client";

import { useState } from "react";
import { getPostsByAuthor } from "@/lib/api";
import { Post } from "@/components/Post";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Author, Post as PostType } from "@/types";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";

interface HomePageClientProps {
  initialPosts: PostType[];
  initialAuthors: Author[];
}

export default function HomePageClient({
  initialPosts,
  initialAuthors,
}: HomePageClientProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [authors] = useState<Author[]>(initialAuthors);
  const [selectedAuthor, setSelectedAuthor] = useState("");

  const handleAuthorChange = async (authorId: string) => {
    setSelectedAuthor(authorId);
    if (authorId) {
      const authorPosts = await getPostsByAuthor(authorId);
      setPosts(authorPosts);
    } else {
      setPosts(initialPosts);
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedAuthor("");
    setPosts(initialPosts);
  };

  return (
    <div className="container mx-auto mt-8">
      <AnimatedGridPattern
        numSquares={200}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
      <h1 className="text-3xl font-bold mb-4">Latest Blog Posts</h1>
      {authors.length > 0 && (
        <div className="mb-4">
          <Select onValueChange={handleAuthorChange} value={selectedAuthor}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Author" />
            </SelectTrigger>
            <SelectContent>
              {authors.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.email}
                </SelectItem>
              ))}
              <SelectSeparator />
              <Button
                className="w-full px-2"
                variant="secondary"
                size="sm"
                onClick={handleClear}>
                Clear
              </Button>
            </SelectContent>
          </Select>
        </div>
      )}

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
              <Post {...post} onUpdate={() => {}} />
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
