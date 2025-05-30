import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo_url: {
        type: String,
    },
    auction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    budget_remaining: {
        type: Number,
        required: true,
        default: 0
    },
    tier_summary: {
        type: Map,
        of: Number,
        default: {}
    },
    color_code: {
        type: String,
        default: "#000000"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
