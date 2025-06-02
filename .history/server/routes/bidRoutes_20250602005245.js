


// import express from 'express';
// import Bid from '../models/Bid.js';
// import Player from '../models/Player.js';
// import Team from '../models/Team.js';
// import Auction from '../models/Auction.js';
// const router = express.Router();

// // Place a new bid
// // Place a new bid
// // Place a new bid
// import Category from '../models/Category.js'; // Make sure to import this if not yet

// router.post('/place', async (req, res) => {
//     const { auction_id, player_id, team_id, price } = req.body;

//     if (!auction_id || !player_id || !team_id || !price) {
//         return res.status(400).json({ error: "Missing fields in bid request" });
//     }

//     try {
//         // ✅ Get player with category populated
//         const player = await Player.findById(player_id).populate('category');

//         if (!player || !player.category) {
//             return res.status(404).json({ error: "Player or category not found" });
//         }

//         const basePrice = player.category.base_price || 500;

//         // 🔍 Find the highest existing bid for this player
//         const highestBid = await Bid.findOne({ auction_id, player_id }).sort({ price: -1 });

//         const requiredMin = highestBid ? highestBid.price + 50 : basePrice;

//         if (price < requiredMin) {
//             return res.status(400).json({
//                 error: `Bid too low. Minimum allowed: $${requiredMin}`
//             });
//         }

//         const newBid = new Bid({ auction_id, player_id, team_id, price });

//         await newBid.save();
//         res.status(200).json({ message: "✅ Bid placed", bid: newBid });
//     } catch (err) {
//         console.error("❌ Error placing bid:", err.message);
//         res.status(500).json({ error: "Server error placing bid" });
//     }
// });



// // Get all bids for a specific player in an auction
// router.get('/playerBids', async (req, res) => {
//     const { auction_id, player_id } = req.query;

//     try {
//         const bids = await Bid.find({ auction_id, player_id })
//             .populate('team_id', 'name color_code logo_url')

//             .sort({ price: -1, timestamp: 1 }); // highest first
//         res.json(bids);
//     } catch (err) {
//         console.error("❌ Error fetching bids:", err.message);
//         res.status(500).json({ error: "Failed to fetch bids" });
//     }
// });

// router.post("/sellPlayer", async (req, res) => {
//     const { auction_id, player_id, team_id } = req.body;

//     try {
//         console.log("SellPlayerRequest");
//         console.log(req.body);
//         // Get the highest bid for this player
//         const highestBid = await Bid.findOne({
//             auction_id,
//             player_id
//         }).sort({ price: -1 });

//         if (!highestBid) {
//             return res.status(404).json({ message: "No bids found for this player." });
//         }

//         if (highestBid.team_id.toString() !== team_id) {
//             return res.status(400).json({ message: "Selected team is not the highest bidder." });
//         }

//         // Update the player as sold
//         const updatedPlayer = await Player.findByIdAndUpdate(
//             player_id,
//             {
//                 is_sold: true,
//                 team_id: team_id,
//                 price: highestBid.price
//             },
//             { new: true }
//         );

//         res.status(200).json({
//             message: `✅ ${updatedPlayer.name} sold to team successfully.`,
//             player: updatedPlayer
//         });
//     } catch (error) {
//         console.error("❌ Error selling player:", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


// export default router;

































// import express from 'express';
// import Bid from '../models/Bid.js';
// import Player from '../models/Player.js';
// import Team from '../models/Team.js';
// import Auction from '../models/Auction.js';
// import Category from '../models/Category.js'; // Make sure to import this if not yet
// const router = express.Router();


// // Place a new bid
// // Place a new bid
// // Place a new bid

// router.post('/place', async (req, res) => {
//     const { auction_id, player_id, team_id, price } = req.body;
//     console.log(req.body);

//     if (!auction_id || !player_id || !team_id || !price) {
//         return res.status(400).json({ error: "Missing fields in bid request" });
//     }

//     try {
//         const player = await Player.findById(player_id).populate('category');
//         if (!player || !player.category) {
//             return res.status(404).json({ error: "Player or category not found" });
//         }

