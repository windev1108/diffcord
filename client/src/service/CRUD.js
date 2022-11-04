import { setDoc , doc, deleteDoc, addDoc, collection} from "firebase/firestore";
import { db } from "../firebase/config";


export const getUser = async (id) => { 
   let results
   await db.collection('users').doc(id).get().then(snap => { results = snap.data()});
   return results
 }

 
  // Handle add Room
export const addRoom = async (room) => {
   addDoc(collection(db, "rooms"), room);
}

  // Handle delete Room
  export const  deleteRoom = (id) => {
    deleteDoc(doc(db, "rooms", id));
  }

// Handle update channel
export const addChannel = (channel) => {
  addDoc(collection(db, "channels"), channel);
}

export const updateChannel = async (payload, id) => {
  const docRef = doc(db, "channels", id);
  await setDoc(docRef, payload);
};


 export const updateUser = async (payload, id) => {
    const docRef = doc(db, "users", id);
    await setDoc(docRef, payload);
  };



  export const deleteChannel = async (id) => {
    const docRef = doc(db, "channels", id);
    await deleteDoc(docRef);
  };



// Handle Add Room
export const addUser = (user) => {
 addDoc(collection(db, "users"), user);
}



// Handle ADD message
export const addMessage =  (message) => {
    addDoc(collection(db, "messages"), message);
}

export const deleteMessage =  (id) => {
    const docRef = doc(db, "messages", id);
    deleteDoc(docRef)
}


// handle Request

export const addRequest =  (request) => {
   addDoc(collection(db, "requests"), request)
}


export const deleteRequest =  (id) => {
  const docRef = doc(db, "requests", id);
   deleteDoc(docRef)
}