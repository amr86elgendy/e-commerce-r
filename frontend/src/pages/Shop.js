import React, { useState, useEffect } from 'react';
import {
  fetchProductsByFilter,
  getProductsByCount,
} from '../functions/product';
import { getAllCategories } from '../functions/category';
import { getAllSubs } from '../functions/sub';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/products/ProductCard';
import { Menu, Slider, Checkbox, Radio } from 'antd';
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from '@ant-design/icons';
import FilterByRating from '../components/shop/FilterByRating';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subs, setSubs] = useState([]);
  const brands = ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'];
  const [brand, setBrand] = useState('');
  const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue'];
  const [color, setColor] = useState('');
  const [shipping, setShipping] = useState('');

  const { text } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  // 1. load products by default on page load
  useEffect(() => {
    loadAllProducts();
    getAllCategories().then(({ data }) => setCategories(data));
    getAllSubs().then(({ data }) => setSubs(data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  const loadAllProducts = () => {
    getProductsByCount(12).then(({ data }) => {
      setProducts(data);
      setLoading(false);
    });
  };

  // 2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      // if(!text) loadAllProducts()
    }, 1000);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load products based on price range
  useEffect(() => {
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setCategoryIds([]);
    setPrice(value);
    setBrand('');
    setColor('');
    setShipping('');
    setTimeout(() => {
      setOk(!ok);
    }, 500);
  };

  // 4. load products based on category
  const handleCheck = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setBrand('');
    setColor('');
    setShipping('');
    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // index or -1
    // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState, 1);
    }
    setCategoryIds(inTheState);
    // console.log(inTheState);
    fetchProducts({ category: inTheState });
  };

  // 5. show products by star rating
  const handleStarClick = (num) => {
    // console.log(num);
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setBrand('');
    setColor('');
    setShipping('');
    fetchProducts({ stars: num });
  };

  // 6. show products by sub category
  const handleSub = (sub) => {
    // console.log(sub);
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setBrand('');
    setColor('');
    setShipping('');
    fetchProducts({ sub });
  };

  // 7. show products based on brand name
  const handleBrand = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setColor('');
    setShipping('');
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };

  // 8. show products based on color
  const handleColor = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setBrand('');
    setColor(e.target.value);
    setShipping('');
    setShipping('');
    fetchProducts({ color: e.target.value });
  };

  // 9. show products based on shipping yes/no
  const handleShipping = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: '' },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setBrand('');
    setColor('');
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-3'>
          <h4>Search/Filter</h4>
          <hr />

          <Menu
            defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
            mode='inline'
          >
            {/* price */}
            <Menu.SubMenu
              key='1'
              title={
                <span className='h6'>
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className='ml-4 mr-4'
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max='4999'
                />
              </div>
            </Menu.SubMenu>

            {/* category */}
            <Menu.SubMenu
              key='2'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }}>
                {categories.map((c) => (
                  <div key={c._id}>
                    <Checkbox
                      onChange={handleCheck}
                      className='pb-2 pl-4 pr-4'
                      value={c._id}
                      name='category'
                      checked={categoryIds.includes(c._id)}
                    >
                      {c.name}
                    </Checkbox>
                    <br />
                  </div>
                ))}
              </div>
            </Menu.SubMenu>
            {/* stars */}
            <Menu.SubMenu
              key='3'
              title={
                <span className='h6'>
                  <StarOutlined /> Rating
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }}>
                <div className='pr-4 pl-4 pb-2'>
                  <FilterByRating
                    starClick={handleStarClick}
                    numberOfStars={5}
                  />
                  <FilterByRating
                    starClick={handleStarClick}
                    numberOfStars={4}
                  />
                  <FilterByRating
                    starClick={handleStarClick}
                    numberOfStars={3}
                  />
                  <FilterByRating
                    starClick={handleStarClick}
                    numberOfStars={2}
                  />
                  <FilterByRating
                    starClick={handleStarClick}
                    numberOfStars={1}
                  />
                </div>
              </div>
            </Menu.SubMenu>
            {/* sub category */}
            <Menu.SubMenu
              key='4'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }} className='pl-4 pr-4'>
                {subs.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => handleSub(s)}
                    className='p-1 m-1 badge badge-secondary'
                    style={{ cursor: 'pointer' }}
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            </Menu.SubMenu>
            {/* brands */}
            <Menu.SubMenu
              key='5'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }} className='pr-5'>
                {brands.map((b) => (
                  <Radio
                    key={b}
                    value={b}
                    name={b}
                    checked={b === brand}
                    onChange={handleBrand}
                    className='pb-1 pl-4 pr-4'
                  >
                    {b}
                  </Radio>
                ))}
              </div>
            </Menu.SubMenu>
            {/* colors */}
            <Menu.SubMenu
              key='6'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }} className='pr-5'>
                {colors.map((c) => (
                  <Radio
                    key={c}
                    value={c}
                    name={c}
                    checked={c === color}
                    onChange={handleColor}
                    className='pb-1 pl-4 pr-4'
                  >
                    {c}
                  </Radio>
                ))}
              </div>
            </Menu.SubMenu>
            {/* shipping */}
            <Menu.SubMenu
              key='7'
              title={
                <span className='h6'>
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div style={{ maringTop: '-10px' }} className='pr-5'>
                <Checkbox
                  className='pb-2 pl-4 pr-4'
                  onChange={handleShipping}
                  value='Yes'
                  checked={shipping === 'Yes'}
                >
                  Yes
                </Checkbox>

                <Checkbox
                  className='pb-2 pl-4 pr-4'
                  onChange={handleShipping}
                  value='No'
                  checked={shipping === 'No'}
                >
                  No
                </Checkbox>
              </div>
            </Menu.SubMenu>
          </Menu>
        </div>

        <div className='col-md-9'>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : (
            <h4 className='text-danger'>Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className='row pb-5'>
            {products.map((p) => (
              <div key={p._id} className='col-md-4 mt-3'>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
