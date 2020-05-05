import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}/notifications`
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getNotifications = async () => {
  const res = await api.get("/");
  return res.data;
};

export const markAsRead = async id => {
  const res = await api.post("/read", { id });
  return res.data;
};
