import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("email or password not found");
        }
        await connectDB();
        const existUser = await User.findOne({ email });
        if (!existUser) {
          throw new Error("User not found");
        }
        const isMatchPassword = await bcrypt.compare(
          password,
          existUser.password,
        );
        if (!isMatchPassword) {
          throw new Error("incorrect password");
        }
        return {
          id: existUser._id,
          name: existUser.username,
          email: existUser.email,
          image: existUser.image,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000, // 10s — default 3500ms often times out on slow networks
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider == "google") {
        await connectDB();
        if (!user.email) {
          throw new Error("No email from OAuth provider");
        }
        let existUser = await User.findOne({ email: user.email });
        if (!existUser) {
          existUser = await User.create({
            username: user.name,
            email: user?.email,
            image: user.image,
          });
        }
        user.id = existUser._id as string;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;