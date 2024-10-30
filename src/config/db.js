import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}roxiler_assignment`);
    //process.env.MONGO_URI = mongodb+srv://root:Pranay%4029@cluster0.z1q35.mongodb.net/
    // I am aware that exposing database links or any other secret API keys is unprofessional and can lead to security issues but I have written this for your easy access
    
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
