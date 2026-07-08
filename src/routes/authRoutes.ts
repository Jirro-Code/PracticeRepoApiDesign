import {Router} from 'express';

const router = Router();


router.post(`/signin`, (req, res) => {
    res.status(201).json({message: `Signed up successful`});
});

router.post(`/login`, (req, res) => {
    res.status(201).json({message: `Login successful`});
});

export {router};
export default router;