import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNav from '../../../components/layout/AdminNav';
import { getSingleSub, updateSub } from '../../../functions/sub';
import { getAllCategories } from '../../../functions/category';
import CategoryForm from '../../../components/helpers/CategoryForm'

const UpdateSub = () => {
  const { slug } = useParams();
  const history = useHistory();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [parent, setParent] = useState('');
  const [categories, setCategories] = useState([]);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadSub();
    loadCategories();
  }, [slug]);

  const loadCategories = () =>
    getAllCategories().then(({ data }) => setCategories(data));
  const loadSub = () =>
    getSingleSub(slug).then(({ data }) => {
      setName(data.name);
      setParent(data.parent)
    });

  const handleSubmit = (e) => {
    e.preventDefault();
  
    setLoading(true);
    updateSub(slug, { name, parent }, user.token)
      .then(({data}) => {
        setLoading(false);
        setName("");
        toast.success(`"${data.name}" has been updated`);
        history.push("/admin/sub");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Update sub category</h4>
          )}

          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
            >
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map((cate) => (
                  <option key={cate._id} value={cate._id} selected={cate._id === parent}>
                    {cate.name}
                  </option>
                ))}
            </select>
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateSub;
