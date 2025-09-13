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
      <ul>
        {books.map(b => (
          <li key={b.id} style={{ margin: "10px 0" }}>
            <Link to={`/books/${b.id}`}><b>{b.title}</b></Link> — {b.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
