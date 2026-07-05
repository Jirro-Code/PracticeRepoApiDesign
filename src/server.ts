import express from 'express';

const app = express();

app.get(`/health`, (req, res) => {
    res.send(`<button>`);
});

export {app};
export default app;