import express from "express";
import cors from "cors";
import "./db.js"


// import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes.js";
import addAuctionRoutes from "./routes/addAuctionROutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import teamRoutes from "./routes/teamRoutes.js"
import playerRoutes from "./routes/playerRoutes.js"
import auctionRoutes from "./routes/auctionRoutes.js"
const app = express();
app.use(express.json());



app.use(cors());

// app.use("/users",userRoutes);
app.use("/login",loginRoutes);
app.use("/addauction",addAuctionRoutes);
app.use("/category",categoryRoutes);
app.use("/team",teamRoutes);
app.use("/player",playerRoutes);
app.use("/auctionDetails",playerRoutes);

app.listen(3000,()=>{
  console.log("server running on port 3000");
})