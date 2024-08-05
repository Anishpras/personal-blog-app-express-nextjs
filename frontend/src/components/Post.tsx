import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PostProps {
  id: string;
  title: string;
  content: string;
  author: {
    email: string;
  };
}

export function Post({ id, title, content, author }: PostProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-2">By {author.email}</p>
        <p className="text-gray-700">{content.substring(0, 100)}...</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/post/${id}`}>Read more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
