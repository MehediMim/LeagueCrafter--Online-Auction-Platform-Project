import express from "express";
const router = express.Router();
import Auction from "../models/Auction.js";
const app= express();

app.use(express.json());

app.post('/add',async (req,res)=>{
    console.log("hi from /addauction/add");
    try {
        const auction = new Auction(req.body);
        const saved = await auction.save();
        res.status(201).json(saved);
    } catch (error) {
        console.log("-----------------");
        res.status(400).json({error : error.message});
    }
})

export default router;
