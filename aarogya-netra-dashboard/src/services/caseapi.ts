export const getCases = async () => {
  const response = await fetch("http://localhost:5000/api/cases");
  if (!response.ok) {
    throw new Error("Failed to fetch cases");
  }
  return response.json();
};