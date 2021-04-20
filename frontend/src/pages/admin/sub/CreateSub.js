import React, { useEffect, useState } from 'react'
import AdminNav from '../../../components/layout/AdminNav';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getAllCategories } from '../../../functions/category';
import { createSub, getAllSubs, deleteSub } from "../../../functions/sub";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/helpers/CategoryForm";
import LocalSearch from "../../../components/helpers/LocalSearch";

const CreateSub = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [subs, setSubs] = useState([]);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = () =>
    getAllCategories().then(({ data }) => setCategories(data));
  const loadSubs = () => getAllSubs().then(({data}) => setSubs(data));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createSub({ name, parent: category }, user.token)
      .then(({data}) => {
        setLoading(false);
        setName("");
        toast.success(`"${data.name}" is created`);
        loadSubs();
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
      deleteSub(slug, user.token)
        .then(({ data }) => {
          setLoading(false);
          toast.error(`${data.name} has been deleted`);
          loadSubs();
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Create sub category</h4>
          )}

          <div className="form-group">
            <label>Parent Category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map(cate => (
                  <option key={cate._id} value={cate._id}>
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
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {subs.filter(searched(keyword)).map((sub) => (
            <div className="alert alert-secondary" key={sub._id}>
              {sub.name}
              <span
                onClick={() => handleDelete(sub.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/sub/${sub.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-primary" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreateSub
