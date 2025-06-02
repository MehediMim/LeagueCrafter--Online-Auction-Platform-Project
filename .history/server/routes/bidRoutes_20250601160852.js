import express from 'express';
import Bid from '../models/Bid.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import Auction from '../models/Auction.js';
const router = express.Router();

// Place a new bid
// Place a new bid
// Place a new bid
import Category from '../models/Category.js'; // Make sure to import this if not yet

router.post('/place', async (req, res) => {
    const { auction_id, player_id, team_id, price } = req.body;

    if (!auction_id || !player_id || !team_id || !price) {
        return res.status(400).json({ error: "Missing fields in bid request" });
    }

    try {
        // ✅ Get player with category populated
        const player = await Player.findById(player_id).populate('category');

        if (!player || !player.category) {
            return res.status(404).json({ error: "Player or category not found" });
        }

        const basePrice = player.category.base_price || 500;

        // 🔍 Find the highest existing bid for this player
        const highestBid = await Bid.findOne({ auction_id, player_id }).sort({ price: -1 });

        const requiredMin = highestBid ? highestBid.price + 50 : basePrice;

        if (price < requiredMin) {
            return res.status(400).json({
                error: `Bid too low. Minimum allowed: $${requiredMin}`
            });
        }

        const newBid = new Bid({ auction_id, player_id, team_id, price });

        await newBid.save();
        res.status(200).json({ message: "✅ Bid placed", bid: newBid });
    } catch (err) {
        console.error("❌ Error placing bid:", err.message);
        res.status(500).json({ error: "Server error placing bid" });
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

router.post("/sellPlayer", async (req, res) => {
    const { auction_id, player_id, team_id } = req.body;

    try {
        console.log("SellPlayerRequest");
        console.log(req.body);
        // Get the highest bid for this player
        const highestBid = await Bid.findOne({
            auction_id,
            player_id
        }).sort({ price: -1 });

        if (!highestBid) {
            return res.status(404).json({ message: "No bids found for this player." });
        }

        if (highestBid.team_id.toString() !== team_id) {
            return res.status(400).json({ message: "Selected team is not the highest bidder." });
        }

        // Update the player as sold
        const updatedPlayer = await Player.findByIdAndUpdate(
            player_id,
            {
                is_sold: true,
                team_id: team_id,
                price: highestBid.price
            },
            { new: true }
        );

        res.status(200).json({
            message: `✅ ${updatedPlayer.name} sold to team successfully.`,
            player: updatedPlayer
        });
    } catch (error) {
        console.error("❌ Error selling player:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


export default router;
