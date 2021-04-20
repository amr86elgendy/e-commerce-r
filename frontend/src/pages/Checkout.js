import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  applyCoupon,
  deleteUserCart,
  getUserCart,
  saveAddress,
} from '../functions/cart'
import { createCashOrder } from '../functions/order'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Checkout = ({ history }) => {
  const [order, setOrder] = useState({})
  const [address, setAddress] = useState('')
  const [addressSaved, setAddressSaved] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
  const [discountError, setDiscountError] = useState('')

  const {
    cashOnDelivery,
    coupon: couponState,
    user,
  } = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch()

  useEffect(() => {
    getUserCart(user.token).then(({ data }) => {
      setOrder(data)
    })
  }, [])

  const saveAddressToDb = () => {
    saveAddress(address, user.token).then(({ data }) => {
      if (data) {
        setAddressSaved(true)
        toast.success('Address saved')
      }
    })
  }

  const handleEmptyCart = () => {
    setOrder({})
    setCoupon('')
    setTotalAfterDiscount(0)
    localStorage.removeItem('cart')
    dispatch({
      type: 'ADD_TO_CART',
      payload: [],
    })
    deleteUserCart(user.token).then(({}) => {
      setOrder({})
      toast.success('Cartis empty , Continue shopping')
    })
  }

  const applyDiscountCoupon = () => {
    applyCoupon(coupon, user.token).then(({ data }) => {
      console.log(data)
      if (!data.err) {
        setTotalAfterDiscount(data)
        dispatch({
          type: 'COUPON_APPLIED',
          payload: true,
        })
      } else {
        setDiscountError(data.err)
        dispatch({
          type: 'COUPON_APPLIED',
          payload: false,
        })
      }
    })
  }

  const handleCashOrder = async () => {
    const { data } = await createCashOrder(
      user.token,
      cashOnDelivery,
      couponState
    )
    if (data.ok) {
      localStorage.removeItem('cart')
      dispatch({ type: 'ADD_TO_CART', payload: [] })
      dispatch({ type: 'COUPON_APPLIED', payload: false })
      dispatch({ type: 'COD', payload: false })
      await deleteUserCart(user.token);
      history.push('/user/history')
    }
  }

  return (
    <div className='row'>
      <div className='col-md-6'>
        <h4>Delivery Address</h4>
        <br />
        <br />
        <ReactQuill theme='snow' value={address} onChange={setAddress} />
        <button className='btn btn-primary mt-2' onClick={saveAddressToDb}>
          Save
        </button>
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        <input
          onChange={(e) => {
            setCoupon(e.target.value)
            setDiscountError('')
          }}
          value={coupon}
          type='text'
          className='form-control'
        />
        <button onClick={applyDiscountCoupon} className='btn btn-primary mt-2'>
          Apply
        </button>
        <br />
        {discountError && <p className='bg-danger p-2'>{discountError}</p>}
      </div>

      <div className='col-md-6'>
        <h4>Order Summary</h4>
        <hr />
        <p>Products {order && order.products ? order.products.length : 0}</p>
        <hr />
        {order &&
          order.products &&
          order.products.map((p, i) => (
            <div key={i}>
              <p>
                {p.product.title} ({p.color}) x {p.count} ={' '}
                {p.product.price * p.count}
              </p>
            </div>
          ))}
        <hr />
        <p>Total Price: $ {order ? order.totalPrice : 0}</p>
        {totalAfterDiscount > 0 && (
          <p className='bg-success p-2'>
            Discount Applied: Total Payable: ${totalAfterDiscount}
          </p>
        )}
        <div className='row'>
          <div className='col-md-6'>
            {cashOnDelivery ? (
              <button
                className='btn btn-primary'
                disabled={!addressSaved || !order}
                onClick={handleCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className='btn btn-primary'
                disabled={!addressSaved || !order}
                onClick={() => history.push('/payment')}
              >
                Place Order
              </button>
            )}
          </div>

          <div className='col-md-6'>
            <button
              className='btn btn-primary'
              disabled={!order}
              onClick={handleEmptyCart}
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
