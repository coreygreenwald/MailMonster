import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_MESSAGE_AND_STATE = 'SET_MESSAGE_AND_STATE';

const defaultToast = {
  message: '',
  state: '' //Enum - error / warn / success
};

export const setMessageAndState = (message, state) => ({type: SET_MESSAGE_AND_STATE, message, state})

export default function (state = defaultToast, action) {
  const newState = {...state};
  switch (action.type) {
    case SET_MESSAGE_AND_STATE:
      newState.message = action.message;
      newState.state = action.state;
      return newState;
    default:
      return state;
  }
}
