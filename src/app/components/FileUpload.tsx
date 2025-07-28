"use client"

import { upload } from "@imagekit/next";
import { useState } from "react";
import { UploadResponse } from "./VideoUploadForm";

interface FileUploadProps {
    onSuccess: (res: UploadResponse) => void
    onProgress: (progress: number) => void
    fileType?: "image" | "video"
}


const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
}: FileUploadProps) => {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("please upload a valid video file")
                return false;
            }
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("file size must be less than 100 MB")
            return false;
        }
        return true;
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !validateFile(file)) return

        setUploading(true)
        setError(null)

        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const auth = await authRes.json();
            console.log(auth);
            const res = await upload({
                expire: auth.authenticationParameters.expire,
                token: auth.authenticationParameters.token,
                signature: auth.authenticationParameters.signature,
                publicKey: auth.publicKey,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent))
                    }
                },
            });
            onSuccess({
                url: res.url || "No url",
                filePath: res.filePath || res.fileId || "", // fallback if filePath is missing
            });

        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false)
        }
    }
    return (
        <>
            <input title="upload video" type="file" accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange} className=" text-white" />
            {uploading && (
                <span className="text-white">Loading...</span>
            )}
            {error && (
                <span className="text-white">{error}</span>
            )}
        </>
    );
};

export default FileUpload;