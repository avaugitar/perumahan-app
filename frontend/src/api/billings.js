const API_URL = "http://127.0.0.1:8000/api/billings";

export const getBillings = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createBilling = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const updateBilling = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};