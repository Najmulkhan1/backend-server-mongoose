// src/lib/mongoose.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // .env ফাইলের নামের সাথে হুবহু মিলতে হবে
    const uri = process.env.MONGODB_URI; 

    // uri undefined হলে আগেই এরর থ্রো করবে
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in the .env file!");
    }

    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB!');
    
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};