import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data));
  }, []);

  const submitReview = (id) => {
    axios.post(`http://localhost:5000/books/${id}/reviews`, { text: review })
      .then(res => {
        setBooks(books.map(b => 
          b.id === id ? { ...b, reviews: [...b.reviews, res.data] } : b
        ));
        setSelected(prev => ({ ...prev, reviews: [...prev.reviews, res.data] }));
        setReview("");
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📖 Life in Torah</h1>

      {!selected ? (
        <ul>
          {books.map(b => (
            <li key={b.id} onClick={() => setSelected(b)} style={{cursor:"pointer", margin:"10px 0"}}>
              <b>{b.title}</b> — {b.author}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <button onClick={() => setSelected(null)}>⬅ Back</button>
          <h2>{selected.title}</h2>
          <p><i>{selected.author}</i></p>
          <p>{selected.description}</p>

          <h3>Reviews</h3>
          <ul>
            {selected.reviews.map(r => <li key={r.id}>{r.text}</li>)}
          </ul>

          <textarea 
            value={review} 
            onChange={(e) => setReview(e.target.value)} 
            placeholder="Write your review..."
            rows={3}
            style={{width:"100%", margin:"10px 0"}}
          />
          <button onClick={() => submitReview(selected.id)}>Add Review</button>
        </div>
      )}
    </div>
  );
}

export default App;
