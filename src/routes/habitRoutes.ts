import {Router} from 'express';
import { validateBody, validateQuery, validateParams} from '../middleware/validation.ts';
import {z} from 'zod';
import {authenticateToken} from '../middleware/auth.ts';

const createHabitSchema = z.object({
    name: z.string()
});

const completeParams = z.object({
    id: z.string().length(4)
})
const router = Router();

router.use(authenticateToken);

router.get(`/`, (req, res) => {
    res.json({message: `Here is the habit route`});
});

router.get(`/:id`, (req, res) => {
    res.json({message: `Here is the habit route with id ${req.params.id}`});
});

router.post(`/`, validateBody(createHabitSchema), (req, res) => {
    res.json({message: `Habit created successfully`}).status(201);
});

router.delete(`/:id`, (req, res) => {
    res.json({message: `Habit with id ${req.params.id} deleted successfully`});
});

router.post(`/:id/complete`, validateParams(completeParams), validateBody(createHabitSchema), (req, res) => {
    res.json({message: `Habit with id ${req.params.id} marked as complete`});
});

export {router};
export default router;