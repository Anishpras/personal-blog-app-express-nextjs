import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login, signUp } from "@/lib/api";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" },
      },

      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          if (credentials.action === "signup") {
            const signUpResponse = await signUp(
              credentials.email,
              credentials.password
            );

            if (signUpResponse.message === "User created successfully") {
              const loggedInUser = await login(
                credentials.email,
                credentials.password
              );

              return {
                id: loggedInUser.user.id,
                email: loggedInUser.user.email,
                accessToken: loggedInUser.token,
              };
            }
            return null;
          } else {
            const loggedInUser = await login(
              credentials.email,
              credentials.password
            );
            return {
              id: loggedInUser.user.id,
              email: loggedInUser.user.email,
              accessToken: loggedInUser.token,
            };
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          email: token.email as string,
          accessToken: token.accessToken as string,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
