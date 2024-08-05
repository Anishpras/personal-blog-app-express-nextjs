export interface User {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    email: string;
  };
  createdAt: string;
}

export interface Session {
  user: User;
  accessToken: string;
}
