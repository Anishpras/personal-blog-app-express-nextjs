"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { updatePost, deletePost } from "@/lib/api";
import { useSession } from "next-auth/react";
import RichTextEditor from "@/components/RichTextEditor";
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
import { BorderBeam } from "./ui/border-beam";

interface PostProps {
  id: string;
  title: string;
  content: string;
  author: {
    email: string;
    id: string;
  };
  createdAt: string;
  onUpdate?: () => void;
  optionsPanel?: boolean;
}

export function Post({
  id,
  title,
  content,
  author,
  createdAt,
  onUpdate,
  optionsPanel,
}: PostProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const stripHtmlAndTruncate = (html: string, maxLength: number) => {
    const stripped = html.replace(/<[^>]+>/g, "");
    return stripped.length > maxLength
      ? stripped.slice(0, maxLength) + "..."
      : stripped;
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await updatePost(
          id,
          editedTitle,
          editedContent,
          //@ts-expect-error - accessToken is defined in the session object
          session?.user?.accessToken!
        );
        setIsEditing(false);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error("Failed to update post:", error);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    try {
      // @ts-expect-error - accessToken is defined in the session object
      await deletePost(id, session?.user?.accessToken!);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="transform transition duration-300 hover:scale-105">
      <BorderBeam />
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>{author.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{author.email}</p>
              <p className="text-xs text-gray-500">
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {isEditing ? (
            <>
              <input
                className="w-full mb-2 p-2 border rounded"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <RichTextEditor
                content={editedContent}
                onChange={setEditedContent}
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 p-4">
          <div className="flex justify-between items-center w-full">
            {optionsPanel && session?.user?.id === author.id && (
              <>
                <Button variant="ghost" onClick={handleEdit}>
                  {isEditing ? "Save" : <Edit />}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost">
                      <Trash2 color="red" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your post and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="text-red-600 bg-transparent hover:bg-red-600 hover:text-white"
                        onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            <Button variant="ghost" asChild>
              <Link href={`/post/${id}`}>Read more</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
