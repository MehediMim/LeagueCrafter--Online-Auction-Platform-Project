import express from "express";
import Player from "../models/Player.js";
import Category from "../models/Category.js"
import Team from "../models/Team.js";

import multer from "multer";
import XLSX from "xlsx";



import { faker } from '@faker-js/faker';

const router = express.Router();


const upload = multer({ dest: "uploads/" });
router.post("/upload-xlsx", upload.single("file"), async (req, res) => {
    console.log("📥 Excel Upload Request Received");

    const { auction_id } = req.body;

    if (!auction_id) {
        console.error("❌ Missing auction_id");
        return res.status(400).json({ error: "auction_id is required" });
    }

    if (!req.file) {
        console.error("❌ No file uploaded");
        return res.status(400).json({ error: "Excel file missing" });
    }

    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(`📊 Parsed ${data.length} rows from Excel`);

        for (const entry of data) {
            console.log("➡️ Processing row:", entry);

            const name = entry["Name"];
            const photo_url = entry["photo_url"] || "";
            const rawDob = entry["dob"];
            const role = entry["role"] || "";
            const categoryName = entry["Catergory"]; // typo respected from Excel

            if (!name || !categoryName) {
                console.warn("⚠️ Missing required fields. Skipping.");
                continue;
            }

            // Convert Excel serial date to JS Date
            let dob = null;
            if (rawDob && typeof rawDob === "number") {
                dob = XLSX.SSF.parse_date_code(rawDob);
                dob = new Date(Date.UTC(dob.y, dob.m - 1, dob.d));
            }

            const category = await Category.findOne({ name: categoryName.trim(), auction_id });
            if (!category) {
                console.warn(`⚠️ Category '${categoryName}' not found. Skipping.`);
                continue;
            }

            await Player.create({
                name,
                photo_url,
                dob,
                role,
                category: category._id,
                auction_id,
                team_id: null,
                is_sold: false,
                price: category.base_price,
                stats: {}
            });
        }

        console.log("✅ Excel upload completed.");
        res.json({ message: "✅ Players uploaded successfully." });
    } catch (err) {
        console.error("❌ Upload failed:", err.message);
        res.status(500).json({ error: "Server error during Excel processing" });
    }
});


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

// Get players bought by a team in a specific auction
router.get('/byTeam', async (req, res) => {
    const { team_id, auction_id } = req.query;
    console.log("called++");

    try {
        console.log("called--");
        const players = await Player.find({ team_id, auction_id })
            .populate("category", "name base_price color")
            .sort({ price: -1 }); // Highest price first

        res.json(players);
    } catch (err) {
        console.error("❌ Error fetching team players:", err.message);
        res.status(500).json({ error: "Failed to fetch players" });
    }
});
router.post('/generate-demo', async (req, res) => {
    const { auction_id, count } = req.body;

    if (!auction_id || !count || count <= 0) {
        return res.status(400).json({ error: "auction_id and valid count are required" });
    }

    try {
        const roles = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
        const categories = await Category.find({ auction_id });

        const players = [];

        for (let i = 0; i < count; i++) {
            const randomName = faker.person.fullName(); // ✅ Updated for v8+
            const randomDOB = faker.date.between({ from: '1990-01-01', to: '2010-12-31' });
            const randomPhoto = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
            const randomRole = roles[Math.floor(Math.random() * roles.length)];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];

            const newPlayer = new Player({
                name: randomName,
                dob: randomDOB,
                photo_url: randomPhoto,
                role: randomRole,
                auction_id,
                category: randomCategory?._id || undefined,
                is_sold: false,
            });

            players.push(newPlayer.save());
        }

        await Promise.all(players);

        res.json({ message: `${count} demo players generated.` });
    } catch (error) {
        console.error("❌ Error generating players:", error.message);
        res.status(500).json({ error: "Failed to generate demo players" });
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { team_id } = req.body;

    try {
        const player = await Player.findById(id).populate("category");
        if (!player) return res.status(404).json({ error: "Player not found" });

        if (!team_id) {
            // Unassigning
            const updatedPlayer = await Player.findByIdAndUpdate(id, { team_id: null }, { new: true });
            return res.status(200).json(updatedPlayer);
        }

        const team = await Team.findById(team_id);
        if (!team) return res.status(400).json({ error: 'Invalid team_id' });

        // ✅ Only proceed if player isn't already sold
        if (player.is_sold) {
            return res.status(400).json({ error: "Player already sold. Cannot reassign." });
        }

        const basePrice = player.category?.base_price || 500;

        if (team.budget_remaining < basePrice) {
            return res.status(400).json({ error: "Not enough budget to buy this player." });
        }

        // Deduct and update
        const updatedPlayer = await Player.findByIdAndUpdate(
            id,
            {
                team_id,
                is_sold: true,
                price: basePrice
            },
            { new: true }
        );

        // team.budget_remaining -= basePrice;
        await team.save();

        res.status(200).json(updatedPlayer);
    } catch (err) {
        console.error("❌ Error updating player:", err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;


