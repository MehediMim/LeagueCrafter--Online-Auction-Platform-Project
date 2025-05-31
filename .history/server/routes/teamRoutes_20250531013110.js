import express from "express";
import Team from "../models/Team.js"
const router = express.Router();

router.post("/add", async (req, res) => {
    console.log("hi from team/adds");
    try {
        const team = new Team({
            ...req.body,
            tier_summary: new Map(Object.entries(req.body.tier_summary))
        });
        await team.save();

        console.log("team saved");
        res.status(201).json(savedCategory);
    } catch (err) {
        console.log("error saving Teams");
    }
});

router.get("/get", async (req, res) => {
    console.log("trying to get All teams");
    try {
        const filter = {};

        if (req.query.auction_id) {
            filter.auction_id = req.query.auction_id;
        }

        const teams = await Team.find(filter).sort({ createdAt: -1 }); // latest first
        res.status(200).json(teams);
    } catch (err) {
        console.error("❌ Error fetching teams:", err.message);
        res.status(500).json({ error: "Failed to fetch teams" });
    }
});


export default router;
