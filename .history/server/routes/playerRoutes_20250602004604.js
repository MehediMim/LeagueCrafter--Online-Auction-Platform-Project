import express from "express";
import Player from "../models/Player.js";
import Category from "../models/Category.js"
import Team from "../models/Team.js";

import { faker } from '@faker-js/faker';

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

router.get('/maxSafeBid', async (req, res) => {
    const { auction_id, team_id } = req.query;

    try {
        const team = await Team.findById(team_id);
        if (!team) return res.status(404).json({ error: "Team not found" });

        const players = await Player.find({ team_id, is_sold: true }).populate("category");
        const categories = await Category.find({ auction_id });

        // Count players bought per category
        const categoryCounts = {};
        for (const player of players) {
            const cat = player.category?.name;
            if (!cat) continue;
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }

        // Get fixed requirements & base prices
        const requiredPerCategory = {};
        const basePricePerCategory = {};
        for (const cat of categories) {
            requiredPerCategory[cat.name] = cat.min_players;     // Treat as exact required
            basePricePerCategory[cat.name] = cat.base_price;
        }

        // Reserve exact amount needed to fulfill remaining required slots
        let totalReserved = 0;
        const breakdown = {};
        for (const [cat, required] of Object.entries(requiredPerCategory)) {
            const bought = categoryCounts[cat] || 0;
            const remaining = Math.max(required - bought, 0);
            const price = basePricePerCategory[cat] || 500;
            breakdown[cat] = { remaining, price_per_player: price };
            totalReserved += remaining * price;
        }

        const safeMaxBid = Math.max(0, team.budget_remaining - totalReserved);

        return res.status(200).json({
            team: team.name,
            budget_remaining: team.budget_remaining,
            reserved_for_categories: totalReserved,
            category_breakdown: breakdown,
            maxSafeBid: safeMaxBid
        });
    } catch (err) {
        console.error("❌ Error calculating max safe bid:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default router;
