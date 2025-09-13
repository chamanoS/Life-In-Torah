import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    cover: null, // file object
  });

  useEffect(() => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error("Error fetching books:", err));
  }, []);

  const addBook = (e) => {
    e.preventDefault();

    if (!newBook.title || !newBook.author || !newBook.description || !newBook.cover) {
      alert("Please fill all fields and select a cover image!");
      return;
    }

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("description", newBook.description);
    formData.append("cover", newBook.cover);

    axios.post("http://localhost:5000/books", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      setBooks([...books, res.data]);
      setNewBook({ title: "", author: "", description: "", cover: null });
    })
    .catch(err => console.error("Error uploading book:", err));
  };

  // Optional: revoke object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (newBook.cover) {
        URL.revokeObjectURL(newBook.cover);
      }
    };
  }, [newBook.cover]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Book Library</h1>

      {/* Add Book Form */}
      <form onSubmit={addBook} style={{
        marginBottom: "30px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "500px"
      }}>
        <h3>Add a New Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />
        <textarea
          placeholder="Description"
          value={newBook.description}
          onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewBook({ ...newBook, cover: e.target.files[0] })}
          style={{ width: "100%", margin: "5px 0", padding: "8px" }}
        />

        {/* Image Preview */}
        {newBook.cover && (
          <img
            src={URL.createObjectURL(newBook.cover)}
            alt="Preview"
            style={{ width: "100%", height: "250px", objectFit: "cover", marginBottom: "10px", borderRadius: "5px" }}
          />
        )}

        <button type="submit" style={{ marginTop: "10px" }}>Add Book</button>
      </form>

      {/* Book Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px"
      }}>
        {books.map(b => (
          <div key={b.id} style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            textAlign: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}>
            <Link to={`/books/${b.id}`} style={{ textDecoration: "none", color: "black" }}>
              <img
                src={b.cover}
                alt={b.title}
                style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "5px" }}
              />
              <h3 style={{ marginTop: "10px" }}>{b.title}</h3>
              <p><i>{b.author}</i></p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;