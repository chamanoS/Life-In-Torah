import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      background: "#f4f4f4",
      borderBottom: "1px solid #ddd"
    }}>
      <h2>📖 Life in Torah</h2>
      <div>
        <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
