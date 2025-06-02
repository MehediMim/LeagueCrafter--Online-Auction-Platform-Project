import express from "express";
import Team from "../models/Team.js"
import Player from "../models/Player.js";
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

router.get('/remainingBudgets', async (req, res) => {
    // console.log("Rea");
    const { auction_id } = req.query;
    if (!auction_id) return res.status(400).json({ error: "auction_id required" });

    try {
        const teams = await Team.find({ auction_id });

        const players = await Player.find({ auction_id, is_sold: true });

        const spent = {};
        players.forEach(p => {
            if (!spent[p.team_id]) spent[p.team_id] = 0;
            spent[p.team_id] += p.price;
        });

        const result = teams.map(team => {
            const spentAmount = spent[team._id] || 0;
            return {
                _id: team._id,
                name: team.name,
                color_code: team.color_code,
                remaining: team.budget_remaining - spentAmount
            };
        });

        res.json(result);
    } catch (err) {
        console.error("❌ Error fetching team budgets:", err.message);
        res.status(500).json({ error: "Server error fetching budgets" });
    }
});


export default router;
