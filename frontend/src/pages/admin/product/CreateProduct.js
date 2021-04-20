import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/layout/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { createProduct } from '../../../functions/product';
import ProductForm from '../../../components/helpers/CreateProductForm';
import { getAllCategories, getSubCategories } from '../../../functions/category';
import FileUpload from '../../../components/helpers/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';

const initialState = {
  title: '',
  description: '',
  price: '',
  categories: [],
  category: '',
  subs: [],
  quantity: '',
  images: [],
  shipping: '',
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
  color: '',
  brand: '',
};

const CreateProduct = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSubs, setShowSubs] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  useEffect(() => loadCategories(), []);

  const loadCategories = () =>
    getAllCategories().then(({ data }) =>
      setValues({ ...values, categories: data })
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then(({ data }) => {
        window.alert(`${data.title} has been created`);
        window.location.reload(); // to easly empty all fields
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.status === 400) toast.error(err.response.data);
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCateChange = (e) => {
    if (e.target.value) {
      setValues({ ...values, category: e.target.value, subs: [] });
      getSubCategories(e.target.value).then(({ data }) => setSubOptions(data));
      setShowSubs(true);
    } else {
      setValues({ ...values, category: '', subs: [] });
      setSubOptions([]);
      setShowSubs(false);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>

        <div className='col-md-10 mt-3'>
          {loading ? (
            <LoadingOutlined className='text-danger h1' />
          ) : (
            <h4>Create Product</h4>
          )}
          <hr />
          
          <div className='p-3'>
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          
          <ProductForm
            handleChange={handleChange}
            handleCateChange={handleCateChange}
            handleSubmit={handleSubmit}
            values={values}
            setValues={setValues}
            subOptions={subOptions}
            showSubs={showSubs}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
