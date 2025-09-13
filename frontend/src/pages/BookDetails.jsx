import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [review, setReview] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/books/${id}`)
      .then(res => setBook(res.data));
  }, [id]);

  const submitReview = () => {
    axios.post(`http://localhost:5000/books/${id}/reviews`, { text: review })
      .then(res => {
        setBook(prev => ({ ...prev, reviews: [...prev.reviews, res.data] }));
        setReview("");
      });
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">⬅ Back</Link>
      <h2>{book.title}</h2>
      <p><i>{book.author}</i></p>
      <p>{book.description}</p>

      <h3>Reviews</h3>
      <ul>
        {book.reviews.map(r => <li key={r.id}>{r.text}</li>)}
      </ul>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        rows={3}
        style={{ width: "100%", margin: "10px 0" }}
      />
      <button onClick={submitReview}>Add Review</button>
    </div>
  );
}

export default BookDetails;
