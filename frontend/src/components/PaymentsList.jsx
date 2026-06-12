import { useEffect, useState } from "react";
import { getHouses } from "../api/houses";
import { getResidents } from "../api/residents";
import { getFeeTypes } from "../api/feeTypes";
import { getBillings, createBilling } from "../api/billings";
import { getPayments, createPayment } from "../api/payments";

const MONTH_NAMES = [
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

const initialBillingForm = {
  house_id: "",
  resident_id: "",
  fee_type_id: "",
  billing_month: "",
  billing_year: new Date().getFullYear(),
  amount: "",
  status: "belum_lunas",
  due_date: "",
};

const initialPaymentForm = {
  billing_id: "",
  amount_paid: "",
  payment_date: "",
  notes: "",
  payment_proof: "",
  payment_duration: "1",
};

function PaymentsList() {
  // ==============================
  // DATA UTAMA
  // ==============================

  const [houses, setHouses] = useState([]);
  const [residents, setResidents] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [billings, setBillings] = useState([]);
  const [payments, setPayments] = useState([]);

  // ==============================
  // FORM
  // ==============================

  const [billingForm, setBillingForm] =
    useState(initialBillingForm);

  const [paymentForm, setPaymentForm] =
    useState(initialPaymentForm);

  const [isSavingBilling, setIsSavingBilling] =
    useState(false);

  const [isSavingPayment, setIsSavingPayment] =
    useState(false);

  // ==============================
  // AMBIL DATA
  // ==============================

  const fetchData = async () => {
    try {
      const [
        housesData,
        residentsData,
        feeTypesData,
        billingsData,
        paymentsData,
      ] = await Promise.all([
        getHouses(),
        getResidents(),
        getFeeTypes(),
        getBillings(),
        getPayments(),
      ]);

      setHouses(Array.isArray(housesData) ? housesData : []);
      setResidents(
        Array.isArray(residentsData) ? residentsData : []
      );
      setFeeTypes(
        Array.isArray(feeTypesData) ? feeTypesData : []
      );
      setBillings(
        Array.isArray(billingsData) ? billingsData : []
      );
      setPayments(
        Array.isArray(paymentsData) ? paymentsData : []
      );
    } catch (error) {
      console.error("Gagal mengambil data pembayaran:", error);
      alert(
        error.message ||
          "Gagal mengambil data pembayaran."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==============================
  // FUNCTION BANTUAN
  // ==============================

  const formatRupiah = (value) => {
    return Number(value || 0).toLocaleString("id-ID");
  };

  const getActiveOccupants = (house) => {
    return (
      house?.house_occupants ||
      house?.houseOccupants ||
      []
    );
  };

  const getFeeTypeName = (billing) => {
    return (
      billing?.fee_type?.name ||
      billing?.feeType?.name ||
      ""
    );
  };

  const getSelectedBilling = () => {
    return billings.find(
      (billing) =>
        String(billing.id) ===
        String(paymentForm.billing_id)
    );
  };

  const isSelectedBillingCleaning = () => {
    const selectedBilling = getSelectedBilling();

    return (
      getFeeTypeName(selectedBilling).toLowerCase() ===
      "kebersihan"
    );
  };

  const getTodayString = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(
      2,
      "0"
    );
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getBillingStatus = (billing) => {
    const today = getTodayString();

    if (billing.status === "lunas") {
      return {
        label: "Lunas",
        className: "badge badge-success",
      };
    }

    if (billing.due_date && billing.due_date < today) {
      return {
        label: "Terlambat",
        className: "badge badge-danger",
      };
    }

    return {
      label: "Belum lunas",
      className: "badge badge-warning",
    };
  };

  const getSelectedResidentName = () => {
    const selectedResident = residents.find(
      (resident) =>
        String(resident.id) ===
        String(billingForm.resident_id)
    );

    return selectedResident?.full_name || "";
  };

  const getBillingLabel = (billing) => {
    const block = billing.house?.block
      ? `Blok ${billing.house.block} - `
      : "";

    const houseNumber =
      billing.house?.house_number || "-";

    const residentName =
      billing.resident?.full_name || "-";

    const feeName = getFeeTypeName(billing) || "-";

    return `${block}Rumah ${houseNumber} | ${residentName} | ${feeName} | ${billing.billing_month}/${billing.billing_year}`;
  };

  const getNextMonthYear = (
    startMonth,
    startYear,
    addMonth
  ) => {
    const date = new Date(
      Number(startYear),
      Number(startMonth) - 1 + addMonth,
      1
    );

    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  };

  const findBillingByPeriod = ({
    houseId,
    residentId,
    feeTypeId,
    month,
    year,
  }) => {
    return billings.find(
      (billing) =>
        Number(billing.house_id) === Number(houseId) &&
        Number(billing.resident_id) ===
          Number(residentId) &&
        Number(billing.fee_type_id) ===
          Number(feeTypeId) &&
        Number(billing.billing_month) ===
          Number(month) &&
        Number(billing.billing_year) === Number(year)
    );
  };

  const calculatePaymentAmount = (
    billingId,
    duration
  ) => {
    const selectedBilling = billings.find(
      (billing) =>
        String(billing.id) === String(billingId)
    );

    if (!selectedBilling) {
      return "";
    }

    if (Number(duration) === 12) {
      return Number(selectedBilling.amount || 0) * 12;
    }

    return selectedBilling.amount || "";
  };

  // ==============================
  // FORM BUAT TAGIHAN
  // ==============================

  const handleBillingChange = (e) => {
    const { name, value } = e.target;

    if (name === "house_id") {
      if (!value) {
        setBillingForm((previousForm) => ({
          ...previousForm,
          house_id: "",
          resident_id: "",
        }));

        return;
      }

      const selectedHouse = houses.find(
        (house) =>
          String(house.id) === String(value)
      );

      const activeOccupant =
        getActiveOccupants(selectedHouse)[0];

      if (!activeOccupant) {
        alert(
          "Rumah ini tidak memiliki penghuni aktif sehingga belum dapat dibuatkan tagihan."
        );

        setBillingForm((previousForm) => ({
          ...previousForm,
          house_id: "",
          resident_id: "",
        }));

        return;
      }

      setBillingForm((previousForm) => ({
        ...previousForm,
        house_id: value,
        resident_id:
          activeOccupant.resident_id ||
          activeOccupant.resident?.id ||
          "",
      }));

      return;
    }

    if (name === "fee_type_id") {
      const selectedFee = feeTypes.find(
        (fee) =>
          String(fee.id) === String(value)
      );

      setBillingForm((previousForm) => ({
        ...previousForm,
        fee_type_id: value,
        amount: selectedFee
          ? selectedFee.amount
          : "",
      }));

      return;
    }

    setBillingForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();

    if (!billingForm.resident_id) {
      alert(
        "Pilih rumah yang memiliki penghuni aktif."
      );
      return;
    }

    const existingBilling = findBillingByPeriod({
      houseId: billingForm.house_id,
      residentId: billingForm.resident_id,
      feeTypeId: billingForm.fee_type_id,
      month: billingForm.billing_month,
      year: billingForm.billing_year,
    });

    if (existingBilling) {
      alert(
        "Tagihan untuk rumah, penghuni, jenis iuran, bulan, dan tahun tersebut sudah tersedia."
      );
      return;
    }

    try {
      setIsSavingBilling(true);

      await createBilling({
        house_id: billingForm.house_id,
        resident_id: billingForm.resident_id,
        fee_type_id: billingForm.fee_type_id,
        billing_month: Number(
          billingForm.billing_month
        ),
        billing_year: Number(
          billingForm.billing_year
        ),
        amount: Number(billingForm.amount),
        status: "belum_lunas",
        due_date: billingForm.due_date || null,
      });

      alert("Tagihan bulanan berhasil dibuat.");

      setBillingForm(initialBillingForm);

      await fetchData();
    } catch (error) {
      alert(
        error.message || "Gagal membuat tagihan."
      );
    } finally {
      setIsSavingBilling(false);
    }
  };

  // ==============================
  // FORM INPUT PEMBAYARAN
  // ==============================

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    const nextForm = {
      ...paymentForm,
      [name]: value,
    };

    if (name === "billing_id") {
      const selectedBilling = billings.find(
        (billing) =>
          String(billing.id) === String(value)
      );

      // Setiap memilih tagihan, periode kembali ke 1 bulan.
      nextForm.payment_duration = "1";
      nextForm.amount_paid =
        selectedBilling?.amount || "";
    }

    if (name === "payment_duration") {
      nextForm.amount_paid =
        calculatePaymentAmount(
          nextForm.billing_id,
          value
        );
    }

    setPaymentForm(nextForm);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const selectedBilling = getSelectedBilling();

    if (!selectedBilling) {
      alert("Pilih tagihan terlebih dahulu.");
      return;
    }

    const paymentDuration = Number(
      paymentForm.payment_duration || 1
    );

    const selectedFeeName =
      getFeeTypeName(selectedBilling).toLowerCase();

    if (
      paymentDuration === 12 &&
      selectedFeeName !== "kebersihan"
    ) {
      alert(
        "Pembayaran 12 bulan hanya tersedia untuk iuran Kebersihan."
      );
      return;
    }

    try {
      setIsSavingPayment(true);

      // ==============================
      // PEMBAYARAN KEBERSIHAN 12 BULAN
      // ==============================

      if (paymentDuration === 12) {
        const periodBillings = [];

        // Cek terlebih dahulu apakah ada tagihan
        // dalam periode 12 bulan yang sudah lunas.
        for (let index = 0; index < 12; index++) {
          const { month, year } =
            getNextMonthYear(
              selectedBilling.billing_month,
              selectedBilling.billing_year,
              index
            );

          const existingBilling =
            findBillingByPeriod({
              houseId: selectedBilling.house_id,
              residentId:
                selectedBilling.resident_id,
              feeTypeId:
                selectedBilling.fee_type_id,
              month,
              year,
            });

          if (
            existingBilling &&
            existingBilling.status === "lunas"
          ) {
            alert(
              `Tagihan Kebersihan periode ${month}/${year} sudah lunas. Pembayaran 12 bulan tidak dapat diproses ulang.`
            );
            return;
          }
        }

        // Buat tagihan bulan yang belum tersedia.
        for (let index = 0; index < 12; index++) {
          const { month, year } =
            getNextMonthYear(
              selectedBilling.billing_month,
              selectedBilling.billing_year,
              index
            );

          let monthlyBilling =
            findBillingByPeriod({
              houseId: selectedBilling.house_id,
              residentId:
                selectedBilling.resident_id,
              feeTypeId:
                selectedBilling.fee_type_id,
              month,
              year,
            });

          if (!monthlyBilling) {
            monthlyBilling = await createBilling({
              house_id:
                selectedBilling.house_id,
              resident_id:
                selectedBilling.resident_id,
              fee_type_id:
                selectedBilling.fee_type_id,
              billing_month: month,
              billing_year: year,
              amount: Number(
                selectedBilling.amount
              ),
              status: "belum_lunas",
              due_date: null,
            });
          }

          periodBillings.push(monthlyBilling);
        }

        // Bayar seluruh tagihan Kebersihan 12 bulan.
        for (const billing of periodBillings) {
          await createPayment({
            billing_id: billing.id,
            amount_paid: Number(billing.amount),
            payment_date:
              paymentForm.payment_date,
            notes: paymentForm.notes,
            payment_proof:
              paymentForm.payment_proof
                ? `${paymentForm.payment_proof} - Pembayaran Kebersihan 12 bulan`
                : "Pembayaran Kebersihan 12 bulan",
          });
        }

        alert(
          "Pembayaran iuran Kebersihan selama 12 bulan berhasil disimpan."
        );
      } else {
        // ==============================
        // PEMBAYARAN 1 BULAN
        // ==============================

        await createPayment({
          billing_id: selectedBilling.id,
          amount_paid: Number(
            paymentForm.amount_paid
          ),
          payment_date:
            paymentForm.payment_date,
          notes: paymentForm.notes,
          payment_proof:
            paymentForm.payment_proof || "-",
        });

        alert(
          "Pembayaran bulanan berhasil disimpan."
        );
      }

      setPaymentForm(initialPaymentForm);

      await fetchData();
    } catch (error) {
      alert(
        error.message ||
          "Gagal menyimpan pembayaran."
      );
    } finally {
      setIsSavingPayment(false);
    }
  };

  // ==============================
  // TAMPILAN
  // ==============================

  return (
    <div className="page">
      <div className="payment-layout">
        <div className="payment-top">
          {/* ============================== */}
          {/* FORM BUAT TAGIHAN */}
          {/* ============================== */}

          <div className="form-box">
            <h1>Buat Tagihan</h1>

            <form onSubmit={handleBillingSubmit}>
              <div className="input-group">
                <label>Pilih Rumah</label>

                <select
                  name="house_id"
                  value={billingForm.house_id}
                  onChange={handleBillingChange}
                  required
                >
                  <option value="">
                    -- Pilih Rumah --
                  </option>

                  {houses
                    .filter(
                      (house) =>
                        getActiveOccupants(house)
                          .length > 0
                    )
                    .map((house) => (
                      <option
                        key={house.id}
                        value={house.id}
                      >
                        {house.block
                          ? `Blok ${house.block} - `
                          : ""}
                        Rumah {house.house_number}
                      </option>
                    ))}
                </select>
              </div>

              <div className="input-group">
                <label>Penghuni Aktif</label>

                <input
                  type="text"
                  value={getSelectedResidentName()}
                  placeholder="Nama penghuni otomatis muncul"
                  readOnly
                />
              </div>

              <div className="input-group">
                <label>Jenis Iuran</label>

                <select
                  name="fee_type_id"
                  value={
                    billingForm.fee_type_id
                  }
                  onChange={handleBillingChange}
                  required
                >
                  <option value="">
                    -- Pilih Iuran --
                  </option>

                  {feeTypes.map((fee) => (
                    <option
                      key={fee.id}
                      value={fee.id}
                    >
                      {fee.name} - Rp{" "}
                      {formatRupiah(fee.amount)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Bulan Tagihan</label>

                <select
                  name="billing_month"
                  value={
                    billingForm.billing_month
                  }
                  onChange={handleBillingChange}
                  required
                >
                  <option value="">
                    -- Pilih Bulan --
                  </option>

                  {MONTH_NAMES.map(
                    (monthName, index) => (
                      <option
                        key={monthName}
                        value={index + 1}
                      >
                        {monthName}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="input-group">
                <label>Tahun Tagihan</label>

                <input
                  type="number"
                  name="billing_year"
                  value={
                    billingForm.billing_year
                  }
                  onChange={handleBillingChange}
                  min="2000"
                  max="2100"
                  required
                />
              </div>

              <div className="input-group">
                <label>Nominal Tagihan</label>

                <input
                  type="number"
                  name="amount"
                  value={billingForm.amount}
                  onChange={handleBillingChange}
                  min="0"
                  readOnly
                  required
                />
              </div>

              <div className="input-group">
                <label>Jatuh Tempo</label>

                <input
                  type="date"
                  name="due_date"
                  value={billingForm.due_date}
                  onChange={handleBillingChange}
                />
              </div>

              <button
                type="submit"
                disabled={isSavingBilling}
              >
                {isSavingBilling
                  ? "Sedang Menyimpan..."
                  : "Simpan Tagihan"}
              </button>
            </form>
          </div>

          {/* ============================== */}
          {/* FORM INPUT PEMBAYARAN */}
          {/* ============================== */}

          <div className="form-box">
            <h1>Input Pembayaran</h1>

            <form onSubmit={handlePaymentSubmit}>
              <div className="input-group">
                <label>Pilih Tagihan</label>

                <select
                  name="billing_id"
                  value={paymentForm.billing_id}
                  onChange={handlePaymentChange}
                  required
                >
                  <option value="">
                    -- Pilih Tagihan --
                  </option>

                  {billings
                    .filter(
                      (billing) =>
                        billing.status !== "lunas"
                    )
                    .map((billing) => (
                      <option
                        key={billing.id}
                        value={billing.id}
                      >
                        {getBillingLabel(billing)} -
                        Rp{" "}
                        {formatRupiah(
                          billing.amount
                        )}
                      </option>
                    ))}
                </select>
              </div>

              <div className="input-group">
                <label>Periode Pembayaran</label>

                <select
                  name="payment_duration"
                  value={
                    paymentForm.payment_duration
                  }
                  onChange={handlePaymentChange}
                  disabled={
                    !paymentForm.billing_id
                  }
                  required
                >
                  <option value="1">
                    Bayar 1 bulan
                  </option>

                  {isSelectedBillingCleaning() && (
                    <option value="12">
                      Bayar 1 tahun / 12 bulan
                    </option>
                  )}
                </select>
              </div>

              <div className="input-group">
                <label>Nominal Dibayar</label>

                <input
                  type="number"
                  name="amount_paid"
                  value={
                    paymentForm.amount_paid
                  }
                  onChange={handlePaymentChange}
                  min="0"
                  readOnly
                  required
                />
              </div>

              <div className="input-group">
                <label>Tanggal Bayar</label>

                <input
                  type="date"
                  name="payment_date"
                  value={
                    paymentForm.payment_date
                  }
                  onChange={handlePaymentChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>
                  Metode Pembayaran
                </label>

                <select
                  name="notes"
                  value={paymentForm.notes}
                  onChange={handlePaymentChange}
                  required
                >
                  <option value="">
                    -- Pilih Metode --
                  </option>
                  <option value="Tunai">
                    Tunai
                  </option>
                  <option value="Transfer">
                    Transfer
                  </option>
                </select>
              </div>

              <div className="input-group">
                <label>
                  Keterangan Pembayaran
                </label>

                <input
                  type="text"
                  name="payment_proof"
                  value={
                    paymentForm.payment_proof
                  }
                  onChange={handlePaymentChange}
                  placeholder={
                    paymentForm.notes ===
                    "Transfer"
                      ? "Contoh: Bukti transfer dikirim via WhatsApp"
                      : "Contoh: Tunai langsung ke bendahara"
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSavingPayment}
              >
                {isSavingPayment
                  ? "Sedang Menyimpan..."
                  : "Simpan Pembayaran"}
              </button>
            </form>
          </div>
        </div>

        {/* ============================== */}
        {/* DAFTAR TAGIHAN */}
        {/* ============================== */}

        <div className="payment-bottom">
          <div className="table-box">
            <h2>Daftar Tagihan</h2>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Rumah</th>
                  <th>Penghuni</th>
                  <th>Jenis Iuran</th>
                  <th>Periode Iuran</th>
                  <th>Jatuh Tempo</th>
                  <th>Nominal Tagihan</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {billings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="empty"
                    >
                      Belum ada tagihan.
                    </td>
                  </tr>
                ) : (
                  billings.map(
                    (billing, index) => {
                      const billingStatus =
                        getBillingStatus(billing);

                      return (
                        <tr key={billing.id}>
                          <td>{index + 1}</td>

                          <td>
                            {billing.house?.block
                              ? `Blok ${billing.house.block} - `
                              : ""}
                            Rumah{" "}
                            {billing.house
                              ?.house_number || "-"}
                          </td>

                          <td>
                            {billing.resident
                              ?.full_name || "-"}
                          </td>

                          <td>
                            {getFeeTypeName(
                              billing
                            ) || "-"}
                          </td>

                          <td>
                            {
                              billing.billing_month
                            }
                            /
                            {
                              billing.billing_year
                            }
                          </td>

                          <td>
                            {billing.due_date ||
                              "-"}
                          </td>

                          <td>
                            Rp{" "}
                            {formatRupiah(
                              billing.amount
                            )}
                          </td>

                          <td>
                            <span
                              className={
                                billingStatus.className
                              }
                            >
                              {
                                billingStatus.label
                              }
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>

            {/* ============================== */}
            {/* HISTORY PEMBAYARAN */}
            {/* ============================== */}

            <h2 style={{ marginTop: "30px" }}>
              History Pembayaran
            </h2>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Rumah</th>
                  <th>Penghuni</th>
                  <th>Jenis Iuran</th>
                  <th>Nominal Dibayar</th>
                  <th>Tanggal Bayar</th>
                  <th>Metode Pembayaran</th>
                  <th>
                    Keterangan Pembayaran
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="empty"
                    >
                      Belum ada pembayaran.
                    </td>
                  </tr>
                ) : (
                  payments.map(
                    (payment, index) => (
                      <tr key={payment.id}>
                        <td>{index + 1}</td>

                        <td>
                          {payment.billing?.house
                            ?.block
                            ? `Blok ${payment.billing.house.block} - `
                            : ""}
                          Rumah{" "}
                          {payment.billing?.house
                            ?.house_number || "-"}
                        </td>

                        <td>
                          {payment.billing
                            ?.resident?.full_name ||
                            "-"}
                        </td>

                        <td>
                          {getFeeTypeName(
                            payment.billing
                          ) || "-"}
                        </td>

                        <td>
                          Rp{" "}
                          {formatRupiah(
                            payment.amount_paid
                          )}
                        </td>

                        <td>
                          {payment.payment_date ||
                            "-"}
                        </td>

                        <td>
                          {payment.notes || "-"}
                        </td>

                        <td>
                          {payment.payment_proof ||
                            "-"}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentsList;