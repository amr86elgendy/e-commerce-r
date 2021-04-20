import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from './Firebase';
import { currentUser } from './functions/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingOutlined } from '@ant-design/icons';
// Private Route
const UserPrivateRoute = lazy(() => import('./routes/UserPrivateRoute'))
const AdminPrivateRoute = lazy(() => import('./routes/AdminPrivateRoute'))
// Pages
const Header = lazy(() => import('./components/layout/Header'))
const Sidebar = lazy(() => import('./components/layout/Sidebar'))
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const RegisterComplete = lazy(() => import('./pages/auth/RegisterComplete'))
const ForgetPassword = lazy(() => import('./pages/auth/ForgetPassword'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Category = lazy(() => import('./pages/Category'))
const Sub = lazy(() => import('./pages/Sub'))
const Shop = lazy(() => import('./pages/Shop'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Payment = lazy(() => import('./pages/Payment'))
// Admin Pages
const History = lazy(() => import('./pages/user/History'))
const Password = lazy(() => import('./pages/user/Password'))
const Wishlist = lazy(() => import('./pages/user/Wishlist'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const CreateCategory = lazy(() => import('./pages/admin/category/CreateCategory'))
const UpdateCategory = lazy(() => import('./pages/admin/category/UpdateCategory'))
const CreateSub = lazy(() => import('./pages/admin/sub/CreateSub'))
const UpdateSub = lazy(() => import('./pages/admin/sub/UpdateSub'))
const CreateProduct = lazy(() => import('./pages/admin/product/CreateProduct'))
const ProductsList = lazy(() => import('./pages/admin/product/ProductsList'))
const UpdateProduct = lazy(() => import('./pages/admin/product/UpdateProduct'))
const CreateCoupon = lazy(() => import('./pages/admin/coupon/CreateCoupon'))

const App = () => {
  const dispatch = useDispatch();
  console.log('App Run');
  useEffect(() => {
    console.log('use eff app run');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                token: idTokenResult.token,
                wishlist: res.data.wishlist
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });
    // cleanup
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className='col text-center p-5'><LoadingOutlined style={{fontSize: '60px'}}/></div>
      }>
        <Header />
        <Sidebar />
        <ToastContainer />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/register/complete' component={RegisterComplete} />
          <Route exact path='/forgotpassword' component={ForgetPassword} />
          <UserPrivateRoute exact path='/user/history'>
            <History />
          </UserPrivateRoute>
          <UserPrivateRoute exact path='/user/password'>
            <Password />
          </UserPrivateRoute>
          <UserPrivateRoute exact path='/user/wishlist'>
            <Wishlist />
          </UserPrivateRoute>
          <AdminPrivateRoute exact path='/admin/dashboard'>
            <Dashboard />
          </AdminPrivateRoute>
          <AdminPrivateRoute exact path='/admin/category'>
            <CreateCategory />
          </AdminPrivateRoute>
          <AdminPrivateRoute exact path='/admin/category/:slug'>
            <UpdateCategory />
          </AdminPrivateRoute>
          <AdminPrivateRoute exact path='/admin/sub'>
            <CreateSub />
          </AdminPrivateRoute>
          <AdminPrivateRoute exact path='/admin/sub/:slug'>
            <UpdateSub />
          </AdminPrivateRoute>
          <AdminPrivateRoute exact path='/admin/product'>
            <CreateProduct />
          </AdminPrivateRoute>
          <AdminPrivateRoute exact path='/admin/products'>
            <ProductsList />
          </AdminPrivateRoute>
          <AdminPrivateRoute exact path='/admin/product/:slug'>
            <UpdateProduct />
          </AdminPrivateRoute>
          <AdminPrivateRoute exact path='/admin/coupon'>
            <CreateCoupon />
          </AdminPrivateRoute>
          <Route exact path='/product/:slug' component={ProductDetails} />
          <Route exact path='/category/:slug' component={Category} />
          <Route exact path='/sub/:slug' component={Sub} />
          <Route exact path='/shop' component={Shop} />
          <Route exact path='/cart' component={Cart} />
          <UserPrivateRoute exact path='/checkout' component={Checkout} />
          <UserPrivateRoute exact path='/payment' component={Payment} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
};

export default App;
