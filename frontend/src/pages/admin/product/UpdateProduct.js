import { LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import FileUpload from '../../../components/helpers/FileUpload';
import UpdateProductForm from '../../../components/helpers/UpdateProductForm';
import AdminNav from '../../../components/layout/AdminNav';
import {
  getAllCategories,
  getSubCategories,
} from '../../../functions/category';
import { getOneProduct, updateProduct } from '../../../functions/product';
import { toast } from 'react-toastify';

const initialState = {
  title: '',
  description: '',
  price: '',
  category: '',
  subs: [],
  shipping: '',
  quantity: '',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
  color: '',
  brand: '',
};

const UpdateProduct = () => {
  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [arrayOfSubs, setArrayOfSubs] = useState([]);
  const [orginalCategoryId, setOrginalCategoryId] = useState('');
  const [orginalSubsId, setOrginalSubsId] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const { slug } = useParams();
  const { push } = useHistory();

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = async () => {
    getOneProduct(slug).then(({ data }) => {
      setValues({ ...values, ...data });
      setOrginalCategoryId(data.category._id);
      setOrginalSubsId(data.subs.map((sub) => sub._id));
      getSubCategories(data.category._id).then(({ data }) =>
        setSubOptions(data)
      );
      setArrayOfSubs(data.subs.map((sub) => sub._id)); // because subs is populated from backend
    });
  };
  const loadCategories = () =>
    getAllCategories().then(({ data }) => {
      setCategories(data);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    values.subs = arrayOfSubs;
    if (typeof values.category === 'object') {
      values.category = values.category._id;
    }
    updateProduct(slug, values, user.token)
      .then(({ data }) => {
        setLoading(false);
        toast.success(`${data.title} has been updated`);
        push("/admin/products");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        // toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCateChange = (e) => {
    if (e.target.value) {
      setValues({ ...values, category: e.target.value, subs: [] });
      getSubCategories(e.target.value).then(({ data }) => setSubOptions(data));
      if (orginalCategoryId === e.target.value) {
        setArrayOfSubs(orginalSubsId);
      } else {
        setArrayOfSubs([]);
      }
    } else {
      setValues({ ...values, category: '', subs: [] });
      setSubOptions([]);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>

        <div className='col-md-10'>
          {loading ? (
            <LoadingOutlined className='text-danger h1' />
          ) : (
            <h4>Update Product</h4>
          )}

          <div className='p-3'>
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <UpdateProductForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCateChange={handleCateChange}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubs={arrayOfSubs}
            setArrayOfSubs={setArrayOfSubs}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
