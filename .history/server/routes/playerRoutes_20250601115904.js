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
            category, // still coming as "Silver"
            role,
            dob,
            price,
            is_sold,
            stat
        } = req.body;

        // 🔁 Convert category name ("Silver") to category _id
        const categoryDoc = await Category.findOne({ name: category, auction_id });

        if (!categoryDoc) {
            return res.status(400).json({ error: `Category '${category}' not found.` });
        }

        const newPlayer = new Player({
            name,
            photo_url,
            auction_id,
            category: categoryDoc._id, // ✅ Use ObjectId
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
        // console.log(players);
        res.status(200).json(players);
    } catch (err) {
        console.error("❌ Error fetching players:", err.message);
        res.status(500).json({ error: "Failed to fetch players" });
    }
});
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
        if (!deletedPlayer) {
            return res.status(404).json({ error: "Player not found" });
        }
        console.log("🗑️ Player deleted:", deletedPlayer.name);
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting player:", err.message);
        res.status(500).json({ error: "Failed to delete player" });
    }
});


export default router;
