import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
});

export const getResults = async (payload: any): Promise<any> => {
  const formData = new FormData();
  formData.set("audio", payload);
  const response = await API.post("", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const getResultsForYT = async (payload: any): Promise<any> => {
  if (!payload?.url) {
    const formData = new FormData();
    formData.set("audio", payload);
    const response = await API.post("", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } else {
    const formData = new FormData();
    formData.set("audio", payload?.file);
    const response = await API.post("", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
};
