import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Dummy data (later we’ll hook this to SQL Server)
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


// Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Get book by ID
app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send("Book not found");
  res.json(book);
});

// Add review to a book
app.post("/books/:id/reviews", (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send("Book not found");

  const review = { id: Date.now(), text: req.body.text };
  book.reviews.push(review);

  res.json(review);
});

app.listen(5000, () => console.log("✅ Backend running at http://localhost:5000"));
