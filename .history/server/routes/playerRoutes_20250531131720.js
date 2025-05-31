import express from "express";
import Player from "../models/Player.js";
import Category from "../models/Category.js"
const router = express.Router();

// Add new player
router.post("/add", async (req, res) => {
    console.log("📩 Add player request received");
    try {
        const {
            name,
            photo_url,
            auction_id,
            category,
            role,
            dob,
            price,
            is_sold,
            stat
        } = req.body;

        const newPlayer = new Player({
            name,
            photo_url,
            auction_id,
            category,
            role,
            dob,
            price,
            is_sold,
            stat
        });

        const savedPlayer = await newPlayer.save();
        console.log("✅ Player saved");
        res.status(201).json(savedPlayer);
    } catch (err) {
        console.error("❌ Error saving player:", err.message);
        res.status(500).json({ error: "Failed to add player" });
    }
});

// Optionally: Get players by auction
router.get("/get", async (req, res) => {
    try {
        
        const filter = {};
        if (req.query.auction_id) {
            filter.auction_id = req.query.auction_id;
        }

        const players = await Player.find({ auction_id: req.query.auction_id })
            .populate('category'); 
        // console.log(category);
        res.status(200).json(players);
    } catch (err) {
        console.error("❌ Error fetching players:", err.message);
        res.status(500).json({ error: "Failed to fetch players" });
    }
});

export default router;
