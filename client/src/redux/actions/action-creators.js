import { ActionType } from './action-types'

// handleSetchanel


export const setChannel =  (chanel) => {
   return {
      type: ActionType.SET_CHANNEL,
      payload: chanel
   }
}

export const setUser =  (user) => {
   return {
      type: ActionType.SET_USER,
      payload: user
   }
}

export const setRoom =  (room) => {
   return {
      type: ActionType.SET_ROOM,
      payload: room
   }
}


export const getChanels = (channels) => {
    return {
       type: ActionType.FETCH_CHANELS,
       payload: channels
    }
 }

 export const getRoom = (room) => {
    return {
       type: ActionType.GET_ROOM,
       payload: room
    }
 }


 export const getUsers = (users) => {
    return {
       type: ActionType.GET_USERS,
       payload: users
    }
 }


 export const getMessages = (messages) => {
    return {
       type: ActionType.GET_MESSAGES,
       payload: messages
    }
 }


 export const getUser = (users) => {
   return {
      type: ActionType.GET_USERS,
      payload: users
   }
}

 export const getMessage = (message) => {
    return {
       type: ActionType.GET_MESSAGE,
       payload: message
    }
 }


 export const setRoomMaster = (user) => {
     return {
       type : ActionType.SET_ROOMMASTER,
       payload: user
     }
 }


export const setShowFriendListMobile = (boolean) => {
     return {
      type : ActionType.SET_FRIENDS_LIST_MOBILE,
      payload: boolean
     }
}


