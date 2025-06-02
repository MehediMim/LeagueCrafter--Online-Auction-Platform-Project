import express from 'express';
import Bid from '../models/Bid.js';

const router = express.Router();

// Place a new bid
router.post('/place', async (req, res) => {
    const { auction_id, player_id, team_id, price } = req.body;

    if (!auction_id || !player_id || !team_id || !price) {
        return res.status(400).json({ error: "Missing fields in bid request" });
    }

    try {
        const newBid = new Bid({
            auction_id,
            player_id,
            team_id,
            price
        });

        await newBid.save();
        res.status(200).json({ message: "Bid placed successfully", bid: newBid });
    } catch (err) {
        console.error("❌ Error placing bid:", err.message);
        res.status(500).json({ error: "Failed to place bid" });
    }
});

// Get all bids for a specific player in an auction
router.get('/playerBids', async (req, res) => {
    const { auction_id, player_id } = req.query;

    try {
        const bids = await Bid.find({ auction_id, player_id })
            .populate('team_id', 'name color_code')
            .sort({ price: -1, timestamp: 1 }); // highest first
        res.json(bids);
    } catch (err) {
        console.error("❌ Error fetching bids:", err.message);
        res.status(500).json({ error: "Failed to fetch bids" });
    }
});

export default router;
