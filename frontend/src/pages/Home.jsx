import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Book Library</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
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
