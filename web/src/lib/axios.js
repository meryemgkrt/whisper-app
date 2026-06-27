import axios from "axios";

const api = axios.create({
  baseURL: "https://whisper-app-lhf2v.sevalla.app/api",
});

export default api;