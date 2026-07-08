import {Router} from 'express';

const router = Router();

router.get(`/`, (req, res) => {
    res.json({message: `Here is the habit route`});
});

router.get(`/:id`, (req, res) => {
    res.json({message: `Here is the habit route with id ${req.params.id}`});
});

router.post(`/`, (req, res) => {
    res.json({message: `Habit created successfully`});
});

router.delete(`/:id`, (req, res) => {
    res.json({message: `Habit with id ${req.params.id} deleted successfully`});
});

router.post(`/:id/complete`, (req, res) => {
    res.json({message: `Habit with id ${req.params.id} marked as complete`});
});

export {router};
export default router;