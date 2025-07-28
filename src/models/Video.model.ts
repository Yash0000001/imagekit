import mongoose, { Schema, model, models } from "mongoose";

export const Video_Dimensions = {
    width: 1080,
    height: 1920,
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformations?: {
        height: number;
        width: number;
        quality?: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        controls: { type: Boolean, required: true, default: true },
        transformations: {
            height: { type: Number, default: Video_Dimensions.height },
            width: { type: Number, default: Video_Dimensions.width },
            quality: { type: Number, min: 1, max: 100 },
        },
    },
    {
        timestamps: true,
    }
);

// Optional index for text search
videoSchema.index({ title: "text", description: "text" });

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
