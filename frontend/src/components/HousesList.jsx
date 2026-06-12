import { useEffect, useState } from "react";
import { getHouses, createHouse, updateHouse } from "../api/houses";

function HousesList() {
  const [houses, setHouses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    house_number: "",
    block: "",
    address: "",
  });

  const fetchData = async () => {
    const data = await getHouses();
    setHouses(Array.isArray(data) ? data : []);
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

    try {
      if (editId) {
        await updateHouse(editId, form);
        alert("Data rumah berhasil diupdate");
      } else {
        await createHouse(form);
        alert("Data rumah berhasil disimpan");
      }

      setForm({
        house_number: "",
        block: "",
        address: "",
      });

      setEditId(null);
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (house) => {
    const confirmEdit = window.confirm("Yakin ingin mengedit data ini?");

    if (!confirmEdit) {
      return;
    }

    setEditId(house.id);

    setForm({
      house_number: house.house_number || "",
      block: house.block || "",
      address: house.address || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getActiveOccupantName = (house) => {
    const activeOccupants = house.house_occupants || house.houseOccupants || [];

    if (activeOccupants.length === 0) {
      return "-";
    }

    return activeOccupants[0]?.resident?.full_name || "-";
  };

  return (
    <div className="page">
      <div className="main-layout">
        <div className="form-box">
          <h1>Data Rumah</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nomor Rumah</label>
              <input
                type="text"
                name="house_number"
                value={form.house_number}
                onChange={handleChange}
                placeholder="Contoh: 01"
                required
              />
            </div>

            <div className="input-group">
              <label>Blok</label>
              <input
                type="text"
                name="block"
                value={form.block}
                onChange={handleChange}
                placeholder="Contoh: A"
                required
              />
            </div>

            <div className="input-group">
              <label>Alamat</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Contoh: Jl. Kelud No. 01"
                rows="1"
                required
              ></textarea>
            </div>

            <button type="submit">
              {editId ? "Update Rumah" : "Simpan Rumah"}
            </button>
          </form>
        </div>

        <div className="table-box">
          <h2>List Rumah</h2>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nomor Rumah</th>
                <th>Blok</th>
                <th>Alamat</th>
                <th>Status Hunian</th>
                <th>Penghuni Saat Ini</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {houses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">
                    Belum ada data rumah.
                  </td>
                </tr>
              ) : (
                houses.map((house, index) => (
                  <tr key={house.id}>
                    <td>{index + 1}</td>
                    <td>{house.house_number}</td>
                    <td>{house.block}</td>
                    <td>{house.address}</td>
                    <td>
                      <span
                        className={
                          house.occupancy_status === "dihuni"
                            ? "badge badge-info"
                            : "badge badge-muted"
                        }
                      >
                        {house.occupancy_status === "dihuni"
                          ? "Dihuni"
                          : "Tidak dihuni"}
                      </span>
                    </td>
                    <td>{getActiveOccupantName(house)}</td>
                    <td>
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(house)}
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

export default HousesList;