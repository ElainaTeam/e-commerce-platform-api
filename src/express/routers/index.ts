import {Router} from 'express'
import App from '../../index'
import v1 from './v1'
const router = Router();

//Router Use Handle
router.use('/v1', v1);

export default router