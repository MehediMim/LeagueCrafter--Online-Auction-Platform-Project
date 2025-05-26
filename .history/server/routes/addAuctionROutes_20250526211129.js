import express from "express";
import Auction from "../models/Auction.js";

const router = express.Router();

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
