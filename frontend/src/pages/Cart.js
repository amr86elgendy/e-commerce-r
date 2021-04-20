import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import ProductCartItem from '../components/products/ProductCartItem';
import { createCart } from '../functions/cart';

const Cart = () => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const history = useHistory();

  const getTotal = () => {
    return cart.reduce((total, product) => {
      return total + product.price * product.count;
    }, 0);
  };

  const saveOrderToDB = () => {
    // alert('Order will be confirmed and saved');
    createCart(cart, user.token).then(({data}) => {
      // console.log(data);
      history.push('/checkout')
    }).catch((err) => console.log(err))
  };

  const saveCashOrderToDB = () => {
    dispatch({
      type: 'COD',
      payload: true
    });
    createCart(cart, user.token)
      .then(({ data }) => {
        // console.log(data);
        history.push('/checkout')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-8'>
          <h4>Cart / {cart.length} Product</h4>

          {!cart.length ? (
            <p>
              No products in cart. <Link to='/shop'>Continue Shopping.</Link>
            </p>
          ) : (
            <table className='table table-bordered'>
              <thead className='thead-light'>
                <tr>
                  <th scope='col'>Image</th>
                  <th scope='col'>Title</th>
                  <th scope='col'>Price</th>
                  <th scope='col'>Brand</th>
                  <th scope='col'>Color</th>
                  <th scope='col'>Count</th>
                  <th scope='col'>Shipping</th>
                  <th scope='col'>Remove</th>
                </tr>
              </thead>

              {cart.map((p) => (
                <ProductCartItem key={p._id} product={p} />
              ))}
            </table>
          )}
        </div>
        <div className='col-md-4'>
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>$ {getTotal()}</b>
          <hr />
          {user ? (
            <>
            <button
              onClick={saveOrderToDB}
              className='btn btn-sm btn-primary mt-2'
              disabled={!cart.length}
            >
              Proceed to Checkout
            </button>
            <br />
            <button
              onClick={saveCashOrderToDB}
              className='btn btn-sm btn-warning mt-2'
              disabled={!cart.length}
            >
              Pay Cash On Delivery
            </button>
            </>
          ) : (
            <button className='btn btn-sm btn-primary mt-2'>
              <Link to={{ pathname: '/login', state: { from: 'cart' } }}>
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
