const API_URL = "http://127.0.0.1:8000/api/expenses";

const readResponse = async (response, defaultMessage) => {
  const result = await response.json();

  if (!response.ok) {
    const validationErrors = result.errors
      ? Object.values(result.errors).flat().join("\n")
      : null;

    throw new Error(
      validationErrors || result.message || defaultMessage
    );
  }

  return result;
};

export const getExpenses = async () => {
  const response = await fetch(API_URL, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  return readResponse(
    response,
    "Gagal mengambil data pengeluaran."
  );
};

export const createExpense = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  return readResponse(
    response,
    "Gagal menyimpan data pengeluaran."
  );
};

export const updateExpense = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  return readResponse(
    response,
    "Gagal mengubah data pengeluaran."
  );
};