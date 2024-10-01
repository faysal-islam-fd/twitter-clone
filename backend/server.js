import express, { urlencoded } from 'express';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongoDB.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cors())
app.use(cookieParser())
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectMongoDB();
});