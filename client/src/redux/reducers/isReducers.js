import { ActionType } from '../actions/action-types'

const inittialState = {
    showFriendListMobile: false,
}



const isReducers = (state = inittialState, {type , payload }) => {
    switch (type) {
      case ActionType.SET_FRIENDS_LIST_MOBILE:
        return { 
          ...state , 
          showFriendListMobile : payload,
        }
      default:
          return state
      } 
  };






  export default isReducers