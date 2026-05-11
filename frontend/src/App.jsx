import { useEffect, useState } from "react";
const API_URL = "https://kandang-app-production.up.railway.app";
function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/ayam`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA MASUK:", data); // 🔥 penting
        setData(data);
      })
      .catch((err) => {
        console.log("ERROR:", err); // 🔥 kalau gagal
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Data Ayam</h1>

      {data.map((item) => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <p>Jumlah: {item.jumlah}</p>
          <p>Mati: {item.mati}</p>
          <p>Pakan: {item.pakan}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
