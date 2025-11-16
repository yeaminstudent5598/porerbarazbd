import NextAuth from "next-auth";
// ✅ সমাধান: টাইপগুলো ইম্পোর্ট করুন
import { NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserService } from "@/modules/user/user.service";
import UserSchema from "@/modules/user/user.model"; // 'User' নামে কনফ্লিক্ট এড়াতে 'UserSchema' ইম্পোর্ট করছি
import dbConnect from "@/app/lib/dbConnect";
import { signJwtToken } from "@/app/lib/jwt";

// ✅ সমাধান: সম্পূর্ণ কনফিগারেশনটিকে একটি 'export' করা ভ্যারিয়েবলে রাখুন
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        
        await dbConnect();
        
        const user = await UserService.findUserByEmailWithPassword(
          credentials.email
        );
        if (!user) return null;
        
        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, 
        };
      },
    }),
  ],
  callbacks: {
    // ✅ সমাধান: 'token' এবং 'user' এর জন্য টাইপ যোগ করা হয়েছে
    async jwt({ token, user }: { token: JWT, user?: User }) {
      if (user) {
        token.id = user.id;
        // ✅ সমাধান: user এখন টাইপ করা, তাই (as any) লাগবে না
        token.role = user.role; 
      }

      const tokenData = {
        userId: token.id as string,
        role: token.role as string,
      };
      
      token.customAccessToken = signJwtToken(tokenData);
      
      return token;
    },
    // ✅ সমাধান: 'session' এবং 'token' এর জন্য টাইপ যোগ করা হয়েছে
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token && session.user) { // session.user আছে কিনা চেক করা ভালো
        session.user.id = token.id;
        session.user.role = token.role;
        
        // 'session.accessToken' টাইপটি 'next-auth.d.ts' ফাইলে যোগ করতে হবে
        (session as any).accessToken = token.customAccessToken as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      await dbConnect();
      if (account?.provider === "google") {
        const existingUser = await UserSchema.findOne({ email: user.email });
        if (!existingUser) {
          await UserSchema.create({
            name: user.name,
            email: user.email,
            password: "google_oauth_dummy", 
            role: 'user' // Google সাইন-ইন এর জন্য ডিফল্ট 'user' role
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ সমাধান: এক্সপোর্ট করা ভ্যারিয়েবলটি এখানে পাস করা হয়েছে
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };