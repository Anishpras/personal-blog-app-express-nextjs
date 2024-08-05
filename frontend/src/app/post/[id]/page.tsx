"use client";

import { getPostById, updatePost } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { Post } from "@/types";

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(params.id);
        setPost(fetchedPost);
        setEditedTitle(fetchedPost.title);
        setEditedContent(fetchedPost.content);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        notFound();
      }
    };

    fetchPost();
  }, [params.id]);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const updatedPost = await updatePost(
          post?.id as string,
          editedTitle,
          editedContent,
          //@ts-expect-error - accessToken is defined in the session object
          session?.user?.accessToken!
        );
        setPost(updatedPost);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update post:", error);
      }
    } else {
      setIsEditing(true);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardHeader>
          {isEditing ? (
            <input
              className="text-3xl font-bold w-full p-2 border rounded"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            <CardTitle className="text-3xl font-bold">{post?.title}</CardTitle>
          )}
          <p className="text-gray-600">By {post?.author?.email}</p>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <RichTextEditor
              content={editedContent}
              onChange={setEditedContent}
            />
          ) : (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          )}
          {session?.user?.id === post?.author?.id && (
            <Button onClick={handleEdit} className="mt-4">
              {isEditing ? "Save" : "Edit"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
