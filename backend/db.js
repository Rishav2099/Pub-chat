const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI
    if (!mongoURI) {
      throw new Error('MongoDB URI not defined in environment variables');
    }
    await mongoose.connect(mongoURI, {
     
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
