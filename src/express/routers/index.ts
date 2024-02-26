import express, {Router} from 'express'
const router = express.Router();


router.get('/', async (req, res) => {
    return res.status(200).json({code: 200, msg: '✌️'})
});
router.use('/v1', require('./v1'));

module.exports = router;