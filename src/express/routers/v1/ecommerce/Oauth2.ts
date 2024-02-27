import express from 'express'
const router = express.Router()

router.get('/', async(req,res) => {
    res.json({code: 200, msg: "Oauth2 API"})
})

export default router