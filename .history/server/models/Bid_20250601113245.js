import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        required: true
    },
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Bid", bidSchema);
