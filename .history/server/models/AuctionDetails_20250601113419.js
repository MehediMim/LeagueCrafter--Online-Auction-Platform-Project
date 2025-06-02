import mongoose from "mongoose";

const auctionDetailsSchema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        required: true,
        unique: true
    },
    current_player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        default: null
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("AuctionDetails", auctionDetailsSchema);
