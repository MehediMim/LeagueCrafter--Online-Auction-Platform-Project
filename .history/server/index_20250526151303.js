import express from "express";
import cors from "cors";


// import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes.js";


const app = express();
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173",     // frontend origin
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
}));




// app.use("/users",userRoutes);
app.use("/login",loginRoutes);

app.listen(3000,()=>{
  console.log("server running on port 3000");
})