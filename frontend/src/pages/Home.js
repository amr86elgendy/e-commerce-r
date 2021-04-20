import React from 'react';
import Typeeffect from '../components/helpers/Typeeffect';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import CategoriesList from '../components/category/CategoriesList';
import SubsList from '../components/sub/SubsList';

const Home = () => {
  return (
    <>
      <div className='jumbotron text-danger h1 font-weight-bold text-center'>
        <Typeeffect
          text={['Latest Products', 'New Arrivals', 'Best Sellers']}
        />
      </div>

      <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        New Arrivals
      </h4>
      <NewArrivals />

      <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Best Sellers
      </h4>
      <BestSellers />

      <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Categories
      </h4>
      <CategoriesList />

      <h4 className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
        Sub Categories
      </h4>
      <SubsList />
      <br />
      <br />
    </>
  );
};

export default Home;
