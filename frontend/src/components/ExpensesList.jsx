import { useEffect, useState } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
} from "../api/expenses";

const initialForm = {
  category: "",
  description: "",
  amount: "",
  expense_date: "",
  notes: "",
};

function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getExpenses();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data pengeluaran:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nominal hanya boleh berisi angka.
    if (name === "amount") {
      const onlyNumbers = value.replace(/[^0-9]/g, "");

      setForm((previousForm) => ({
        ...previousForm,
        amount: onlyNumbers,
      }));

      return;
    }

    // Jika kategori bukan Lainnya, deskripsi langsung dikosongkan.
    if (name === "category") {
      setForm((previousForm) => ({
        ...previousForm,
        category: value,
        description:
          value === "Lainnya"
            ? previousForm.description
            : "",
      }));

      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.category === "Lainnya" &&
      !form.description.trim()
    ) {
      alert("Deskripsi wajib diisi untuk kategori Lainnya.");
      return;
    }

    const data = {
      category: form.category,
      description:
        form.category === "Lainnya"
          ? form.description.trim()
          : null,
      amount: Number(form.amount),
      expense_date: form.expense_date,
      notes: form.notes.trim() || null,
    };

    try {
      setIsSaving(true);

      if (editId) {
        await updateExpense(editId, data);
        alert("Data pengeluaran berhasil diubah.");
      } else {
        await createExpense(data);
        alert("Data pengeluaran berhasil disimpan.");
      }

      setForm(initialForm);
      setEditId(null);

      await fetchData();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (expense) => {
    const confirmed = window.confirm(
      "Yakin ingin mengedit data ini?"
    );

    if (!confirmed) {
      return;
    }

    setEditId(expense.id);

    setForm({
      category: expense.category || "",
      description:
        expense.category === "Lainnya"
          ? expense.description || ""
          : "",
      amount: String(
        Math.round(Number(expense.amount || 0))
      ),
      expense_date: expense.expense_date || "",
      notes: expense.notes || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatRupiah = (value) => {
    return Number(value || 0).toLocaleString("id-ID");
  };

  return (
    <div className="page">
      <div className="main-layout">
        {/* Form Data Pengeluaran */}
        <div className="form-box">
          <h1>Data Pengeluaran</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Kategori</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  -- Pilih Kategori --
                </option>
                <option value="Perbaikan Jalan">
                  Perbaikan Jalan
                </option>
                <option value="Perbaikan Selokan">
                  Perbaikan Selokan
                </option>
                <option value="Gaji Satpam">
                  Gaji Satpam
                </option>
                <option value="Token Listrik Pos Satpam">
                  Token Listrik Pos Satpam
                </option>
                <option value="Lainnya">
                  Lainnya
                </option>
              </select>
            </div>

            {/* Deskripsi hanya muncul untuk kategori Lainnya */}
            {form.category === "Lainnya" && (
              <div className="input-group">
                <label>Deskripsi</label>

                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Contoh: Pembelian alat kebersihan"
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label>Nominal</label>

              <input
                type="text"
                inputMode="numeric"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Contoh: 500000"
                required
              />
            </div>

            <div className="input-group">
              <label>Tanggal Pengeluaran</label>

              <input
                type="date"
                name="expense_date"
                value={form.expense_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Bukti/Catatan</label>

              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Contoh: Dibayar tunai / Nota No. 018"
              />
            </div>

            <button type="submit" disabled={isSaving}>
              {isSaving
                ? "Sedang Menyimpan..."
                : editId
                  ? "Update Pengeluaran"
                  : "Simpan Pengeluaran"}
            </button>
          </form>
        </div>

        {/* List Pengeluaran */}
        <div className="table-box">
          <h2>List Pengeluaran</h2>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Nominal</th>
                <th>Tanggal</th>
                <th>Bukti/Catatan</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">
                    Belum ada data pengeluaran.
                  </td>
                </tr>
              ) : (
                expenses.map((expense, index) => (
                  <tr key={expense.id}>
                    <td>{index + 1}</td>

                    <td>{expense.category}</td>

                    <td>
                      {expense.category === "Lainnya"
                        ? expense.description || "-"
                        : "-"}
                    </td>

                    <td>
                      Rp {formatRupiah(expense.amount)}
                    </td>

                    <td>{expense.expense_date}</td>

                    <td>{expense.notes || "-"}</td>

                    <td>
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(expense)}
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

export default ExpensesList;