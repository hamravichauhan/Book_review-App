import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes leading/trailing spaces
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email:{
      type:String,
      required:[true, "email is required"],
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } 
);
userSchema.pre("save" , async function(next){
if(!this.isModified("password")) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password , salt);
next();
})

const User = mongoose.model("User", userSchema);

export default User;


