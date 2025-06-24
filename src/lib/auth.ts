import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        // GitHubProvider({
        //     clientId: process.env.GITHUB_ID,
        //     clientSecret: process.env.GITHUB_SECRET
        // }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
        // }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "john@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await dbConnect();
                // Add logic here to look up the user from the credentials supplied
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missign email or password")
                }
                try {
                    const user = await User.findOne({ email: credentials.email })
                    if (!user) {
                        throw new Error("No user found with this email");
                    }
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if(!isValid){
                        throw new Error("Invalid password")
                    }

                    return{
                        id: user._id.toString(),
                        email: user.email
                    }

                } catch (error) {
                    console.error("Auth error:",error)
                    throw error
                }

            }
        })
    ],
    callbacks: {
        async jwt({token,user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages:{
        signIn: "/login",
        error: "/login",
    },
    session:{
        strategy: "jwt",
        maxAge: 30*24*60*60,
    },
    secret: process.env.NEXTAUTH_SECRET
};