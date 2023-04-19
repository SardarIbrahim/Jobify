import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';

// other middlwares : express + packages
const app = express();
dotenv.config();
app.use(express.json());

// middlwares
import notFoundMiddleware from './middlewares/notFound.js';
import errorMiddleware from './middlewares/error.js';
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRouter.js';
import jobsRouter from './routes/jobsRouter.js';

const PORT = process.env.PORT || 8000;

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

// error and notFound-route middlwares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// start the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    app.listen(PORT, () => {
      console.log('server is up');
    });
  } catch (error) {
    console.log(error);
  }
};

start();
