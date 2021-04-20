import React, { useEffect, useState } from 'react';
import AdminNav from '../../../components/layout/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  createCategory,
  getAllCategories,
  deleteCategory,
} from '../../../functions/category';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CategoryForm from '../../../components/helpers/CategoryForm';
import LocalSearch from '../../../components/helpers/LocalSearch';

const CreateCategory = () => {
  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => loadCategories(), []);

  const loadCategories = () =>
    getAllCategories().then(({ data }) => setCategories(data));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCategory(name, user.token)
      .then(({ data }) => {
        setLoading(false);
        setName('');
        toast.success(`"${data.name}" is created`);
        loadCategories();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };
  const handleDelete = (slug) => {
    if (window.confirm('Are you sure to permanently delete this item ?')) {
      setLoading(true);
      deleteCategory(slug, user.token)
        .then(({ data }) => {
          setLoading(false);
          toast.error(`${data.name} has been deleted`);
          loadCategories();
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setLoading(false);
            toast.error(err.response.data);
          }
        });
    }
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);
  
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col'>
          {loading ? (
            <h4 className='text-danger'>Loading..</h4>
          ) : (
            <h4>Create category</h4>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <hr />
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          {categories.filter(searched(keyword)).map((cate) => (
            <div className='alert alert-secondary' key={cate._id}>
              {cate.name}
              <span
                onClick={() => handleDelete(cate.slug)}
                className='btn btn-sm float-right'
              >
                <DeleteOutlined className='text-danger' />
              </span>
              <Link to={`/admin/category/${cate.slug}`}>
                <span className='btn btn-sm float-right'>
                  <EditOutlined className='text-primary' />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
