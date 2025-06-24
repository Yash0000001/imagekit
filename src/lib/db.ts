import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error("Please define mongodb_uri in env variables")
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = {
        conn: null, promise: null
    }
}

export async function dbConnect () {
    if(cached.conn){
        console.log("Already connected to database")
        return cached.conn
    }
    if(!cached.promise){
        const options = {
            bufferCommands: true,
            maxPoolSize: 10
        }
        mongoose
        .connect(MONGODB_URI, options)
        .then(()=> mongoose.connection) 
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }

    return cached.conn
}