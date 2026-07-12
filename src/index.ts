import {app} from './server.ts';
import {env} from '../env.ts';
//passen port

app.get(`/`, (req, res) => {
    res.sendFile(process.cwd() + `/frontend/index.html`)
});

app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
});