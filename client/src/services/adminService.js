import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}/admin`,
  withCredentials: true
});

export const searchUsers = async (
  pageSize,
  page,
  search,
  orderBy,
  orderDirection
) => {
  const res = await api.post("/", {
    pageSize,
    page,
    search,
    orderBy,
    orderDirection
  });
  return res.data;
};

export const findCase = async caseId => {
  try {
    const res = await api.post("/find-case", { caseId });
    return res.data;
  } catch (error) {
    throw error;
  }
};
