// routes/auctionDetails.js
import express from 'express';
import AuctionDetails from '../models/AuctionDetails.js';

const router = express.Router();

// ✅ Set current player with category populated
router.post('/setCurrentPlayer', async (req, res) => {
    try {
        console.log("setCurrentPlayer");
        const { auction_id, player_id } = req.body;

        const updated = await AuctionDetails.findOneAndUpdate(
            { auction_id },
            { current_player: player_id, updated_at: new Date() },
            { upsert: true, new: true }
        ).populate({
            path: "current_player",
            populate: { path: "category" }  // ✅ Populate category inside player
        });

        res.json(updated);
    } catch (error) {
        console.error("❌ Error in setCurrentPlayer:", error.message);
        res.status(500).json({ error: 'Failed to set current player' });
    }
});

// ✅ Get current player with category populated
router.get('/getCurrentPlayer', async (req, res) => {
    try {
        console.log("GetCurrentPlayer");
        const { auction_id } = req.query;

        const details = await AuctionDetails.findOne({ auction_id }).populate({
            path: "current_player",
            populate: { path: "category" }  // ✅ Populate category inside player
        });

        res.json(details?.current_player || null);
    } catch (error) {
        console.error("❌ Error in getCurrentPlayer:", error.message);
        res.status(500).json({ error: 'Failed to get current player' });
    }
});

export default router;
