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

export default router;
