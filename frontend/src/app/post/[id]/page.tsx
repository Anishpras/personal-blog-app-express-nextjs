"use client";

import { getPostById, updatePost, deletePost } from "@/lib/api";
import { notFound, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { Post } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const { data: session } = useSession();
  const [isAuthor, setIsAuthor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    session?.user?.id === post?.author?.id && setIsAuthor(true);
  }, [post?.author?.id, session?.user?.id]);
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

  const handleDelete = async () => {
    try {
      await deletePost(
        post?.id as string,
        //@ts-expect-error - accessToken is defined in the session object
        session?.user?.accessToken!
      );
      router.push("/dashboard"); // Redirect to home page after deletion
    } catch (error) {
      console.error("Failed to delete post:", error);
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
          {isAuthor && (
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={handleEdit} variant="outline">
                {isEditing ? (
                  "Save"
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your post and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
