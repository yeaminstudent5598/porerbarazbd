import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserService } from "@/modules/user/user.service";
import User from "@/modules/user/user.model";
import dbConnect from "@/app/lib/dbConnect";
import { signJwtToken } from "@/app/lib/jwt"; // <-- ১. আপনার কাস্টম JWT সাইনার ইম্পোর্ট করুন

const handler = NextAuth({
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
        
        await dbConnect(); // <-- ২. ডিবি কানেক্ট এখানেও কল করা ভালো
        
        const user = await UserService.findUserByEmailWithPassword(
          credentials.email
        );
        if (!user) return null;
        
        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) return null;

        // <-- ৩. authorize থেকে role সহ পুরো ইউজার অবজেক্ট রিটার্ন করুন
        // (নিশ্চিত করুন আপনার User মডেলে 'role' আছে)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // <-- role এখানে থাকা জরুরি
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 'user' অবজেক্টটি শুধু প্রথমবার লগইনের সময় পাওয়া যায়
      if (user) {
        token.id = user.id;
        token.role = (user as any).role; // <-- ৪. টোকেনে role যোগ করুন
      }

      // <-- ৫. আপনার কাস্টম অ্যাক্সেস টোকেন তৈরি করুন (মিডলওয়্যারের জন্য)
      const tokenData = {
        userId: token.id as string,
        role: token.role as string,
      };
      
      // app/lib/jwt.ts এর ফাংশন দিয়ে সাইন করা হচ্ছে
      token.customAccessToken = signJwtToken(tokenData);
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // <-- ৬. সেশনে role যোগ করুন
        
        // <-- ৭. কাস্টম টোকেনটি সেশনে যোগ করুন (ফ্রন্টএন্ডে ব্যবহারের জন্য)
        session.accessToken = token.customAccessToken as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      await dbConnect();
      if (account?.provider === "google") {
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            password: "google_oauth_dummy", 
            // এখানেও role: 'user' সেট করে দেওয়া ভালো
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
});

export { handler as GET, handler as POST };