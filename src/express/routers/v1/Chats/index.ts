import prisma from "../../../../utils/databases/prisma";
import functions from "../../../../utils/functions";
import express from "express";
const router = express.Router();

router.put("/", async (req, res) => {
    switch (req.body.type) {
        case 'user':
            if (!req.body.user_id) return res.json({code: 200, msgCode: 'a-c-400'});
            const chat_id = functions.system.createSnowflakeId();
            await prisma.chats.create({
                data: {
                    id: chat_id,
                    create_at: String(Date.now()),
                    type: req.body.type
                }
            });
            return res.json({code: 200, msgCode: 'a-c-200', chat_id});
            break
        case 'group':
            if (!req.body.name) return res.json({code: 200, msgCode: 'a-c-400'});
            
            break
        default:
            return res.json({code: 200, msgCode: 'a-c-400'});
    }
})

export default router;