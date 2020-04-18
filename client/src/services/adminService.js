import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}/admin`,
  withCredentials: true
});

export const searchUsers = async (pageSize, page, search) => {
  const res = await api.post("/", { pageSize, page, search });
  return res.data;
};
