import mongoose from 'mongoose';

// enforcing queries to execute on mongoDB
mongoose.set('strictQuery', false);

const connectDB = (url) => {
  return mongoose.connect(url);
};

export default connectDB;
