import mongoose from "mongoose";
import User from "./User.models.js";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is needed"],
        trim: true
    },
    caption: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number, 
        min: 1, 
        max: 5,
        required: true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
}, { timestamps: true }); 

const Book = mongoose.model("Book", bookSchema);
export default Book;
