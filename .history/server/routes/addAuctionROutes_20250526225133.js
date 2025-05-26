import express from "express";
import Auction from "../models/Auction.js";

const router = express.Router();

router.post('/add',async (req,res)=>{
    console.log("hi from /addauction/add");
    console.log(req.body);
    try {
        const auction = new Auction(req.body);
        const saved = await auction.save();
        res.status(201).json(saved);
        console.log("Saved");
    } catch (error) {
        console.log("-----------------");
        res.status(400).json({error : error.message});
    }
})

router.get('/find',async (req,res)=>{
    console.log("hi from /addauction/find");
    try {
        const filter={};
        if(req.query.creator_id){
            filter.creator_id=req.query.creator_id;
        }
        const auctions=await Auction.find(filter);
        res.json(auctions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

})

export default router;
