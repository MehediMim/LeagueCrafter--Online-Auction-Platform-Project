import express from "express";
import Team from "../models/Team.js"
const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        console.log("hi from team/adds");
        console.log(req.body);
        const savedTeam = await Team.save();
        console.log("team saved");
        res.status(201).json(savedCategory);
    } catch (err) {
        console.log("error saving Teams");
    }
});

export default router;
