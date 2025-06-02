// routes/auctionDetails.js
import express from 'express';
import AuctionDetails from '../models/AuctionDetails.js';

const router = express.Router();

router.post('/setCurrentPlayer', async (req, res) => {
    try {
        console.log("setCurrentPlayer");
        const { auction_id, player_id } = req.body;

        const updated = await AuctionDetails.findOneAndUpdate(
            { auction_id },
            { current_player: player_id, updated_at: new Date() },
            { upsert: true, new: true }
        ).populate("current_player");
        // console.log(updated);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to set current player' });
    }
});

router.get('/getCurrentPlayer', async (req, res) => {
    try {
        console.log("GetCurrentPlayer");
        const { auction_id } = req.query;

        const details = await AuctionDetails.findOne({ auction_id })
            .populate({
                path: "current_player",
                populate: { path: "category" }
            });

        res.json(details?.current_player || null);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get current player' });
    }
});

export default router;
