import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllSubs } from '../../functions/sub';

const SubsList = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => loadSubs(), []);

  const loadSubs = async () => {
    setLoading(true);
    const { data } = await getAllSubs();
    setSubs(data);
    setLoading(false);
  };

  return (
    <div className='container'>
      <div className='row'>
        {loading ? (
          <h4 className='text-center'>Loading...</h4>
        ) : (
          subs.map((s) => (
            <div
              key={s._id}
              className='col btn btn-outlined-primary btn-lg btn-block btn-raised m-3'
            >
              <Link to={`/sub/${s.slug}`}>{s.name}</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubsList;
