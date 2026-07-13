import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import habitRoutes from './routes/habitRoutes.ts';
//cors is a middleware that allows cross origin requests. It is used to allow the frontend to make requests to the backend from a different origin.
import cors from 'cors';
//morgan is a middleware that logs requests to the console. It is used for debugging purposes. Shows the stutus code and other information of the request.
import morgan from 'morgan';
//helmet is a middleware that helps secure the app by setting various HTTP headers.
import helmet from 'helmet';
import { isTest } from '../env.ts';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(morgan(`dev`, {
    skip: () => isTest(),
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

//frontend connection to backend
app.get(`/`, (req, res) => {
    res.sendFile(process.cwd() + `/public/index.html`)
});

app.get(`/health`, (req, res) => {
    res.send(`<button>`);
});

app.post(`/cake/:name/:sid`, (req, res) => {
    res.json(req.params);
});

export {app};
export default app;