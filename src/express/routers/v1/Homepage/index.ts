import prisma from "./../../../../utils/databases/prisma";
import functions from "./../../../../utils/functions";
import express from "express";
const router = express.Router();
router.get("/partners", async (req, res) => {
    const partners = await prisma.partners.findMany();
    return res.json({code: 200, msgCode: 'a-h-200', partners});
})
router.get("/newfeed", async (req, res) => {
	const products = await prisma.products.findMany({
        select: {
            id: true,
            shop_id: true,
            short_description: true,
            long_description: true,
            price: true,
            icon_name: true,
            banner_name: true,
            images: true
        }
    });
	const shops = await prisma.shops.findMany({
        select: {
            id: true,
            name: true,
            short_description: true,
            long_description: true,
            icon_name: true,
            banner_name: true
        }
    });
});

export default router;