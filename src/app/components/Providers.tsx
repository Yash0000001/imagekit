"use client"

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

const urlendPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider refetchInterval={5 * 60}>
           <ImageKitProvider urlEndpoint={urlendPoint}>{children}</ImageKitProvider> 
        </SessionProvider>
    )
}