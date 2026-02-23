const BASE_URL = "http://localhost:5000";

export const getFeedback = async () => {
  const res = await fetch(`${BASE_URL}/api/feedback`);
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return res.json();
};

export const getServiceCases = async () => {
  const res = await fetch(`${BASE_URL}/api/service-cases`);
  if (!res.ok) throw new Error("Failed to fetch cases");
  return res.json();
};
