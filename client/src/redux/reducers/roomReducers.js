import { ActionType } from '../actions/action-types'

const inittialState = {
    rooms : [],
    room: {}
}



const roomReducers = (state = inittialState, {type , payload }) => {
    switch (type) {
      case ActionType.FETCH_ROOMS:
        return { 
          ...state , rooms : payload,
        }
      case ActionType.SET_ROOM:
        return {
          ...state,
          room : payload
        }   
      default:
          return state
      } 
  };






  export default roomReducers