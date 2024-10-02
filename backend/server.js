import express, { urlencoded } from 'express';
import connectMongoDB from './db/connectMongoDB.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js'; 
import postRoutes from './routes/post.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { v2 as cloudinary } from 'cloudinary';
import  'dotenv/config';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET    

})

const app = express();
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cors())

app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(PORT);
    
    connectMongoDB();
});