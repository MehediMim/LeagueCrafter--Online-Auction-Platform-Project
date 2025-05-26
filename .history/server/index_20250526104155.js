import express from 'express';
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());


app.use("/users",userRoutes);

app.listen(3000,()=>{
  console.log("server running on port 3000");
})