//         const basePrice = player.category.base_price || 500;

//         const highestBid = await Bid.findOne({ auction_id, player_id }).sort({ price: -1 });
//         const requiredMin = highestBid ? highestBid.price + 50 : basePrice;

//         if (price < requiredMin) {
//             return res.status(400).json({
//                 error: `Bid too low. Minimum allowed: $${requiredMin}`
//             });
//         }

//         const team = await Team.findById(team_id);
//         if (!team) {
//             return res.status(404).json({ error: "Team not found" });
//         }

//         const teamPlayers = await Player.find({ team_id: team_id, is_sold: true }).populate('category');
//         const totalBought = teamPlayers.length;

//         if (totalBought >= 11) {
//             return res.status(400).json({ error: "You have already bought 11 players." });
//         }

//         // Count current players per category
//         const categoryCounts = {};
//         for (const p of teamPlayers) {
//             const cat = p.category?.name || "Unknown";
//             categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
//         }

//         // Fetch minimums from auction
//         const auction = await Auction.findById(auction_id);
//         const minPerCategory = auction.min_player_per_tier; // { Platinum: 2, Gold: 2, ... }
//         const basePricePerCategory = auction.base_price_per_tier; // { Platinum: 10000, ... }

//         // Enforce category limit (e.g. Platinum has minimum 2 but you already bought 2)
//         const catName = player.category.name;
//         const alreadyBoughtThisCat = categoryCounts[catName] || 0;
//         const stillNeedThisCat = (minPerCategory[catName] || 0) - alreadyBoughtThisCat;

//         const totalSlotsRemaining = 11 - totalBought;

//         // Build list of required future purchases
//         const mandatoryPrices = [];
//         for (const [cat, minCount] of Object.entries(minPerCategory)) {
//             const current = categoryCounts[cat] || 0;
//             const need = Math.max(minCount - current, 0);
//             for (let i = 0; i < need; i++) {
//                 mandatoryPrices.push(basePricePerCategory[cat] || 500);
//             }
//         }

//         const optionalSlots = totalSlotsRemaining - mandatoryPrices.length;
//         const cheapestPrice = Math.min(...Object.values(basePricePerCategory));
//         const optionalPrices = Array(optionalSlots).fill(cheapestPrice);

//         const totalRequiredFunds = [...mandatoryPrices, ...optionalPrices].reduce((a, b) => a + b, 0);
//         const maxSafeBid = team.budget_remaining - totalRequiredFunds;

//         if (price > maxSafeBid) {
//             return res.status(400).json({
//                 error: `Bid exceeds safe limit. You need to save at least $${totalRequiredFunds} for remaining slots.`
//             });
//         }

//         const newBid = new Bid({ auction_id, player_id, team_id, price });
//         await newBid.save();

//         res.status(200).json({ message: "✅ Bid placed", bid: newBid });

//     } catch (err) {
//         console.error("❌ Error placing bid:", err.message);
//         res.status(500).json({ error: "Server error placing bid" });
//     }
// });



// // Get all bids for a specific player in an auction
// router.get('/playerBids', async (req, res) => {
//     const { auction_id, player_id } = req.query;

//     try {
//         const bids = await Bid.find({ auction_id, player_id })
//             .populate('team_id', 'name color_code logo_url')

//             .sort({ price: -1, timestamp: 1 }); // highest first
//         res.json(bids);
//     } catch (err) {
//         console.error("❌ Error fetching bids:", err.message);
//         res.status(500).json({ error: "Failed to fetch bids" });
//     }
// });

// router.post("/sellPlayer", async (req, res) => {
//     const { auction_id, player_id, team_id } = req.body;

//     try {
//         console.log("SellPlayerRequest");
//         console.log(req.body);
//         // Get the highest bid for this player
//         const highestBid = await Bid.findOne({
//             auction_id,
//             player_id
//         }).sort({ price: -1 });

//         if (!highestBid) {
//             return res.status(404).json({ message: "No bids found for this player." });
//         }

//         if (highestBid.team_id.toString() !== team_id) {
//             return res.status(400).json({ message: "Selected team is not the highest bidder." });
//         }

