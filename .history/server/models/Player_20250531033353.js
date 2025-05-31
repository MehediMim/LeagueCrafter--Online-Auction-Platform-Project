import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo_url: {
        type: String,
        default: ""
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null // unassigned if still in auction pool
    },
    auction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        required: true
    },
    category: {
        type: String,
        required: true // like "Platinum", "Gold", etc.
    },
    price: {
        type: Number,
        default: 0 // final price after bidding
    },
    is_sold: {
        type: Boolean,
        default: false
    },
    stats: {
        type: Object,
        default: {}
    },
    role: {
        type: String,
        default: "" // e.g., "Goalkeeper", "Opening Batsman", etc.
    },
    dob: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model("Player", playerSchema);
