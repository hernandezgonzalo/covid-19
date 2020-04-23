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

export const activeUser = async userId => {
  try {
    const res = await api.post("/active", { userId });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const inactiveUser = async userId => {
  try {
    const res = await api.post("/inactive", { userId });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async userId => {
  try {
    const res = await api.post("/delete", { userId });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addUser = async data => {
  try {
    const createUser = await api.post("/add", data);

    // upload image to Cloudinary and appdend it to the new user
    const formData = new FormData();
    formData.append("image", data.profilePic);
    formData.append("userId", createUser.data.newUser.id);
    const userWithPic = await api.post("/image", formData);

    return userWithPic.data;
  } catch (error) {
    throw error;
  }
};
