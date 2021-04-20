import axios from 'axios';

export const getAllSubs = async () =>
  await axios.get(`${process.env.REACT_APP_API}/subs`);

export const getSingleSub = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/sub/${slug}`);

export const deleteSub = async (slug, token) =>
  await axios.delete(`${process.env.REACT_APP_API}/sub/${slug}`, {
    headers: {
      token,
    },
  });

export const updateSub = async (slug, sub, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/sub/${slug}`,
    sub,
    { headers: { token } }
  );

export const createSub = async (sub, token) =>
  await axios.post(`${process.env.REACT_APP_API}/sub`, sub, {
    headers: {
      token,
    },
  });
