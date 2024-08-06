import { Suspense } from "react";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import HomePageClient from "@/components/molecules/HomePageClient";
import { getPosts, getAuthors } from "@/lib/api";
import ErrorFallback from "@/components/ErrorFallback";
import { Loading } from "@/components/Loading";

export default async function Page() {
  return (
    <ClientErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loading />}>
        <HomePage />
      </Suspense>
    </ClientErrorBoundary>
  );
}

async function HomePage() {
  const posts = await getPosts();
  const authors = await getAuthors();
  return <HomePageClient initialPosts={posts} initialAuthors={authors} />;
}
