import { ActionType } from '../actions/action-types'

const inittialState = {
    messages : [],
    message: {}
}



const messageReducers = (state = inittialState, {type , payload }) => {
    switch (type) {
      case ActionType.FETCH_MESSAGES:
        return { 
          ...state , messages : payload,
        }
      default:
          return state
      } 
  };






  export default messageReducers