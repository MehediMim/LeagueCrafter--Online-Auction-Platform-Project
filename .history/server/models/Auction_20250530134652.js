import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
    creator_id: {
        type: String,
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
        default: 0
    },
    player_count: {
        type: Number,
        default: 0
    },
    budget_per_team: {
        type: Number,
        required: true
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // references to Category

    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "completed"],
        default: "upcoming"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Auction = mongoose.model("Auction", auctionSchema);
export default Auction;
