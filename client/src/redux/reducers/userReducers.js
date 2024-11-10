import { ActionType } from '../actions/action-types'

const inittialState = {
    users : [],
    user : {},
    authUser: {}
}



const userReducers = (state = inittialState, {type , payload }) => {
    switch (type) {
      case ActionType.FETCH_USERS:
        return { 
          ...state , 
          users : payload,
        }
      case ActionType.SET_USER:
          return {
            ...state,
            user: payload
          }  
     case ActionType.SET_AUTH_USER:
          return {
            ...state,
            authUser: payload
          }  
      default:
          return state
      } 
  };






  export default userReducers