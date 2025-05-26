import mongoose, { mongo } from "mongoose";

const auctionSchema = new mongoose.Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cover_image: {
        type: String,
    },
    sports_type: {
        type: String,
        enum: ["cricket", "football"],
        required: true
    },
    team_count: {
        type: Number,
        required: true
    },
    player_count: {
        type: Number,
        required: true
    },
    budget_per_team: {
        type: Number,
        required: true
    },
    tiers: [{ type: String }],// e.g. ["Platinum", "Gold", "Silver"]
    base_price_per_tier: {
        type: Map,
        of: Number // e.g. { "Platinum": 20, "Gold": 15 }
    },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "completed"],
        default: "upcoming"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}
)

const Auction=mongoose.model("Auction",auctionSchema);
export default Auction;