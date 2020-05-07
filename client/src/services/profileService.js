import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const changeTheme = async theme => {
  return await api.post("/profile/theme", { theme });
};

export const getTheme = async () => {
  const {
    data: { theme }
  } = await api.get("/profile/theme");
  return theme;
};
