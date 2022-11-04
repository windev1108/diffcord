import { ActionType } from '../actions/action-types'

const inittialState = {
    requests : [],
}



const requestReducers = (state = inittialState, {type , payload }) => {
    switch (type) {
      case ActionType.FETCH_REQUEST:
        return { 
          ...state , requests : payload,
        }
      default:
          return state
      } 
  };






  export default requestReducers