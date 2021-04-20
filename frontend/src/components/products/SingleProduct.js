import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Tabs, Tooltip } from 'antd'
import { addToWishlist } from '../../functions/user'
import {
  HeartOutlined,
  ShoppingCartOutlined,
  HeartFilled,
} from '@ant-design/icons'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import ProductsItems from './ProductsItems'
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal'
import { ratingAverage } from '../../functions/rating'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

const SingleProduct = ({ product, handleRating, star }) => {
  const { title, description, images, _id, ratings } = product

  const dispatch = useDispatch()
  const { cart, user } = useSelector((state) => ({ ...state }))

  const history = useHistory()

  const handleAddToCart = () => {
    let cart = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : []
    let alreadyExist = cart.some((p) => p._id === product._id)
    if (!alreadyExist) {
      cart.push({ ...product, count: 1 })
      localStorage.setItem('cart', JSON.stringify(cart))

      dispatch({
        type: 'ADD_TO_CART',
        payload: cart,
      })

      dispatch({
        type: 'SET_SIDEBAR',
        payload: true,
      })
    }
  }

  const handleAddToWishlist = () => {
    addToWishlist(_id, user.token).then((res) => {
      toast.success('Added to wishlist')
      history.push('/user/wishlist')
    })
  }

  const handleTooltip = () => {
    const added = cart.some((p) => p._id === product._id)
    if (added) return 'added'
    else return 'Click to add'
  }

  return (
    <>
      <div className='col-md-7'>
        <Carousel showArrows={true} autoPlay infiniteLoop>
          {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
        </Carousel>
        <Tabs type='card'>
          <Tabs.TabPane tab='Description' key='1'>
            {description && description}
          </Tabs.TabPane>
          <Tabs.TabPane tab='More' key='2'>
            Call use on xxxx xxx xxx to learn more about this product.
          </Tabs.TabPane>
        </Tabs>
      </div>

      <div className='col-md-5'>
        <h2 className='bg-info p-3'>{title}</h2>
        {ratings && ratings.length > 0 ? (
          ratingAverage(product)
        ) : (
          <div className='text-center pt-1 pb-3'>No rating yet</div>
        )}
        <Card
          actions={[
            <Tooltip title={handleTooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className='text-danger' /> <br /> Add to
                Cart
              </a>
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              {user && user.wishlist && user.wishlist.includes(_id) ? (
                <>
                  <HeartFilled className='text-danger' /> <br /> Added to
                  Wishlist
                </>
              ) : (
                <>
                  <HeartOutlined className='text-danger' /> <br /> Add to
                  Wishlist
                </>
              )}
            </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={handleRating}
                isSelectable={true}
                starRatedColor='red'
              />
            </RatingModal>,
          ]}
        >
          <ProductsItems product={product} />
        </Card>
      </div>
    </>
  )
}

export default SingleProduct
