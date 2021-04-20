import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNav from '../../../components/layout/AdminNav';
import { getSingleCategory, updateCategory } from '../../../functions/category';
import CategoryForm from '../../../components/helpers/CategoryForm'

const UpdateCategory = () => {
  const { slug } = useParams();
  const history = useHistory()
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => loadCategory(), [slug]);

  const loadCategory = () =>
    getSingleCategory(slug).then(({ data }) => setName(data.name));

  const handleSubmit = (e) => {
    e.preventDefault();
  
    setLoading(true);
    updateCategory(slug, name, user.token)
      .then(({data}) => {
        // console.log(res)
        setLoading(false);
        setName("");
        toast.success(`"${data.name}" has been updated`);
        history.push("/admin/category");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

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
            <h4>Update category</h4>
          )}
          <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
