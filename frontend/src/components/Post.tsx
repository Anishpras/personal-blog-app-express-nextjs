import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostProps {
  id: string;
  title: string;
  content: string;
  author: {
    email: string;
    name?: string;
    image?: string;
  };
  createdAt: string;
}

export function Post({ id, title, content, author, createdAt }: PostProps) {
  const stripHtmlAndTruncate = (html: string, maxLength: number) => {
    const stripped = html.replace(/<[^>]+>/g, "");
    return stripped.length > maxLength
      ? stripped.slice(0, maxLength) + "..."
      : stripped;
  };

  return (
    <div className="transform transition duration-300 hover:scale-105">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>{author.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {author.name || author.email}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Link href={`/post/${id}`} className="block group">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
              {title}
            </h2>
            <div
              className="text-gray-700 mb-4 line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: stripHtmlAndTruncate(content, 150),
              }}
            />
          </Link>
        </CardContent>
        <CardFooter className="bg-gray-50 p-4">
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" asChild>
              <Link href={`/post/${id}`}>Read more</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
