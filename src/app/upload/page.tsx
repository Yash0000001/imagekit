"use client";

import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-black">
      <div className="max-w-2xl mx-auto">
        <VideoUploadForm />
      </div>
    </div>
  );
}