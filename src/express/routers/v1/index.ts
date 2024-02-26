import express, {Router} from 'express'
const router = express.Router();
router.use('/test', require('./test'));

module.exports = router;