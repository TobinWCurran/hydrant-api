import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.hydrants));
});

router.get('/:hydrantId', (req, res) => {
    let allHydrants = Object.values(req.context.models.hydrants);
    let foundIndex = allHydrants.findIndex(x => x.hydrantId === req.params.hydrantId);

    return res.send(Object.values(req.context.models.hydrants[foundIndex]));
});

export default router;