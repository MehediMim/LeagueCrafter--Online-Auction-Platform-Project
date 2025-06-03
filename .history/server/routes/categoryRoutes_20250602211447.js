import express from "express";
import Category from "../models/Category.js";
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
        console.log(category);

        const savedCategory = await category.save();
        console.log("Category saved");
        res.status(201).json(savedCategory);
    } catch (err) {
        console.error("❌ Error adding category:", err.message);
        res.status(500).json({ message: "Server error while adding category" });
    }
});

router.get("/getCategory/:auctionId", async (req, res) => {
    try {
        console.log("hi from category/getCategory");
        const categories = await Category.find({ auction_id: req.params.auctionId });
        console.log(categories);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Server error while fetching categories" });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(updatedCategory);
    } catch (err) {
        console.error("❌ Error updating category:", err.message);
        res.status(500).json({ message: "Server error while updating category" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting category:", err.message);
        res.status(500).json({ message: "Server error while deleting category" });
    }
});


export default router;