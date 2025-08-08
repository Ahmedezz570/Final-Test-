const mongoose = require('mongoose');
url = "mongodb+srv://ahmedez570:7253416@cluster.bxlgmut.mongodb.net/?retryWrites=true&w=majority";
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1); 
  }
};

module.exports = connectDB;