import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../functions/category';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => loadCategories(), []);

  const loadCategories = async () => {
    setLoading(true);
    const { data } = await getAllCategories();
    setCategories(data);
    setLoading(false);
  };

  return (
    <div className='container'>
      <div className='row'>
        {loading ? (
          <h4 className='text-center'>Loading...</h4>
        ) : (
          categories.map((c) => (
            <div
              key={c._id}
              className='col btn btn-outlined-primary btn-lg btn-block btn-raised m-3'
            >
              <Link to={`/category/${c.slug}`}>{c.name}</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoriesList;
