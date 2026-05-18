import mongoose from "mongoose";

mongoose.connect(
    "mongodb+srv://databaseuser:databaseuser@auctionproject.rfgzeyo.mongodb.net/?retryWrites=true&w=majority&appName=AuctionProject",
    {
        useNewurlParser:true,
        useUnifiedTopology:true,
    }
)
.then(()=>console.log("Connnected to MongoDB Atlas"))
.catch(err => console.error("❌ Connection error", err));
