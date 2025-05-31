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
        res.status(200).json("successfully Team Added");
    } catch (err) {
        console.log("error saving Teams");
    }
});

router.get("/get", async (req, res) => {
    console.log("trying to get All teams",req.query.auction_id);
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

router.delete("/delete/:id", async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Team deleted successfully" });
    } catch (err) {
        console.error("Error deleting team:", err.message);
        res.status(500).json({ error: "Failed to delete team" });
    }
});


export default router;
