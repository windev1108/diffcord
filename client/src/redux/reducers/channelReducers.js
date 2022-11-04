import { ActionType } from "../actions/action-types";

const inittialState = {
  channels: [],
  channel: {},
  roomMaster : {}
};

const channelReducers = (state = inittialState, { type, payload }) => {
  switch (type) {
    case ActionType.FETCH_CHANNELS:
      return {
        ...state,
        channels: payload,
      };
    case ActionType.SET_CHANNEL:
      return {
        ...state,
        channel: payload,
      };
    case ActionType.SET_ROOMMASTER:
      return {
        ...state,
        roomMaster: payload,
      };
    default:
      return state;
  }
};

export default channelReducers;
