import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaDiscord } from "react-icons/fa";
import { toast } from "react-toastify";
import {  updateChannel,  } from "../../service/CRUD";
import {

  BsFillPencilFill,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { typeImage } from "../../service/helper";
import Notification from "../Notification";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { MEDIA_SUPPORT } from "../../utils/constants";
import { uploadImage } from "../../apis/cloudinary";
import LoadingOverlay from "../LoadingOverlay";
import ModalSettingChannel from "./modalSettingChannel";

const Modal = ({ setModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionId = sessionStorage.getItem("sessionId");
  const { setUser, setChannel } = bindActionCreators(actionCreator, dispatch);
  const { channel , channels ,  } = useSelector((state) => state.channels)
  const { users } = useSelector((state) => state.users);
  const [ membersFilter , setMembersFilter] = useState([]);

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



  const handleToMessage = (user) => {
    setUser(user);
    navigate("/channels/@me/" + user.nickname);
  };

  return (
    <>
    <div
      onClick={() => setModal(false)}
      className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] bg-opacity-50 z-20 "
    ></div>
    <Notification />
  
    <div className="fixed lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 left-0 right-0 bottom-0 z-30 w-full lg:w-[40rem]  bg-[#36393f] h-[60%] lg:h-[30rem] shadow-md rounded-md">
      <div className="relative rounded-lg">
      {channel?.roomMaster === sessionId && (
    <ModalSettingChannel channel={channel}>
      <button className="absolute top-0 right-2 cursor-pointer">
        <BsFillPencilFill className="bg-black bg-opacity-30 text-white mt-3 mr-3 rounded-full  text-3xl p-1" />
      </button>
    </ModalSettingChannel>
   )}
        <div className="flex justify-center mt-6">
          {channel.photoUrl && (
              <img
                className="text-white w-[100px] h-[100px] rounded-full cursor-pointer"
                src={channel.photoUrl}
                alt=""
              />
          )}
        </div>
      </div>
  
      <div
        className=
          "pb-3 mt-3 flex truncate justify-center border-b-[1px] space-x-2 items-center border-[#33353b]"
      > 
       <span className="text-[#fff] text-lg">{channel?.name ?? ''}</span>
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
  channel: PropTypes.object.isRequired,
};
