import { combineReducers } from 'redux'
import channelReducers from './channelReducers';
import userReducers from './userReducers';
import roomReducers from './roomReducers';
import messagesReducers from './messagesReducers';
import memberReducers from './memberReducer';
import requestReducers from './requestReducers';
import isReducers from './isReducers';

const reducers = combineReducers({
    channels: channelReducers,
    rooms: roomReducers,
    users: userReducers,
    messages: messagesReducers,
    members: memberReducers,
    requests: requestReducers,
    is : isReducers 
});

export default reducers
