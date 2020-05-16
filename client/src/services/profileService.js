import axios from "axios";
import { getLocation } from "../lib/maps";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}/profile`
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const updateProfile = async ({
  username,
  password,
  name,
  surname,
  email
}) => {
  const location = await getLocation();
  const {
    data: { token, user }
  } = await api.post("/", {
    username,
    password,
    name,
    surname,
    email,
    location
  });
  localStorage.setItem("authToken", token);
  return user;
};

export const deleteAccount = async () => {
  return await api.get("/delete");
};

export const changeTheme = async theme => {
  return await api.post("/theme", { theme });
};

export const getTheme = async () => {
  const {
    data: { theme }
  } = await api.get("/theme");
  return theme;
};
