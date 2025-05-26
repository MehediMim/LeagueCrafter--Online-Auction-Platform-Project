import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        auth_id : {
            type:String , 
            required: true, 
            unique: true
        },
        role:{
            type:String,
            enum:["auction_owner","team_owner"],
            default:"team_owner"
        },
    }
);

const User = mongoose.model("User",userSchema);
export default User;