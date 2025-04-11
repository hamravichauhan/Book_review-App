import express from "express";
import Book from "../models/Books.model.js";
import cloudinary from "../lib/cloudinary.js";
import authMiddleware from "../middleware/auth.middleware.js";

const bookRoutes = express.Router();

// ✅ Create a Book
bookRoutes.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;

        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const uploadedImage = await cloudinary.uploader.upload(image);
        const imageUrl = uploadedImage.secure_url;

        const book = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id
        });

        await book.save();

        res.status(201).json({
            message: "Book created successfully",
            book
        });
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get Books with Pagination
bookRoutes.get("/", authMiddleware, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments();

        res.json({
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: page,
            books
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get Books Uploaded by a Specific User
bookRoutes.get("/user", authMiddleware, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.json(books);
    } catch (error) {
        console.error("Error fetching user books:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Delete Book by ID
bookRoutes.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the logged-in user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this book" });
        }

        // Delete book from Cloudinary
        const publicId = book.image.split("/").pop().split(".")[0]; // Extract public ID from image URL
        await cloudinary.uploader.destroy(publicId);

        // Delete book from DB
        await book.deleteOne();

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default bookRoutes;
