const API_URL = "http://127.0.0.1:8000/api/houses";

export const getHouses = async () => {
  const response = await fetch(API_URL, {
    cache: "no-store",
  });

  return response.json();
};

export const createHouse = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal menyimpan data rumah");
  }

  return result;
};

export const updateHouse = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengupdate data rumah");
  }

  return result;
};