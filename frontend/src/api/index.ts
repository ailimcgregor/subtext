import axios from "axios";
import { ResponseType } from "../types";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
});

export const getResultsForYT = async (payload: any): Promise<ResponseType> => {
  if (!payload?.url) {
    const formData = new FormData();
    formData.set("audio", payload.file);
    console.log(formData);
    const response = await API.post("/analyze_audio", formData);
    return response.data;
  } else {
    const response = await API.post("/analyze_youtube", payload);
    return response.data;
  }
};
