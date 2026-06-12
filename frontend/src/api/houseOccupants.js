const API_URL = "http://127.0.0.1:8000/api/house-occupants";

export const getHouseOccupants = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createHouseOccupant = async (data) => {
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

export const updateHouseOccupant = async (id, data) => {
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