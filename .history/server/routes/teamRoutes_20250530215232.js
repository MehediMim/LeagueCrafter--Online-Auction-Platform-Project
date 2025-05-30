import express from "express";

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        console.log("hi from team/adds");
        console.log(req.body);
        
    } catch (err) {
        
    }
});

export default router;
