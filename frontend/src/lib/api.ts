import { Post, UserWithToken } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log(API_URL);

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
}

export async function getPosts(): Promise<Post[]> {
  return fetchAPI("/posts");
}

export async function getPostById(id: string): Promise<Post> {
  return fetchAPI(`/posts/${id}`);
}

export async function createPost(
  title: string,
  content: string,
  authorId: string,
  token: string
): Promise<Post> {
  return fetchAPI("/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, authorId }),
  });
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  return fetchAPI(`/posts?author=${userId}`);
}

export async function login(
  email: string,
  password: string
): Promise<UserWithToken> {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signUp(
  email: string,
  password: string
): Promise<{
  message: string;
}> {
  return fetchAPI("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
