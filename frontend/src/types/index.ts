export interface User {
  id: string;
  email: string;
}

export interface UserWithToken {
  user: User;
  token: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    };
    expires: string;
  }

  interface User {
    id: string;
    email: string;
    accessToken: string;
  }
}
