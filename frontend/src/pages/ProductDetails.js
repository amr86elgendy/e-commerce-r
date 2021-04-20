import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SingleProduct from '../components/products/SingleProduct';
import { getOneProduct, getRelated, productRating } from '../functions/product';
import ProductCard from '../components/products/ProductCard'
const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);

  const user = useSelector((state) => state.user);
  const { slug } = useParams();

  useEffect(() => loadSingleProduct(), [slug]);
  useEffect(() => {
    if (product.ratings && user) {
      const alreadyRated = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      alreadyRated && setStar(alreadyRated.star);
    }
  });

  const loadSingleProduct = () =>
    getOneProduct(slug).then(({ data }) => {
      setProduct(data);
      getRelated(data._id).then(({ data }) => setRelated(data));
    });

  const handleRating = (rate, product) => {
    setStar(rate);
    productRating(rate, product, user.token).then(({ data }) => {
      loadSingleProduct();
    });
  };

  return (
    <div className='container-fluid'>
      <div className='row pt-4'>
        <SingleProduct
          product={product}
          handleRating={handleRating}
          star={star}
        />
      </div>

      <div className='row'>
        <div className='col text-center pt-5 pb-5'>
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className='row pb-5'>
        {related.length ? (
          related.map((product) => (
            <div key={product._id} className='col-md-4'>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className='text-center col'>No Products Found</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
