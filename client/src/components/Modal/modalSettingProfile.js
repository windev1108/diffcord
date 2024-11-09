import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {  updateUser } from "../../service/CRUD";
import clsx from "clsx";
import LoadingOverlay from "../LoadingOverlay";
import { isEqualData } from "../../utils/common";

const ModalSettingProfile = ({ children, user }) => {
  const [ isOpen , setIsOpen ] = useState(false)
  const [ loading , setLoading ] = useState(false)
  const [{ fullName, username , note} ,setFormValues ] = useState({
    fullName: user.nickname ?? '',
    username: String(user?.uid ?? ''),
    note: user?.note ?? ''
  })

const isNotChangeValues = useMemo(() => {
    return isEqualData({ fullName: user?.nickname , uid: String(user?.uid) , note: user?.note } , {  fullName, uid: username , note  })
},[fullName, user?.nickname, user?.uid, user?.note,username, note])

  const handleSaveForm = async () => {
    if(!fullName || !username){
      toast.error('Please fill in all fields!')
      return
    } 
    setLoading(true)
    await updateUser({
      ...user,
      nickname: fullName,
      uid: username,
      note
    },user.id)
    setLoading(false)
    setIsOpen(false)
    toast.success("Update profile successfully!")
  }
  return (
    <>
     {React.cloneElement(
        children,
        { onClick: () => setIsOpen(true) } // Modify onClick to open the dialog
      )}   

{isOpen &&
<>
   <div
   onClick={() => setIsOpen(false)}
      className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] bg-opacity-50 z-20 "
    ></div>
    <div className="fixed lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2  left-0 right-0 bottom-0 z-30 lg:w-[30rem] w-full h-fit bg-[#36393f] shadow-md rounded-md">
    <LoadingOverlay visible={loading} />
  
      <div
        className=
          "flex justify-center border-b-[1px]  border-[#33353b]"
      > 
          <span className="text-[#fff] my-3 text-lg">{'Edit profile'}</span>
      </div>

      <div className="flex flex-col m-4 space-y-4">
      <div className="flex flex-col">
      <label className="text-gray-400 text-sm mb-1">Full name</label>
      <input value={fullName} onChange={({target}) => setFormValues((prev) => ({...prev, fullName: target.value}))}  className="bg-transparent text-white border border-gray-600 px-4 py-2 rounded-md outline-none" type="text" placeholder="Enter your name" />
      </div>
      <div className="flex flex-col">
      <label className="text-gray-400 text-sm mb-1">Username</label>
      <input value={username} onChange={({target}) => setFormValues((prev) => ({...prev, username: target.value}))}  className="bg-transparent text-white border border-gray-600 px-4 py-2 rounded-md outline-none" type="text" placeholder="Enter your username" />
      </div>

      <div className="flex flex-col">
      <label className="text-gray-400 text-sm mb-1">Note</label>
      <input value={note} onChange={({target}) => setFormValues((prev) => ({...prev, note: target.value}))}  className="bg-transparent text-white border border-gray-600 px-4 py-2 rounded-md outline-none" type="text" placeholder="Enter your username" />
      </div>
      
        <div className="flex justify-end">
        <button onClick={handleSaveForm} disabled={isNotChangeValues} className={clsx({
          'opacity-50': isNotChangeValues
        },'px-4 py-2  bg-green-700 rounded-md')}>
          <span className="text-white">Save</span>
        </button>
        </div>
      </div>
    
    </div>
</>
}
  </>
  );
};

export default ModalSettingProfile;

ModalSettingProfile.propTypes = {
  children: PropTypes.element,
  user: PropTypes.object.isRequired,
};
