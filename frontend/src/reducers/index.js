import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { searchReducer } from './searchReducer';
import { cartReducer } from './cartReducer';
import { sideReducer } from './sideReducer';
import { couponReducer } from './couponReducer'
import { cashOnDeliveryReducer } from './cashOnDelivery'

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  sidebar: sideReducer,
  coupon: couponReducer,
  cashOnDelivery: cashOnDeliveryReducer
});

export default rootReducer;