//         // Update the player as sold
//         const updatedPlayer = await Player.findByIdAndUpdate(
//             player_id,
//             {
//                 is_sold: true,
//                 team_id: team_id,
//                 price: highestBid.price
//             },
//             { new: true }
//         );

//         res.status(200).json({
//             message: `✅ ${updatedPlayer.name} sold to team successfully.`,
//             player: updatedPlayer
//         });
//     } catch (error) {
//         console.error("❌ Error selling player:", error.message);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


// export default router;
















import express from 'express';
import Bid from '../models/Bid.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';
import Auction from '../models/Auction.js';
import Category from '../models/Category.js';

const router = express.Router();

// ✅ Reusable bid handler function
async function placeBidHandler({ auction_id, player_id, team_id, price }) {
    if (!auction_id || !player_id || !team_id || !price) {
        throw new Error("Missing fields in bid request");
    }

    const player = await Player.findById(player_id).populate('category');
    if (!player || !player.category) {
        throw new Error("Player or category not found");
    }

    const basePrice = player.category.base_price || 500;
    const categoryName = player.category.name;

    const highestBid = await Bid.findOne({ auction_id, player_id }).sort({ price: -1 });
    const requiredMin = highestBid ? highestBid.price + 50 : basePrice;

    if (price < requiredMin) {
        throw new Error(`Bid too low. Minimum allowed: $${requiredMin}`);
    }

    const team = await Team.findById(team_id);
    if (!team) {
        throw new Error("Team not found");
    }

    const teamPlayers = await Player.find({ team_id, is_sold: true }).populate('category');
    if (teamPlayers.length >= 11) {
        throw new Error("You have already bought 11 players.");
    }

    // Get category purchase limits
    const allCategories = await Category.find({ auction_id });
    const requiredPerCategory = {};
    const basePricePerCategory = {};
    for (const cat of allCategories) {
        requiredPerCategory[cat.name] = cat.min_players; // Here 'min' is treated as fixed count
        basePricePerCategory[cat.name] = cat.base_price;
    }

    // Count current players per category
    const categoryCounts = {};
    for (const p of teamPlayers) {
        const cat = p.category?.name || "Unknown";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    // ❌ Check if this category is already full
    if ((categoryCounts[categoryName] || 0) >= requiredPerCategory[categoryName]) {
        throw new Error(`You have already bought all required players for the ${categoryName} category.`);
    }

    // ✅ Compute mandatory future buys
    const totalBought = teamPlayers.length;
    const totalSlotsRemaining = 11 - totalBought;

    const mandatoryPrices = [];
    for (const [cat, required] of Object.entries(requiredPerCategory)) {
        const bought = categoryCounts[cat] || 0;
        const needed = required - bought - (cat === categoryName ? 1 : 0); // include current buy
        for (let i = 0; i < Math.max(needed, 0); i++) {
            mandatoryPrices.push(basePricePerCategory[cat] || 500);
        }
    }

    const totalRequiredFunds = mandatoryPrices.reduce((a, b) => a + b, 0);
    const maxSafeBid = team.budget_remaining - totalRequiredFunds;

    if (price > maxSafeBid) {
        throw new Error(`Bid exceeds safe limit. You need to save at least $${totalRequiredFunds} for remaining categories.`);
    }

    const newBid = new Bid({ auction_id, player_id, team_id, price });
    await newBid.save();
    return newBid;
}


// 🔘 Place a bid
router.post('/place', async (req, res) => {
    const { auction_id, player_id, team_id, price } = req.body;

    try {
        const newBid = await placeBidHandler({ auction_id, player_id, team_id, price });
        res.status(200).json({ message: "✅ Bid placed", bid: newBid });
    } catch (err) {
        console.error("❌ Error placing bid:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// 🔘 Get all bids for a specific player in an auction
router.get('/playerBids', async (req, res) => {
    const { auction_id, player_id } = req.query;

    try {
        const bids = await Bid.find({ auction_id, player_id })
            .populate('team_id', 'name color_code logo_url')
            .sort({ price: -1, timestamp: 1 });
        res.json(bids);
    } catch (err) {
        console.error("❌ Error fetching bids:", err.message);
        res.status(500).json({ error: "Failed to fetch bids" });
    }
});

// 🔘 Sell player to highest bidder
router.post("/sellPlayer", async (req, res) => {
    const { auction_id, player_id, team_id } = req.body;

    try {
        const highestBid = await Bid.findOne({ auction_id, player_id }).sort({ price: -1 });

        if (!highestBid) {
            return res.status(404).json({ message: "No bids found for this player." });
        }

        if (highestBid.team_id.toString() !== team_id) {
            return res.status(400).json({ message: "Selected team is not the highest bidder." });
        }

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

router.get('/maxSafeBid', async (req, res) => {
    const { auction_id, team_id } = req.query;
    console.log("🔍 maxSafeBid called with:", { auction_id, team_id });

    try {
        const team = await Team.findById(team_id);
        if (!team) {
            console.log("❌ Team not found:", team_id);
            return res.status(404).json({ error: "Team not found" });
        }

        console.log("✅ Team found:", team.name, "| Budget Remaining (before bid):", team.budget_remaining);

        const players = await Player.find({ team_id, is_sold: true }).populate("category");
        console.log(`📦 Found ${players.length} sold players for this team.`);

        const categories = await Category.find({ auction_id });
        console.log(`📊 Found ${categories.length} categories in auction.`);

        // Step 1: Count players bought per category
        const categoryCounts = {};
        let spentAmount = 0;
        for (const player of players) {
            const cat = player.category?.name;
            if (!cat) continue;
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            spentAmount += player.price || 0;
        }
        console.log("📈 Bought per category:", categoryCounts);
        console.log("💸 Total Already Spent:", spentAmount);

        // Step 2: Setup requirement and price maps
        const requiredPerCategory = {};
        const basePricePerCategory = {};
        for (const cat of categories) {
            requiredPerCategory[cat.name] = cat.min_players;
            basePricePerCategory[cat.name] = typeof cat.base_price === "number" ? cat.base_price : 500;
        }
        console.log("📋 Required players per category:", requiredPerCategory);
        console.log("💰 Base price per category:", basePricePerCategory);

        // Step 3: Calculate reserved money to complete requirements
        const breakdown = {};
        const totalBought = players.length;
        const totalRemainingSlots = 11 - totalBought;

        let reservedSlots = 0;
        let reservedMoney = [];

        for (const [cat, required] of Object.entries(requiredPerCategory)) {
            const bought = categoryCounts[cat] || 0;
            const remaining = Math.max(required - bought, 0);
            const price = basePricePerCategory[cat];

            reservedMoney.push(...Array(remaining).fill(price));
            breakdown[cat] = { bought, remaining, price_per_player: price };
            reservedSlots += remaining;
        }

        // ✅ Fill optional slots with cheapest price
        const cheapestPrice = Math.min(...Object.values(basePricePerCategory));
        const optionalSlots = totalRemainingSlots - reservedSlots;
        reservedMoney.push(...Array(Math.max(optionalSlots, 0)).fill(cheapestPrice));

        const totalReserved = reservedMoney.reduce((a, b) => a + b, 0);

        console.log("🧮 Total Reserved Funds Needed:", totalReserved);
        console.log("📊 Final Category Breakdown:", breakdown);

        const totalRemainingBudget = team.budget_remaining - spentAmount;
        const safeMaxBid = Math.max(0, totalRemainingBudget - totalReserved);

        console.log("💡 Effective Remaining Budget (budget_remaining - spent):", totalRemainingBudget);
        console.log("✅ Safe Max Bid:", safeMaxBid);

        return res.status(200).json({
            team: team.name,
            budget_remaining: team.budget_remaining,
            spent_so_far: spentAmount,
            effective_budget: totalRemainingBudget,
            reserved_for_categories: totalReserved,
            players_bought: totalBought,
            category_breakdown: breakdown,
            maxSafeBid: safeMaxBid
        });
    } catch (err) {
        console.error("❌ Error calculating max safe bid:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;





