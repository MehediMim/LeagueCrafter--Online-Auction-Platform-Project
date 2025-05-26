import express from "express";
// import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes.js";
const app = express();
app.use(express.json());


// app.use("/users",userRoutes);
app.use("/login",loginRoutes);

app.listen(3000,()=>{
  console.log("server running on port 3000");
})