import axios from 'axios'

export const createOrder = async (stripeResponse, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/order/create`,
    { stripeResponse },
    { headers: { token } }
  )

export const createCashOrder = async (token, COD, coupon) =>
  await axios.post(
    `${process.env.REACT_APP_API}/cash-order/create`,
    { COD, coupon },
    { headers: { token } }
  )
  
export const getUserOrders = async (token) =>
  await axios.get(`${process.env.REACT_APP_API}/orders`, { headers: { token } })
