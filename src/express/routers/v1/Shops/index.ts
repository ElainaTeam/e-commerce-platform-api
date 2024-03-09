import express from 'express'
const router = express.Router()

router.put('/', async(req,res) => {
    res.json({code: 200, msg: "Shop API"})
})

export default router