import React from 'react';
import ModalImage from 'react-modal-image';
import { useDispatch } from 'react-redux';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined
} from "@ant-design/icons";
const ProductCartItem = ({ product }) => {
  const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue'];
  const dispatch = useDispatch();

  const handleColorChange = (e) => {
    let cart = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    cart.map((item) => {
      if (item._id === product._id) {
        item.color = e.target.value;
      }
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    dispatch({
      type: 'ADD_TO_CART',
      payload: cart,
    });
  };

  const handleCountChange = (e) => {
    let cart = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    cart.map((item) => {
      if (item._id === product._id) {
        item.count = e.target.value;
      }
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    dispatch({
      type: 'ADD_TO_CART',
      payload: cart,
    });
  };

  const handleRemove = () => {
    let cart = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
    const filteredItems = cart.filter((item) => item._id !== product._id);
    
    localStorage.setItem('cart', JSON.stringify(filteredItems));
    dispatch({
      type: 'ADD_TO_CART',
      payload: filteredItems,
    });
  }

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: '100px', height: 'auto' }}>
            <ModalImage
              small={product.images[0].url}
              large={product.images[0].url}
            />
          </div>
        </td>
        <td>{product.title}</td>
        <td>$ {product.price}</td>
        <td>{product.brand}</td>
        <td>
          <select
            onChange={handleColorChange}
            name='color'
            className='form-control'
            defaultValue={product.color}
          >
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </td>
        <td className='text-center'>
          <select
            onChange={handleCountChange}
            name='color'
            className='form-control'
            value={product.count}
          >
            {[...Array(product.quantity).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>
        </td>
        <td className="text-center">
          {product.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success" />
          ) : (
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        <td className="text-center">
          <DeleteOutlined
            onClick={handleRemove}
            className="text-danger pointer"
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCartItem;
