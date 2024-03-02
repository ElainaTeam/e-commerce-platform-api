import express, {Router} from 'express'
import User from './User'
import Product from './Product'
import NewsFeed from './NewsFeed'
import Admin from './Admin'
import Payment from './Payment'
import Oauth2 from './Oauth2'
import Auth from './Auth'
const router = express.Router();

//Router Use Handle
router.get('/', async (req, res) => {
    return res.status(200).json({code: 200, state: '🟢 Online'})
});
router.use('/user', User);
router.use('/product', Product)
router.use('/newsfeed', NewsFeed)
router.use('/admin', Admin)
router.use('/payment', Payment)
router.use('/oauth2', Oauth2)
router.use('/auth', Auth)

export default router