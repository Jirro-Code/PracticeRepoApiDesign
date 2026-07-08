import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import habitRoutes from './routes/habitRoutes.ts';

const app = express();
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);

app.get(`/health`, (req, res) => {
    res.send(`<button>`);
});

app.post(`/cake/:name/:sid`, (req, res) => {
    res.json(req.params);
});



export {app};
export default app;