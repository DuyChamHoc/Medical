import {combineReducers} from 'redux';
import cartReducer from './cartReducer';
import dataReducer from './dataReducer';
let reducers = combineReducers({
  cartReducer: cartReducer,
  dataReducer: dataReducer,
});

const rootReducer = (state, action) => {
  return reducers(state, action);
};

export default rootReducer;
