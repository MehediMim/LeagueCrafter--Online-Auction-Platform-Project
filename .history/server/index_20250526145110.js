import express from "express";
const userRoutes =require("./routes/userRoutes");
const loginRoutes=require("./routes/loginRoutes");
const app = express();
app.use(express.json());


app.use("/users",userRoutes);
app.use("/login",loginRoutes);

app.listen(3000,()=>{
  console.log("server running on port 3000");
})