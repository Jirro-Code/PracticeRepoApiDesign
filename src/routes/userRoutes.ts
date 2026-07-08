import {Router} from 'express';

const router = Router();

router.get(`/`, (req, res) => {
    res.json({message: `Here is the user route`});
});

router.get(`/:id`, (req, res) => {
    res.json({message: `Here is the user route with id ${req.params.id}`});
});

router.put(`/:id`, (req, res) => {
    res.json({message: `User with id ${req.params.id} updated successfully`});
});

router.delete(`/:id`, (req, res) => {
    res.json({message: `User with id ${req.params.id} deleted successfully`});
});

export {router};
export default router;