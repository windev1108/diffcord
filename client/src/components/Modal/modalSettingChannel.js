import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {  updateChannel } from "../../service/CRUD";
import clsx from "clsx";
import LoadingOverlay from "../LoadingOverlay";
import { isEqualData } from "../../utils/common";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { useDispatch } from "react-redux";
import { MEDIA_SUPPORT } from "../../utils/constants";
import { uploadImage } from "../../apis/cloudinary";

const ModalSettingChannel = ({ children, channel }) => {
  const dispatch = useDispatch();
  const { setChannel } = bindActionCreators(actionCreator, dispatch);
  const [ isOpen , setIsOpen ] = useState(false)
  const [ loading , setLoading ] = useState(false)
  const [{ name} ,setFormValues ] = useState({
    name: channel?.name ?? '',
  })

const isNotChangeValues = useMemo(() => {
    return isEqualData({ name: channel?.name } , { name })
},[name, channel?.name])

const handleChangeAvatar = async (e) => {
  const file = e.target.files[0];
  if(!MEDIA_SUPPORT.some((x) => file?.type.includes(x))){
    toast.error('This file type is not supported!')
    return
  }
  setLoading(true)
  const data = await uploadImage(file)
  if(data?.url){
      const formDate = {
        ...channel,
        photoUrl: data?.url
      };
      updateChannel(formDate, channel.id);
      setChannel(formDate)
      setLoading(false)
      toast.success("Upload channel photo successfully!");
  }else {
    toast.error("Upload channel photo channel failed!")}
};


const handleSaveForm = async (e) => {
  e.preventDefault();
  if(!name){
      toast.error('Please enter channel name!')
      return
    } 
    setLoading(true)
    await updateChannel({
       name
    },channel.id)
    const formChannel = {
      ...channel,
      name
    }
    setChannel(formChannel)
    setLoading(false)
    setIsOpen(false)
    toast.success("Update channel successfully!")
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
          <span className="text-[#fff] my-3 text-xl font-semibold">{'Edit channel'}</span>
      </div>
     
      <form onSubmit={handleSaveForm} className="flex flex-col m-4 space-y-4">
      <div className="flex flex-col">
      <div className="flex justify-center mt-6">
          {channel.photoUrl && (
            <label className="group relative"  onChange={handleChangeAvatar} htmlFor="changeAvatar" title='Upload channel photo'>
             <input hidden id="changeAvatar" type="file" accept="image/*" />
              <img
                className="text-white w-[100px] h-[100px] rounded-full cursor-pointer"
                src={channel.photoUrl}
                alt=""
              />
                 <div
                 className="group-hover:block hidden absolute top-0 left-0 right-0 bottom-0 cursor-pointer rounded-full bg-[#333] bg-opacity-60">
                            <span className="flex mt-3  text-center justify-center text-[#fff] text-[10px] font-bold translate-y-6">
                              Upload channel photo
                            </span>
                          </div>
            
            </label>
          )}
        </div>

      <label className="text-gray-400 text-sm mb-1">Channel name</label>
      <input value={name} onChange={({target}) => setFormValues((prev) => ({...prev, name: target.value}))}  className="bg-transparent text-white border border-gray-600 px-4 py-2 rounded-md outline-none" type="text" placeholder="Enter channel name" />
      </div>
        <div className="flex justify-end">
        <button onClick={handleSaveForm} disabled={isNotChangeValues} className={clsx({
          'opacity-50': isNotChangeValues
        },'px-4 py-2  bg-green-700 rounded-md')}>
          <span className="text-white">Save</span>
        </button>
        </div>
      </form>
    
    </div>
</>
}
  </>
  );
};

export default ModalSettingChannel;

ModalSettingChannel.propTypes = {
  children: PropTypes.element,
  channel: PropTypes.object.isRequired,
};
