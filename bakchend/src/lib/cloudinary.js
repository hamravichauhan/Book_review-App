import { v2 as cloudinary } from "cloudinary";
import "dotenv/config"
cloudinary.config({
    cloud_name: process.env.cloudinary_Cloud_name,
    api_key: process.env.cloudinary_API_key,
    api_secret: process.env.cloudinary_API_secret
})

export default cloudinary