"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";

export type UploadResponse = {
  url: string;
  filePath: string;
};

export default function UploadVideoPage() {
    const router = useRouter();
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [controls, setControls] = useState(true);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");



    const handleUploadSuccess = (res: UploadResponse) => {
        const url = res.url;
        setVideoUrl(url);

        // Auto-generate thumbnail from video using ImageKit transformation (1st frame)
        const thumb = `${process.env.NEXT_PUBLIC_URL_ENDPOINT}/${res.filePath}?tr=w-300,so-2,fo-auto`;
        setThumbnailUrl(thumb);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description) {
            setError("All fields are required.");
            return;
        }

        try {
            const res = await fetch("/api/video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    videoUrl,
                    thumbnailUrl,
                    controls,
                    transformations: {
                        height: 1920,
                        width: 1080,
                    },
                }),
            });

            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message || "Failed to upload video metadata");
            }

            setSuccess("Video uploaded and saved successfully!");
            setTimeout(() => router.push("/"), 1500);
        } catch (err) {
            console.error(err);
            // setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 border-2 rounded-xl border-white">
            <h1 className="text-2xl font-bold mb-4 text-white text-center">Upload Video</h1>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center justify-center">
                <div className="w-full">
                    <label className="block font-medium text-white">Title</label>
                    <input
                        title="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border p-2 rounded bg-gray-200"
                    />
                </div>

                <div className="w-full">
                    <label className="block font-medium text-white">Description</label>
                    <textarea
                        title="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full border p-2 rounded bg-gray-200"
                    />
                </div>

                <div>
                    <label className="block font-medium text-white mb-2">Upload Video</label>
                    <FileUpload
                        onSuccess={handleUploadSuccess}
                        onProgress={setProgress}
                        fileType="video"
                    />
                    <progress className="w-full mt-2 bg-gray-200" value={progress} max={100} />
                </div>
                {progress > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                        <progress className="w-full" value={progress} max={100} />
                        <span className="text-sm font-medium w-12 text-right">{progress}%</span>
                    </div>
                )}

                {progress > 0 && progress < 100 && (
                    <p className="text-sm text-blue-600">Uploading: {progress}%</p>
                )}

                <div>
                    <label className="inline-flex items-center gap-2 text-white">
                        <input
                            type="checkbox"
                            checked={controls}
                            onChange={(e) => setControls(e.target.checked)}
                            className="text-white"
                        />
                        Show controls
                    </label>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Submit
                </button>

                {success && <p className="text-green-600">{success}</p>}
                {error && <p className="text-red-600">{error}</p>}
            </form>
        </div>
    );
}