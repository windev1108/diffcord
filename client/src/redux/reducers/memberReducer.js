import { ActionType } from '../actions/action-types'

const inittialState = {
    members : [],
}



const memberReducers = (state = inittialState, {type , payload }) => {
    switch (type) {
      case ActionType.SET_MEMBERS:
        return { 
          ...state , members : payload,
        }
      default:
          return state
      } 
  };






  export default memberReducers