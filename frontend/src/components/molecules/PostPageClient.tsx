"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { Post } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import { updatePost, deletePost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function PostPageClient({ initialPost }: { initialPost: Post }) {
  const [post, setPost] = useState(initialPost);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const { data: session, status } = useSession();
  const router = useRouter();

  const checkIsAuthor = useCallback(() => {
    return session?.user?.email === post.author?.email;
  }, [session?.user?.email, post.author?.email]);

  const [isAuthor, setIsAuthor] = useState(checkIsAuthor());

  useEffect(() => {
    setIsAuthor(checkIsAuthor());
  }, [checkIsAuthor]);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const updatedPost = await updatePost(
          post.id,
          editedTitle,
          editedContent,
          //@ts-expect-error - accessToken is defined in the session object
          session?.user?.accessToken!
        );
        setPost(updatedPost);
        setEditedTitle(updatedPost.title);
        setEditedContent(updatedPost.content);
        setIsEditing(false);
        setIsAuthor(checkIsAuthor()); // Recheck author status after update
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
        post.id,
        //@ts-expect-error - accessToken is defined in the session object
        session?.user?.accessToken!
      );
      router.push("/dashboard"); // Redirect to home page after deletion
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  if (status === "loading") {
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
            <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
          )}
          <p className="text-gray-600">By {post.author?.email}</p>
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
              dangerouslySetInnerHTML={{ __html: post.content }}
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
