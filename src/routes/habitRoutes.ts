import {Router} from 'express';
import { validateBody, validateQuery, validateParams} from '../middleware/validation.ts';
import {z} from 'zod';
import {authenticateToken} from '../middleware/auth.ts';
import { createHabit, getUserHabits, updateHabit } from '../controllers/habitController.ts';

const createHabitSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    frequency: z.string(),
    targetCount: z.number(),
    tagIds: z.array(z.string()).optional()
});

const completeParams = z.object({
    id: z.string().length(36, {message: "Invalid habit id"})
})
const router = Router();

router.use(authenticateToken);

router.get(`/`, getUserHabits);

router.patch(`/:id`, validateParams(completeParams), updateHabit);

router.get(`/:id`, (req, res) => {
    res.json({message: `Here is the habit route with id ${req.params.id}`});
});

router.post(`/`, validateBody(createHabitSchema), createHabit);

router.delete(`/:id`, (req, res) => {
    res.json({message: `Habit with id ${req.params.id} deleted successfully`});
});

router.post(`/:id/complete`, validateParams(completeParams), validateBody(createHabitSchema), (req, res) => {
    res.json({message: `Habit with id ${req.params.id} marked as complete`});
});

export {router};
export default router;