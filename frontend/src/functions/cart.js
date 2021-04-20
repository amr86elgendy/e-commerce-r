import axios from 'axios'

export const createCart = async (cart, token) => {
  return await axios.post(
    `${process.env.REACT_APP_API}/cart/create`,
    { cart },
    { headers: { token } }
  )
}

export const getUserCart = async (token) => {
  return await axios.get(`${process.env.REACT_APP_API}/cart`, {
    headers: { token },
  })
}

export const deleteUserCart = async (token) => {
  return await axios.delete(`${process.env.REACT_APP_API}/cart`, {
    headers: { token },
  })
}

export const saveAddress = async (address, token) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/user/address`,
    { address },
    { headers: { token } }
  )
}

export const applyCoupon = async (coupon, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/cart/coupon`,
    { coupon },
    { headers: { token } }
  )

