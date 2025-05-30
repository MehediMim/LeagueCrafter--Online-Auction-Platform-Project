import express from "express";
import Auction from "../models/Auction.js";

const router = express.Router();

router.post('/add', async (req, res) => {
    console.log("hi from /addauction/add");
    console.log(req.body);
    try {
        const auction = new Auction(req.body);
        const saved = await auction.save();
        res.status(201).json(saved);
        console.log("Saved");
    } catch (error) {
        console.log("-----------------");
        res.status(400).json({ error: error.message });
    }
})

router.get('/find', async (req, res) => {
    console.log("hi from /addauction/find");
    try {
        const filter = {};
        if (req.query.creator_id) {
            filter.creator_id = req.query.creator_id;
        }
        const auctions = await Auction.find(filter);
        res.json(auctions);
        console.log(auctions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    console.log("hi from /addauction/delete");
    try {
        const deleted = await Auction.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Auction not found" });
        console.log("Deleted");
        res.status(200).json({ message: "Auction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;
