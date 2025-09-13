import express from "express";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(uploadDir)); // Serve uploaded images

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// In-memory "database"
let books = [
  {
    id: 1,
    title: "Book of Genesis",
    author: "Moses",
    description: "Torah scroll beginnings",
    cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Torah_scroll.jpg/220px-Torah_scroll.jpg",
    reviews: []
  },
  {
    id: 2,
    title: "Exodus",
    author: "Moses",
    description: "Israel’s redemption story",
    cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Moses_and_the_Ten_Commandments.jpg/220px-Moses_and_the_Ten_Commandments.jpg",
    reviews: []
  }
];

// Routes

// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Get one book by ID
app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// Add a new book with cover upload
app.post("/books", upload.single("cover"), (req, res) => {
  const { title, author, description } = req.body;
  const cover = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !author || !description || !cover) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newBook = {
    id: Date.now(),
    title,
    author,
    description,
    cover,
    reviews: []
  };

  books.push(newBook);
  res.json(newBook);
});

// Add a review to a book
app.post("/books/:id/reviews", (req, res) => {
  const { text } = req.body;
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  const newReview = { id: Date.now(), text };
  book.reviews.push(newReview);
  res.json(newReview);
});

// Error handling for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});