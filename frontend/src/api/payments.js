const API_URL = "http://127.0.0.1:8000/api/payments";

export const getPayments = async () => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createPayment = async (data) => {
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