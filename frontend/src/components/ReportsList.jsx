import { useEffect, useState } from "react";
import { getPayments } from "../api/payments";
import { getExpenses } from "../api/expenses";

function ReportsList() {
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const fetchData = async () => {
    const paymentsData = await getPayments();
    const expensesData = await getExpenses();

    setPayments(paymentsData);
    setExpenses(expensesData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatRupiah = (value) => {
    return Number(value || 0).toLocaleString("id-ID");
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const getYearMonth = (dateString) => {
    if (!dateString) return null;

    const parts = dateString.split("-");

    return {
      year: Number(parts[0]),
      month: Number(parts[1]),
    };
  };

  const yearlyData = monthNames.map((monthName, index) => {
    const month = index + 1;

    const pemasukan = payments
      .filter((payment) => {
        const date = getYearMonth(payment.payment_date);
        return date?.year === Number(selectedYear) && date?.month === month;
      })
      .reduce((total, payment) => total + Number(payment.amount_paid || 0), 0);

    const pengeluaran = expenses
      .filter((expense) => {
        const date = getYearMonth(expense.expense_date);
        return date?.year === Number(selectedYear) && date?.month === month;
      })
      .reduce((total, expense) => total + Number(expense.amount || 0), 0);

    return {
      month,
      monthName,
      pemasukan,
      pengeluaran,
      saldo: pemasukan - pengeluaran,
    };
  });

  const totalPemasukan = yearlyData.reduce(
    (total, row) => total + row.pemasukan,
    0
  );

  const totalPengeluaran = yearlyData.reduce(
    (total, row) => total + row.pengeluaran,
    0
  );

  const saldo = totalPemasukan - totalPengeluaran;

  const maxValue =
    Math.max(
      ...yearlyData.map((row) => row.pemasukan),
      ...yearlyData.map((row) => row.pengeluaran),
      1
    ) || 1;

  const detailPemasukan = payments.filter((payment) => {
    const date = getYearMonth(payment.payment_date);

    return (
      date?.year === Number(selectedYear) &&
      date?.month === Number(selectedMonth)
    );
  });

  const detailPengeluaran = expenses.filter((expense) => {
    const date = getYearMonth(expense.expense_date);

    return (
      date?.year === Number(selectedYear) &&
      date?.month === Number(selectedMonth)
    );
  });

  const totalDetailPemasukan = detailPemasukan.reduce((total, payment) => {
    return total + Number(payment.amount_paid || 0);
  }, 0);

  const totalDetailPengeluaran = detailPengeluaran.reduce((total, expense) => {
    return total + Number(expense.amount || 0);
  }, 0);

  const saldoDetailBulan = totalDetailPemasukan - totalDetailPengeluaran;

  return (
    <div className="page">
      <div className="payment-layout">
        <div className="year-filter">
          <label>Pilih Tahun</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          />

          <label>Pilih Bulan</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {monthNames.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Pemasukan Tahun {selectedYear}</h3>
            <p>Rp {formatRupiah(totalPemasukan)}</p>
          </div>

          <div className="summary-card">
            <h3>Total Pengeluaran Tahun {selectedYear}</h3>
            <p>Rp {formatRupiah(totalPengeluaran)}</p>
          </div>

          <div className="summary-card">
            <h3>Saldo Tahun {selectedYear}</h3>
            <p>Rp {formatRupiah(saldo)}</p>
          </div>
        </div>

        <div className="table-box">
          <h2>Grafik Pemasukan dan Pengeluaran Tahun {selectedYear}</h2>

          <div className="chart-legend">
            <span>Pemasukan</span>
            <span>Pengeluaran</span>
          </div>

          <div className="chart-box">
            {yearlyData.map((row) => (
              <div className="chart-row" key={row.month}>
                <div className="chart-month">{row.monthName}</div>

                <div className="chart-bars">
                  <div className="chart-item">
                    <div
                      className="bar-income"
                      style={{
                        width: `${(row.pemasukan / maxValue) * 100}%`,
                      }}
                    ></div>
                    <small>Rp {formatRupiah(row.pemasukan)}</small>
                  </div>

                  <div className="chart-item">
                    <div
                      className="bar-expense"
                      style={{
                        width: `${(row.pengeluaran / maxValue) * 100}%`,
                      }}
                    ></div>
                    <small>Rp {formatRupiah(row.pengeluaran)}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="table-box" style={{ marginTop: "28px" }}>
          <h2>Laporan Bulanan Tahun {selectedYear}</h2>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Bulan</th>
                <th>Pemasukan</th>
                <th>Pengeluaran</th>
                <th>Saldo Bulanan</th>
              </tr>
            </thead>

            <tbody>
              {yearlyData.map((row, index) => (
                <tr key={row.month}>
                  <td>{index + 1}</td>
                  <td>{row.monthName}</td>
                  <td>Rp {formatRupiah(row.pemasukan)}</td>
                  <td>Rp {formatRupiah(row.pengeluaran)}</td>
                  <td>Rp {formatRupiah(row.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="summary-cards" style={{ marginTop: "28px" }}>
          <div className="summary-card">
            <h3>
              Pemasukan {monthNames[selectedMonth - 1]} {selectedYear}
            </h3>
            <p>Rp {formatRupiah(totalDetailPemasukan)}</p>
          </div>

          <div className="summary-card">
            <h3>
              Pengeluaran {monthNames[selectedMonth - 1]} {selectedYear}
            </h3>
            <p>Rp {formatRupiah(totalDetailPengeluaran)}</p>
          </div>

          <div className="summary-card">
            <h3>
              Saldo {monthNames[selectedMonth - 1]} {selectedYear}
            </h3>
            <p>Rp {formatRupiah(saldoDetailBulan)}</p>
          </div>
        </div>

        <div className="table-box">
          <h2>
            Detail Pemasukan {monthNames[selectedMonth - 1]} {selectedYear}
          </h2>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Rumah</th>
                <th>Penghuni</th>
                <th>Iuran</th>
                <th>Jumlah Bayar</th>
                <th>Tanggal Bayar</th>
                <th>Catatan</th>
              </tr>
            </thead>

            <tbody>
              {detailPemasukan.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty">
                    Belum ada pemasukan pada bulan ini.
                  </td>
                </tr>
              ) : (
                detailPemasukan.map((payment, index) => (
                  <tr key={payment.id}>
                    <td>{index + 1}</td>
                    <td>
                      {payment.billing?.house?.block
                        ? `Blok ${payment.billing.house.block} - `
                        : ""}
                      Rumah {payment.billing?.house?.house_number}
                    </td>
                    <td>{payment.billing?.resident?.full_name || "-"}</td>
                    <td>{payment.billing?.fee_type?.name || "-"}</td>
                    <td>Rp {formatRupiah(payment.amount_paid)}</td>
                    <td>{payment.payment_date}</td>
                    <td>{payment.notes || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-box" style={{ marginTop: "28px" }}>
          <h2>
            Detail Pengeluaran {monthNames[selectedMonth - 1]} {selectedYear}
          </h2>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th>Nominal</th>
                <th>Tanggal</th>
                <th>Bukti/Catatan</th>
              </tr>
            </thead>

            <tbody>
              {detailPengeluaran.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty">
                    Belum ada pengeluaran pada bulan ini.
                  </td>
                </tr>
              ) : (
                detailPengeluaran.map((expense, index) => (
                  <tr key={expense.id}>
                    <td>{index + 1}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td>Rp {formatRupiah(expense.amount)}</td>
                    <td>{expense.expense_date}</td>
                    <td>{expense.proof_photo || "-"}</td>
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

export default ReportsList;