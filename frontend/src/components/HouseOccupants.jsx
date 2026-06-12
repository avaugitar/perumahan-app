import { useEffect, useState } from "react";
import { getHouses } from "../api/houses";
import { getResidents } from "../api/residents";
import {
  getHouseOccupants,
  createHouseOccupant,
  updateHouseOccupant,
} from "../api/houseOccupants";

function HouseOccupants() {
  const [houses, setHouses] = useState([]);
  const [residents, setResidents] = useState([]);
  const [houseOccupants, setHouseOccupants] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    house_id: "",
    resident_id: "",
    start_date: "",
    end_date: "",
  });

  const fetchData = async () => {
    const housesData = await getHouses();
    const residentsData = await getResidents();
    const occupantsData = await getHouseOccupants();

    setHouses(housesData);
    setResidents(residentsData);
    setHouseOccupants(occupantsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      house_id: form.house_id,
      resident_id: form.resident_id,
      start_date: form.start_date,
      end_date: form.end_date || null,
    };

    if (editId) {
      await updateHouseOccupant(editId, data);
    } else {
      await createHouseOccupant(data);
    }

    setForm({
      house_id: "",
      resident_id: "",
      start_date: "",
      end_date: "",
    });

    setEditId(null);
    fetchData();
  };

  const handleEdit = (item) => {
  const confirmEdit = window.confirm("Yakin ingin mengedit data ini?");

  if (!confirmEdit) {
    return;
  }

  setEditId(item.id);

  setForm({
    house_id: item.house_id,
    resident_id: item.resident_id,
    start_date: item.start_date || "",
    end_date: item.end_date || "",
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  return (
    <div className="page">
      <div className="main-layout">
        <div className="form-box">
          <h1>Penghuni Rumah</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Pilih Rumah</label>
              <select
                name="house_id"
                value={form.house_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Rumah --</option>
                {houses.map((house) => (
                  <option key={house.id} value={house.id}>
                    {house.block ? `Blok ${house.block} - ` : ""}
                    Rumah {house.house_number}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Pilih Penghuni</label>
              <select
                name="resident_id"
                value={form.resident_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Penghuni --</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Tanggal Mulai Tinggal</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Tanggal Selesai Tinggal</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
              />
            </div>

            <button type="submit">
              {editId ? "Update Penghuni Rumah" : "Simpan Penghuni Rumah"}
            </button>
          </form>
        </div>

        <div className="table-box">
          <h2>History Penghuni Rumah</h2>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Rumah</th>
                <th>Penghuni</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Selesai</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {houseOccupants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">
                    Belum ada history penghuni rumah.
                  </td>
                </tr>
              ) : (
                houseOccupants.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      {item.house?.block ? `Blok ${item.house.block} - ` : ""}
                      Rumah {item.house?.house_number}
                    </td>
                    <td>{item.resident?.full_name || "-"}</td>
                    <td>{item.start_date}</td>
                    <td>{item.end_date || "-"}</td>
                    <td>{item.is_active ? "Aktif" : "Tidak aktif"}</td>
                    <td>
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HouseOccupants;