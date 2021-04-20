import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Tooltip } from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ratingAverage } from '../../functions/rating';

const ProductCard = ({ product }) => {
  const { images, title, description, slug, ratings, price, quantity } = product;
  
  const dispatch = useDispatch();
  const { cart, user } = useSelector(state => ({...state}));
  
  const handleAddToCart = () => {
    let cart = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    let alreadyExist = cart.some((p) => p._id === product._id);
    if (!alreadyExist) {
      cart.push({ ...product, count: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));

      dispatch({
        type: 'ADD_TO_CART',
        payload: cart
      });

      dispatch({
        type: 'SET_SIDEBAR',
        payload: true
      });
    }
  };

  const handleTooltip = () => {
    const added = cart.some((p) => p._id === product._id);
    if (added) return 'added'
    if (quantity === 0) return 'Out Of Stock'
    else return 'Click to add'
  };

  return (
    <>
      {ratings && ratings.length > 0 ? (
        ratingAverage(product)
      ) : (
        <div className='text-center pt-1 pb-3'>No rating yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : ''}
            style={{ height: '150px', objectFit: 'cover' }}
            className='p-1'
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className='text-info' /> <br /> View Product
          </Link>,
          <Tooltip title={handleTooltip}>
            <a onClick={handleAddToCart} disabled={quantity === 0}>
            <ShoppingCartOutlined className='text-danger' /> <br /> Add to Cart
          </a>,
          </Tooltip>
        ]}
      >
        <Card.Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 40)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
