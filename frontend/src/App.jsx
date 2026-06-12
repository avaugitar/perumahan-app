import "./App.css";
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import PenghuniPage from "./pages/PenghuniPage";
import RumahPage from "./pages/RumahPage";
import PenghuniRumahPage from "./pages/PenghuniRumahPage";
import PembayaranPage from "./pages/PembayaranPage";
import PengeluaranPage from "./pages/PengeluaranPage";
import LaporanPage from "./pages/LaporanPage";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>Administrasi RT</h2>

        <div className="nav-menu">
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰ Menu
          </button>

          <div className={`nav-links ${menuOpen ? "show" : ""}`}>
            <NavLink to="/dashboard" onClick={closeMenu}>
              Dashboard
            </NavLink>

            <NavLink to="/penghuni" onClick={closeMenu}>
              Penghuni
            </NavLink>

            <NavLink to="/rumah" onClick={closeMenu}>
              Rumah
            </NavLink>

            <NavLink to="/penghuni-rumah" onClick={closeMenu}>
              Penghuni Rumah
            </NavLink>

            <NavLink to="/pembayaran" onClick={closeMenu}>
              Pembayaran
            </NavLink>

            <NavLink to="/pengeluaran" onClick={closeMenu}>
              Pengeluaran
            </NavLink>

            <NavLink to="/laporan" onClick={closeMenu}>
              Laporan
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/penghuni" element={<PenghuniPage />} />
        <Route path="/rumah" element={<RumahPage />} />
        <Route path="/penghuni-rumah" element={<PenghuniRumahPage />} />
        <Route path="/pembayaran" element={<PembayaranPage />} />
        <Route path="/pengeluaran" element={<PengeluaranPage />} />
        <Route path="/laporan" element={<LaporanPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;