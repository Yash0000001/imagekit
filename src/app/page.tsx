"use client";

import VideoFeed from "./components/VideoFeed";
import { useEffect, useState } from "react";
import { IVideo } from "@/models/Video.model";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [videoFeed, setVideoFeed] = useState<IVideo[]>([]);
  const { push } = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/video");
        const videos = await res.json();
        setVideoFeed(videos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Naughty Utkarsh Tower</h2>
          {status === "loading" ? (
            <p>Loading...</p>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => push("/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 ">
        <VideoFeed videos={videoFeed} />
      </main>
      <div
        onClick={() => push("/upload")}
        className="w-14 h-14 fixed right-6 bottom-6 rounded-full bg-amber-400 text-4xl flex items-center justify-center shadow-lg hover:bg-amber-500 transition cursor-pointer"
      >
        +
      </div>
    </div>
  );
}
