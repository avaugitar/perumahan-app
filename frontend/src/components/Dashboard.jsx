import { useEffect, useState } from "react";
import { getHouses } from "../api/houses";

function Dashboard() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const housesData = await getHouses();
      setHouses(Array.isArray(housesData) ? housesData : []);
    } catch (error) {
      console.error("Dashboard error:", error);
      setHouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getActiveOccupant = (house) => {
    const occupants =
      house.house_occupants || house.houseOccupants || [];

    return occupants.find(
      (occupant) =>
        occupant.is_active === true ||
        occupant.is_active === 1 ||
        occupant.is_active === "1"
    );
  };

  // Sesuai study case, total fisik rumah adalah 20.
  const totalRumah = 20;

  const rumahDihuniTetap = houses.filter((house) => {
    const occupant = getActiveOccupant(house);

    return occupant?.resident?.resident_status === "tetap";
  }).length;

  const rumahDihuniKontrak = houses.filter((house) => {
    const occupant = getActiveOccupant(house);

    return occupant?.resident?.resident_status === "kontrak";
  }).length;

  const totalRumahDihuni = rumahDihuniTetap + rumahDihuniKontrak;

  const rumahKosong = Math.max(0, totalRumah - totalRumahDihuni);

  if (loading) {
    return (
      <div className="page">
        <h1>Memuat Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="dashboard-layout">
        <h1>Dashboard Administrasi RT</h1>

        <p className="dashboard-subtitle">
          Ringkasan kondisi rumah di lingkungan perumahan.
        </p>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Rumah</h3>
            <p>{totalRumah}</p>
          </div>

          <div className="dashboard-card">
            <h3>Dihuni Tetap</h3>
            <p>{rumahDihuniTetap}</p>
          </div>

          <div className="dashboard-card">
            <h3>Dihuni Kontrak</h3>
            <p>{rumahDihuniKontrak}</p>
          </div>

          <div className="dashboard-card">
            <h3>Rumah Kosong</h3>
            <p>{rumahKosong}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;