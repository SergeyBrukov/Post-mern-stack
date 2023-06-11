import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/auth.js';
import changeMeRoute from './routes/changeMe.js';
import postRoute from './routes/post.js';
import commentRoute from './routes/comment.js';
import testRoute from './routes/testRoute.js';
import fileUpload from 'express-fileupload';

const app = express();
dotenv.config();

//Constants
const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
//Midlware
app.use(cors());
app.use(fileUpload());
app.use(express.json({ limit: '50 mb' }));
app.use(express.static('uploads'));

app.use('/api/auth', authRoute);

app.use('/change-me-data', changeMeRoute);

app.use('/post', postRoute);

app.use('/comment', commentRoute);

app.use('/test', testRoute);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.tkpbz1s.mongodb.net/?retryWrites=true&w=majority`,
    );
    app.listen(PORT, () => console.log(`Post start ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
