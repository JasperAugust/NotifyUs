
import { LOG_IN, LOG_OUT } from './types';

const initialState = {
  userInfo: 'undefined',
  isLoggedIn: false
};

const loginReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOG_IN:
      return {
         userInfo: action.payload,
        isLoggedIn:true
      };
    case LOG_OUT:
      return {
        isLoggedIn: false
      };
    default:
      return state;
  }
}

export default loginReducer;