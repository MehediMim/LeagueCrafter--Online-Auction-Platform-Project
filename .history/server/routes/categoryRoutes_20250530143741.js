import exress from "express";
const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const { auction_id, name, base_price, min_players, color } = req.body;

        const category = new Category({
            auction_id,
            name,
            base_price,
            min_players,
            color
        });

        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        console.error("❌ Error adding category:", err.message);
        res.status(500).json({ message: "Server error while adding category" });
    }
});

export default router;