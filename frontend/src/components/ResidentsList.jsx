import { useEffect, useState } from "react";
import { getResidents, createResident, updateResident } from "../api/residents";

function ResidentsList() {
  const [residents, setResidents] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    ktp_photo: null,
    resident_status: "tetap",
    phone_number: "62",
    is_married: false,
  });

  const fetchData = async () => {
    const data = await getResidents();
    setResidents(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setForm({
        ...form,
        ktp_photo: files[0],
      });
      return;
    }

    if (name === "phone_number") {
      let phone = value.replace(/[^0-9]/g, "");

      if (phone.startsWith("0")) {
        phone = "62" + phone.substring(1);
      }

      if (!phone.startsWith("62")) {
        phone = "62" + phone;
      }

      setForm({
        ...form,
        phone_number: phone,
      });
      return;
    }

    if (name === "is_married") {
      setForm({
        ...form,
        is_married: value === "1",
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("full_name", form.full_name);

  if (form.ktp_photo) {
    formData.append("ktp_photo", form.ktp_photo);
  }

  formData.append("resident_status", form.resident_status);
  formData.append("phone_number", form.phone_number);
  formData.append("is_married", form.is_married ? "1" : "0");

  if (editId) {
    await updateResident(editId, formData);
  } else {
    await createResident(formData);
  }

  setForm({
    full_name: "",
    ktp_photo: null,
    resident_status: "tetap",
    phone_number: "62",
    is_married: false,
  });

  setEditId(null);

  const fileInput = document.getElementById("ktp_photo");
  if (fileInput) {
    fileInput.value = "";
  }

  fetchData();
};

const handleEdit = (resident) => {
  const confirmEdit = window.confirm("Yakin ingin mengedit data ini?");

  if (!confirmEdit) {
    return;
  }

  setEditId(resident.id);

  setForm({
    full_name: resident.full_name,
    ktp_photo: null,
    resident_status: resident.resident_status,
    phone_number: resident.phone_number,
    is_married: resident.is_married ? true : false,
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
          <h1>Data Penghuni</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Foto KTP</label>
              <input
                id="ktp_photo"
                type="file"
                name="ktp_photo"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Tipe Hunian</label>
              <select
                name="resident_status"
                value={form.resident_status}
                onChange={handleChange}
              >
                <option value="tetap">Tetap</option>
                <option value="kontrak">Kontrak</option>
              </select>
            </div>

            <div className="input-group">
              <label>No. HP</label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="6281225069148"
                required
              />
            </div>

            <div className="input-group">
              <label>Status Pernikahan</label>
              <select
                name="is_married"
                value={form.is_married ? "1" : "0"}
                onChange={handleChange}
              >
                <option value="0">Belum menikah</option>
                <option value="1">Menikah</option>
              </select>
            </div>

            <button type="submit">
              {editId ? "Update Penghuni" : "Simpan Penghuni"}
            </button>
          </form>
        </div>

        <div className="table-box">
          <h2>List Penghuni</h2>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Tipe Hunian</th>
                <th>No. HP</th>
                <th>Status Pernikahan</th>
                <th>Foto KTP</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {residents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">
                    Belum ada data penghuni.
                  </td>
                </tr>
              ) : (
                residents.map((resident, index) => (
                  <tr key={resident.id}>
                    <td>{index + 1}</td>
                    <td>{resident.full_name}</td>
                    <td>{resident.resident_status}</td>
                    <td>
                      <a
                        href={`https://wa.me/${String(resident.phone_number).replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="wa-link"
                      >
                        {resident.phone_number}
                      </a>
                    </td>
                    <td>
                      {resident.is_married ? "Menikah" : "Belum menikah"}
                    </td>
                    <td>
                      {resident.ktp_photo ? (
                        <a
                          href={`http://127.0.0.1:8000/storage/${resident.ktp_photo}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Lihat
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
              <button
                type="button"
                className="edit-button"
                onClick={() => handleEdit(resident)}
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

export default ResidentsList;