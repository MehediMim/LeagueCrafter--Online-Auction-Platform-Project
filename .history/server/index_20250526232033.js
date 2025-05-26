import express from "express";
import cors from "cors";
import "./db.js"


// import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes.js";
import addAuctionRoutes from "./routes/addAuctionROutes.js"

const app = express();
app.use(express.json());



app.use(cors());

// app.use("/users",userRoutes);
app.use("/login",loginRoutes);
app.use("/addauction",addAuctionRoutes);

app.listen(3000,()=>{
  console.log("server running on port 3000");
})