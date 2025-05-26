const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: String, required: true }, // Auth0 ID
  sport: { type: String, enum: ['cricket', 'football'], required: true },
  status: { type: String, enum: ['draft', 'live', 'completed'], default: 'draft' },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
}, { timestamps: true });

module.exports = mongoose.model('Auction', auctionSchema);
