import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminNav from '../../../components/layout/AdminNav';
import { deleteProduct, getProductsByCount } from '../../../functions/product';
import ProductCard from './ProductCard';
import { toast } from "react-toastify";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleDelete = (slug) => {
    if (window.confirm(`Are you sure to delete ${slug}`)) {
      deleteProduct(slug, user.token)
      .then(({ data }) => {
        loadAllProducts();
        toast.error(`${data.title} is deleted`);
      })
      .catch((err) => {
        if (err.response.status === 400) toast.error(err.response.data);
        console.log(err);
      });
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>

        <div className='col'>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <h4>All Products</h4>
          )}
          <div className='row'>
            {products.map((product) => (
              <div key={product._id} className='col-md-4 pb-3'>
                <ProductCard product={product} handleDelete={handleDelete} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
