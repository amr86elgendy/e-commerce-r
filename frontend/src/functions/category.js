import axios from "axios";

export const createCategory = async (name, token) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/category/create`,
    { name },
    { headers: { token } }
  );
};

export const getAllCategories = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API}/category/all`
  );
};

export const getSingleCategory = async (slug) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/category/${slug}`
  );
};

export const deleteCategory = async (slug, token) => {
  return await axios.delete(
    `${process.env.REACT_APP_API}/category/${slug}`,
    { headers: { token } }
  );
};

export const updateCategory = async (slug, name, token) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/category/${slug}`,
    { name },
    { headers: { token } }
  );
};

export const getSubCategories = async (id) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/category/subs/${id}`
  );
};