// routes/player.js
import multer from "multer";
import XLSX from "xlsx";
import Player from "../models/Player.js";
import Category from "../models/Category.js";

const upload = multer({ dest: "uploads/" });

router.post("/upload-xlsx", upload.single("file"), async (req, res) => {
    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const { auction_id } = req.body;

        for (const entry of data) {
            const {
                Name,
                photo_url,
                dob,
                role,
                Category: categoryName
            } = entry;

            const category = await Category.findOne({ name: categoryName, auction_id });
            if (!category) continue;

            await Player.create({
                name: Name,
                photo_url,
                dob: new Date(dob),
                role,
                category: category._id,
                auction_id
            });
        }

        res.json({ message: "✅ Players uploaded successfully." });
    } catch (err) {
        console.error("❌ Excel upload failed:", err);
        res.status(500).json({ error: "Failed to upload players from Excel." });
    }
});
