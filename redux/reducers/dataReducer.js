let defaultState = {
  dataUser: [],
};
let dataReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_DATA': {
      let newState = {...state};
      console.log('ADD_DATA');
      newState.dataUser = action.payload;
      // console.log(newState.dataUser, '👉');
      return newState;
    }
    default:
      return state;
  }
};

export default dataReducer;
