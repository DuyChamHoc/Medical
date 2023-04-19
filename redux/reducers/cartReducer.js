let defaultState = {
  selectedItems: {items: [], language: 'en', dark: 'false'},
  dataChat: [
    {
      id: 1,
      roll: 'admin',
      message: 'Chào bạn, Medeli có thể hỗ trợ gì cho bạn ạ?',
      timestamp: Date.now(),
      type: 'mess',
    },
    {
      id: 2,
      roll: 'user',
      message: 'Tôi cảm thấy nhứt đầu, đau mỏi toàn thân.',
      timestamp: Date.now(),
      type: 'mess',
    },
    {
      id: 3,
      roll: 'admin',
      message:
        'Thiếu nước, cơ thể không thể thực hiện được các nhiệm vụ quan trọng, trong đó có hô hấp và tiêu hóa.',
      timestamp: Date.now(),
      type: 'mess',
    },
    {
      id: 4,
      roll: 'admin',
      message: 'Bạn nên uống nước thường xuyên nhé!',
      timestamp: Date.now(),
      type: 'mess',
    },
    {
      id: 5,
      roll: 'admin',
      message:
        'https://cdn.medigoapp.com/product/1c90b8adb5d944dbb5ea7111252ec0b0.jpeg',
      timestamp: Date.now(),
      type: 'image',
    },
    {
      id: 6,
      roll: 'admin',
      message:
        'Tôi nghĩ bạn nên dùng Viên sủi Vitamed DIAMOND, nó có thể tốt cho bạn.',
      timestamp: Date.now(),
      type: 'mess',
    },
    {
      id: 7,
      roll: 'user',
      message: 'Cảm ơn bác sĩ.',
      timestamp: Date.now(),
      type: 'mess',
    },
  ],
};
let cartReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      let newState = {...state};
      if (action.payload.checkboxValue) {
        console.log('ADD_TO_CART');
        newState.selectedItems = {
          items: [...newState.selectedItems.items, action.payload],
        };
        // console.log(newState.selectedItems, "👉");
      } else {
        console.log('REMOVE FROM CART');
        newState.selectedItems = {
          items: [
            ...newState.selectedItems.items.filter(
              item => item.id !== action.payload.id,
            ),
          ],
        };
      }
      // console.log(newState.selectedItems, "👉");
      return newState;
    }
    case 'DELETE_TO_CART': {
      let newState = {...state};
      newState.selectedItems = {
        items: [],
      };
      // console.log(newState, "👉");
      return newState;
    }
    case 'UPDATE_TO_CART': {
      let newState = {...state};
      const a = action.payload.SL;
      console.log('UPDATE CART');
      newState.selectedItems = {
        items: [
          ...newState.selectedItems.items.map(item =>
            item.id === action.payload.id ? {...item, SL: a} : item,
          ),
        ],
      };
      // console.log(newState.selectedItems, "👉");
      return newState;
    }
    case 'UPDATE1_TO_CART': {
      let newState = {...state};
      const a = action.payload.SL;
      console.log('UPDATE CART');
      newState.selectedItems = {
        items: [
          ...newState.selectedItems.items.map(item =>
            item.id === item.id ? {...item, SL: a} : item,
          ),
        ],
      };
      // console.log(newState.selectedItems, "👉");
      return newState;
    }
    case 'UPDATE_TO_LANGUAGE': {
      let newState = {...state};
      console.log('UPDATE LANGUAGE');
      newState.selectedItems = {
        items: [],
        language: action.payload.language,
      };
      console.log(newState.selectedItems.language, '👉');
      return newState;
    }
    case 'UPDATE_TO_DARK': {
      let newState = {...state};
      console.log('UPDATE DARK');
      newState.selectedItems = {
        items: [],
        dark: action.payload.dark,
      };
      console.log(newState.selectedItems.dark, '👉');
      return newState;
    }
    case 'ADD_TO_CHAT': {
      let newState = {...state};
      newState.dataChat = [...newState.dataChat, action.payload.DataChat];
      console.log(newState.dataChat, '👉');
      return newState;
    }
    default:
      return state;
  }
};

export default cartReducer;
