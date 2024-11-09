import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { FaDiscord, FaRegSave, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { addRequest, updateChannel, updateUser } from "../../service/CRUD";
import {
  BsCircleFill,
  BsDashCircleFill,
  BsFillMoonFill,
  BsFillPencilFill,
  BsRecordCircleFill,
  BsSave,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import Progess from "../Progess";
import { typeImage } from "../../service/helper";
import Notification from "../Notification";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { MEDIA_SUPPORT } from "../../utils/constants";
import { uploadImage } from "../../apis/cloudinary";
import LoadingOverlay from "../LoadingOverlay";

const Modal = ({ setModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setUser, setChannel } = bindActionCreators(actionCreator, dispatch);
  const { channel , channels ,  } = useSelector((state) => state.channels)
  const { users } = useSelector((state) => state.users);
  const [percent] = useState(0);
  const [ membersFilter , setMembersFilter] = useState([]);
  const [ editNameChannel , setEditNameChannel] = useState(false)
  const [ channelName , setChannelName] = useState(channel?.name ?? '')
  const [ loading , setLoading ] = useState(false)
console.log('chanel :',channel)
  useEffect(() => {
    if (channel.roomMaster) {
      const members = users.filter(
        (user) =>
          user.channels.includes(channel.channelId) &&
          user.id !== channel.roomMaster
      );
      setMembersFilter(members);
    }
  }, [users, channels, channel]);


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
  const handleToMessage = (user) => {
    setUser(user);
    navigate("/channels/@me/" + user.nickname);
  };

  const handleSubmitChannelName = () => {
    if(!channelName) return
    console.log('channel :',channel)
    const fromData = {
      ...channel,
      name: channelName,
    }
    console.log('fromData :',fromData)
    updateChannel(fromData, channel.id)
    setChannel(fromData)
    setEditNameChannel(false)
  }
  return (
    <>
    <Progess percent={percent} />
    <div
      onClick={() => setModal(false)}
      className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] bg-opacity-50 z-20 "
    ></div>
    <Notification />
  
    <div className="fixed lg:top-[20%] lg:left-[30%] left-0 right-0 bottom-0 z-30 w-full lg:w-[40rem]  bg-[#36393f] h-[60%] lg:h-[30rem] shadow-md rounded-md">
     <LoadingOverlay visible={loading} />
      <div className="relative rounded-lg">
        <div className="flex justify-center mt-6">
          {channel.photoUrl && (
            <label onChange={handleChangeAvatar} htmlFor="changeAvatar" title='Upload channel photo'>
             <input hidden id="changeAvatar" type="file" accept="image/*" />
              <img
                className="text-white w-[100px] h-[100px] rounded-full cursor-pointer"
                src={channel.photoUrl}
                alt=""
              />

            </label>
          )}
        </div>
      </div>
  
      <div
        className=
          "pb-3 mt-3 flex truncate justify-center border-b-[1px] space-x-2 items-center border-[#33353b]"
      > 
      {editNameChannel ?
   <>
    <input className="bg-transparent py-2 px-4 border rounded-lg border-gray-500 text-white outline-none" onChange={({target}) => setChannelName(target.value)} value={channelName}  /> 
    <FaRegSave
     onClick={handleSubmitChannelName}
     className="lg:block hidden cursor-pointer  text-2xl text-green-500"
   />
   </>
    :
    <>
    <span className="text-[#fff] text-lg">{channel.name}</span>
    <BsFillPencilFill
     onClick={() => setEditNameChannel(true)}
     className="lg:block hidden bg-black bg-opacity-30 text-white rounded-full cursor-pointer  text-2xl p-1 "
   />
    </>
    }
      </div>
      <div className="relative px-6 py-4">
        <span className="text-[#b9bbbe] text-sm font-bold flex">Members</span>
        <div className="h-full overflow-y-scroll">
        {membersFilter.length > 0 ?
            membersFilter.map((member) => (
              <div
                key={member.id}
                className=" hover:bg-[#3e4148] flex justify-between px-2 py-1 cursor-pointer "
              >
                <div className="">
                  <div className="flex gap-2">
                    {member.avatar.includes(typeImage) ? (
                      <img
                        src={member.avatar}
                        alt=""
                        className="w-[34px] h-[34px] my-1 rounded-full cursor-pointer"
                      />
                    ) : (
                      <FaDiscord
                        style={{ backgroundColor: member.avatar }}
                        className="text-white w-[33px] h-[33px] p-[.4rem] my-1 rounded-full cursor-pointer"
                      />
                    )}
                    <div>
                    <span className="text-[#fff] text-base flex">{member.nickname}</span>
                    <span className="text-[#B9BBBE] text-[12px] flex ">{`#${member.uid}`}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleToMessage(member)}
                    className="text-[#fff] my-2 border-[1px] border-[#3ba55d] hover:bg-[#3ba55d] px-[16px] py-[2px]"
                  >
                   Send message
                  </button>
                </div>
              </div>
            )) :
            <span className="text-[#999] mt-4" >Not found member</span>
            }
        </div>
      </div>
    </div>
  </>
  );
};

export default Modal;

Modal.propTypes = {
  setModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
