import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  auction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    default: null
  },
  name: {
    type: String,
    required: true
  },
  base_price: {
    type: Number,
    required: true
  },
  min_players: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: '#ffffff'
  }
});

export default mongoose.model('Category', CategorySchema);
