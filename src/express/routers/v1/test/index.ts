import express from "express";
const app = express();
export const router = express.Router();

app.get('/', (req,res) => {
    res.send("Ok")
})