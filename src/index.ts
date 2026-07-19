import {app} from './server.ts';
import {env} from '../env.ts';
//passen port

app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
}); 