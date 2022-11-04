import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { FaDiscord } from "react-icons/fa";
import { toast } from "react-toastify";
import { addRequest, updateUser } from "../../service/CRUD";
import {
  BsCircleFill,
  BsDashCircleFill,
  BsFillMoonFill,
  BsFillPencilFill,
  BsRecordCircleFill,
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
import clsx from "clsx";
import { serverTimestamp } from "firebase/firestore";

const Modal = ({ setModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionId = sessionStorage.getItem("sessionId");
  const { setUser } = bindActionCreators(actionCreator, dispatch);
  const { requests } = useSelector((state) => state.requests)
  const { channel , channels } = useSelector((state) => state.channels)
  const [sessionUser, setSessionUser] = useState({});
  const { users } = useSelector((state) => state.users);
  const [currentUser, setCurrentUser] = useState({});
  const [myRequest, setMyRequest] = useState([]);
  const [percent, setPercent] = useState(0);
  const [ membersFilter , setMembersFilter] = useState([]);
  const [ editNameChannel , setEditNameChannel] = useState(false)
  const [ channelName , setChannelName] = useState("")

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

  const handleSubmitChannelName = () => {

  }
  return (
    <>
    <Progess percent={percent} />
    <div
      onClick={() => setModal(false)}
      className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] bg-opacity-50 z-20 "
    ></div>
    <Notification />
  
    <div className="fixed lg:top-[20%] lg:left-[30%]  left-0 right-0 bottom-0 z-30 w-full lg:w-[40rem]  bg-[#36393f] h-[60%] lg:h-[30rem] shadow-md">
      <div className="relative rounded-lg">
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
          "flex justify-center border-b-[1px]  border-[#33353b]"
      > 
          <span className="text-[#fff] my-3 text-lg">{channel.name}</span>
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
                   Nhắn tin
                  </button>
                </div>
              </div>
            )) :
            <span className="text-[#999]" >Không tìm thấy người dùng khác</span>
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
