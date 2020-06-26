import React, { useContext } from "react";
import axios from "axios";
import { getLocation } from "../lib/maps";

export const UserContext = React.createContext();

export const useUser = () => {
  const userState = useContext(UserContext);
  return userState.user;
};

export const useUserSetter = () => {
  const userState = useContext(UserContext);
  return userState.setUser;
};

export const useUserIsLoading = () => {
  const userState = useContext(UserContext);
  return userState.loading;
};

export const useUserLogout = () => {
  const userState = useContext(UserContext);
  return async () => {
    userState.setUser(null);
    return logout();
  };
};

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = async ({
  username,
  password,
  name,
  surname,
  email,
  profilePic
}) => {
  const location = await getLocation();
  const {
    data: { token, user }
  } = await api.post("/auth/signup", {
    username,
    password,
    name,
    surname,
    email,
    location
  });
  localStorage.setItem("authToken", token);
  if (!profilePic[0]) return user;
  else return await upload(profilePic[0]);
};

// upload the image to Cloudinary and update the user document
export const upload = async file => {
  const data = new FormData();
  data.append("image", file);
  const res = await api.post("/profile/image", data);
  return res.data.user;
};

export const login = async ({ username, password }) => {
  const {
    data: { user, token }
  } = await api.post("/auth/login", {
    username,
    password
  });
  localStorage.setItem("authToken", token);
  return user;
};

export const logout = async () => {
  localStorage.removeItem("authToken");
};

export const loggedin = async () => {
  const res = await api.get("/auth/loggedin");
  return res.data.user;
};

export const facebookLogin = async facebookResponse => {
  const location = await getLocation();
  const authStr = "Bearer ".concat(facebookResponse.accessToken);
  return await api.post(
    "/auth/facebook",
    { location },
    { headers: { Authorization: authStr } }
  );
};
