import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}/app`,
  withCredentials: true
});

export const getCases = async () => {
  const res = await api.get("/");
  return res.data;
};

export const checkUserCase = async () => {
  const res = await api.get("/user");
  return res.data;
};

export const addCase = async () => {
  try {
    const res = await api.post("/user/add");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeCase = async () => {
  const res = await api.get("/user/remove");
  return res.data;
};
