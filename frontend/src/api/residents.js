const API_URL = "http://127.0.0.1:8000/api/residents";

export const getResidents = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createResident = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: data,
  });

  return response.json();
};

export const updateResident = async (id, data) => {
  data.append("_method", "PUT");

  const response = await fetch(`${API_URL}/${id}`, {
    method: "POST",
    body: data,
  });

  return response.json();
};