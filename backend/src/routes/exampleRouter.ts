import { Router } from 'express';
import { exemploController } from '../controllers/exampleController';
import { exemploMiddleware } from '../middlewares/exempleMiddleware';

const router = Router();

router.get('/exemplo',exemploMiddleware, exemploController.getExemplo);

export default router;