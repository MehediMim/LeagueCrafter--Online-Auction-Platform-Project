import express from "express";
import cors from "cors";
import "./db.js"


// import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes.js";
import addAuctionRoutes from "./routes/addAuctionROutes.js"

const app = express();
app.use(express.json());


const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));

// app.use("/users",userRoutes);
app.use("/login",loginRoutes);
app.use("/addAuction",addAuctionRoutes);

app.listen(3000,()=>{
  console.log("server running on port 3000");
})