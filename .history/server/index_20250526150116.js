import express from "express";
import cors from "cors";


// import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes.js";


const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend origin
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"], // ✅ allow these
}));

// app.use("/users",userRoutes);
app.use("/login",loginRoutes);

app.listen(3000,()=>{
  console.log("server running on port 3000");
})