import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter , Routes, Route, useNavigate } from 'react-router-dom';
import { db } from './firebase/config';
import { Home ,Signin, Signup , ChatBox , ChatRoom, ForgotPassword } from './pages'
import { ActionType } from './redux/actions/action-types';

function App() {
  const dispatch = useDispatch()
   


  //  //  Fetch Channels
  useEffect(() => {
       const queryChannels = query( collection(db, "channels") , orderBy("timestamp", "desc"))
       const unsubChannels = onSnapshot(queryChannels,(snapshot) => {
          const results = snapshot.docs.map((doc) => ({...doc.data() , id: doc.id}))
            dispatch({ type: ActionType.FETCH_CHANNELS , payload : results })
       })
       const queryUsers = query(collection(db, "users") , orderBy("timestamp", "desc"))
       const unsubUsers = onSnapshot(queryUsers,(snapshot) => {
          const results = snapshot.docs.map((doc) => ({...doc.data() , id: doc.id}))
            dispatch({ type: ActionType.FETCH_USERS , payload : results })
       })

       const queryRooms = query(collection(db, "rooms") , orderBy("timestamp", "desc"))
       const unsubRooms = onSnapshot(queryRooms,(snapshot) => {
          const results = snapshot.docs.map((doc) => ({...doc.data() , id: doc.id}))
            dispatch({ type: ActionType.FETCH_ROOMS , payload : results })
       })

       const queryMessages = query(collection(db, "messages") , orderBy("timestamp", "desc"))
       const unsubMessages = onSnapshot(queryMessages,(snapshot) => {
          const results = snapshot.docs.map((doc) => ({...doc.data() , id: doc.id}))
            dispatch({ type: ActionType.FETCH_MESSAGES , payload : results })
       })

       const queryRequest = query(collection(db, "requests") , orderBy("timestamp", "desc"))
       const unsubRequest = onSnapshot(queryRequest,(snapshot) => {
          const results = snapshot.docs.map((doc) => ({...doc.data() , id: doc.id}))
            dispatch({ type: ActionType.FETCH_REQUEST , payload : results })
       })
       return () => {
        unsubRequest()
        unsubChannels()
        unsubUsers()
        unsubRooms()
        unsubMessages()
       }
  },[])




  return (
    <BrowserRouter>
       <Routes>
          <Route path="/" exact element={<Home />}/>
          <Route path="/channels/@me/:slug" element={<ChatBox />}/>
          <Route path="/channels/@me" element={<Home />}/>
          <Route path="/channels/room/:roomID" element={<ChatRoom />} />
          <Route path="/channels/:slug" element={<ChatRoom />}/> 
          <Route path="/signin" element={<Signin />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/forgot" element={<ForgotPassword />}/>
          <Route path="/:slug" element={<Home/>}/>
       </Routes>
    </BrowserRouter>
  );
}

export default App;
  