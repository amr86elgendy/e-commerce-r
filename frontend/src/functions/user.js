import axios from 'axios'

export const addToWishlist = async (productId, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/wishlist`,
    { productId },
    {
      headers: {
        token,
      },
    }
  )

export const getWishlist = async (token) =>
  await axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {
    headers: {
      token,
    },
  })

export const removeWishlist = async (productId, token) =>
  await axios.delete(
    `${process.env.REACT_APP_API}/user/wishlist/${productId}`,
    {
      headers: {
        token,
      },
    }
  )
