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
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../LoadingOverlay";
import { typeImage } from "../../service/helper";
import Notification from "../Notification";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import clsx from "clsx";
import { serverTimestamp } from "firebase/firestore";
import { uploadImage } from "../../apis/cloudinary";
import ModalSettingProfile from './modalSettingProfile'
import { MEDIA_SUPPORT } from "../../utils/constants";

const Modal = ({ setModal, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionId = sessionStorage.getItem("sessionId");
  const { setUser } = bindActionCreators(actionCreator, dispatch);
  const { requests } = useSelector((state) => state.requests)
  const [sessionUser, setSessionUser] = useState({});
  const { users } = useSelector((state) => state.users);
  const [currentUser, setCurrentUser] = useState({});
  const [myRequest, setMyRequest] = useState([]);
  const [percent, setPercent] = useState(0);
  const [ loading , setLoading ] = useState(false)

  useEffect(() => {
    const results = requests.filter((request) => request.from === sessionId);
    setMyRequest(results);
  }, [requests]);

  useEffect(() => {
    const results = users.find((u) => u.id === sessionId);
    setSessionUser(results);
  }, [users]);

  useEffect(() => {
    const results = users.find((u) => u.id === user.id);
    setCurrentUser(results);
  }, [users]);


  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];
    if(!MEDIA_SUPPORT.some((x) => file?.type.includes(x))){
      toast.error('This file type is not supported!')
      return
    }
    setLoading(true)
    const data = await uploadImage(file)
    if(data?.url){
      // if(currentUser.avatarPublicId){
      //   const res = await destroyImage(currentUser.avatarPublicId)
      //   console.log('res :',res)
      // }
      if (currentUser.id) {
        const formUser = {
          ...currentUser,
          avatar: data.url,
          avatarPublicId: data?.public_id
        };
        updateUser(formUser, currentUser.id);
        setLoading(false)
        toast.success("Upload avatar successfully!", {
          autoClose: 3000,
          theme: "dark",
        });
      }

    }else {
      toast.error("Upload avatar failed", {
        autoClose: 3000,
        theme: "dark",
      })}
  };

  useMemo(() => {
    if (percent === 100) {
      setPercent(0);
    }
  }, [percent]);

  const handleToMessage = (user) => {
    setUser(user);
    setModal(false)
    navigate("/channels/@me/" + user.nickname);
  };


  const handleSendRequest = (user) => {
    const formRequest = {
      action: "addFriend",
      from: sessionId,
      to: user.id,
      timestamp: serverTimestamp(),
    };
    addRequest(formRequest);
  }
  return (
    <>
      <div
        onClick={() => setModal(false)}
        className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] z-20 bg-opacity-50"
      >

      </div>
      <Notification />
    
      <div className="fixed lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2  left-0 right-0 bottom-0 z-30 w-full lg:w-[40rem] rounded-md bg-[#18191c] h-[60%] lg:h-[30rem] shadow-md">
      <LoadingOverlay visible={loading} />
       
        <div className="relative h-[8rem] rounded-lg">
          <div
            style={
              currentUser.avatar && {
                background: currentUser.avatar.includes(typeImage)
                  ? "#3d363f"
                  : currentUser.avatar,
              }
            }
            className="flex justify-end h-full"
          >
            {user.id === sessionId && (
              <ModalSettingProfile user={user}>
                <button>
                <BsFillPencilFill className="bg-black bg-opacity-30 text-white mt-3 mr-3 rounded-full  text-4xl p-1 cursor-pointer" />
                </button>
              </ModalSettingProfile>
            )}
          </div>

          <div className="absolute top-[3.5rem] left-[1.5rem]">
            <label onChange={handleChangeAvatar} htmlFor="changeAvatar" title='Upload avatar'>
              {sessionId === user?.id &&
               <input hidden id="changeAvatar" type="file" accept="image/*" />
              }
            {currentUser.avatar && currentUser.avatar.includes(typeImage) ? (
                <img
                  className="border-[8px] border-[#18191c] text-white w-[140px] h-[140px] rounded-full cursor-pointer"
                  src={currentUser.avatar}
                  alt=""
                />
            ) : (
              <FaDiscord
                style={
                  currentUser.avatar && {
                    background: currentUser.avatar.includes(typeImage)
                      ? "#3d363f"
                      : currentUser.avatar,
                  }
                }
                className="border-[8px] border-[#18191c] text-white w-[140px] h-[140px] p-[20px] rounded-full cursor-pointer"
              />
            )}
              </label>


            {currentUser.status === "online" && (
              <BsCircleFill className="absolute bottom-[10px] right-[8px] w-[40px] h-[40px] text-[#3ba55d] bg-[#18191c] rounded-full text-sm p-[8px]" />
            )}
            {currentUser.status === "offline" && (
              <BsRecordCircleFill className="absolute bottom-[10px] right-[8px] w-[40px] h-[40px] text-[#747f8d] bg-[#18191c] rounded-full text-sm p-[8px]" />
            )}
            {currentUser.status === "busy" && (
              <BsDashCircleFill className="absolute bottom-[10px] right-[8px] w-[40px] h-[40px] text-[#ed4245] bg-[#18191c] rounded-full text-sm p-[8px]" />
            )}
            {currentUser.status === "sleep" && (
              <BsFillMoonFill className="rotate-[260deg]  absolute bottom-[10px] right-[8px] w-[40px] h-[40px] text-[#faa81a] bg-[#18191c] rounded-full text-sm p-[8px]" />
            )}
          </div>
        </div>
        <div className="flex justify-end p-4 gap-2">
          {currentUser.id !== sessionId && (
            <>
              {sessionUser.friends &&
              sessionUser.friends.includes(currentUser.id) ? (
                <button
                  onClick={() => handleToMessage(currentUser)}
                  className="bg-[#215b32] py-2 px-4 hover:bg-opacity-60 text-[#fff] rounded-[4px]"
                >
                  Send Message
                </button>
              ) : (
                <button 
                disabled={
                  myRequest.some((request) => request.to === user.id)
                    ? true
                    : false
                }
                onClick={() => handleSendRequest(currentUser)}
                className={clsx({ "opacity-70 cursor-not-allowed" :myRequest.some((request) => request.to === currentUser.id) },"bg-[#215b32] py-2 px-4 hover:bg-opacity-60 text-[#fff] rounded-[4px]")}>
                   {myRequest.some((request) => request.to === currentUser.id)
                      ? "Friend request sent"
                      : "Add friend"}
                </button>
              )}
              <BsThreeDotsVertical className="text-[#b7b9bc] text-2xl my-2 cursor-pointer" />
            </>
          )}
        </div>
        <div
          className={clsx(
            { "mt-14": currentUser.id === sessionId },
            "relative p-6 mt-3 border-b-[1px] border-[#33353b]"
          )}
        >
          <div className="flex-row items-center space-x-1 mt-4">
            <span className="text-[#b9bbbe] font-bold text-xl  max-h-[2rem]">
              {currentUser.nickname}
            </span>
          <span className="text-[#b9bbbe] font-bold text-xl mt-2 ">{`#${currentUser.uid}`}</span>
          </div>
        </div>
        <div className="relative px-6 py-4">
          <span className="text-[#b9bbbe] text-sm font-bold flex">NOTE</span>
            <span className="flex bg-transparent text-base outline-none mt-2 text-[#b9bbbe] w-full max-h-[2rem]">
              {currentUser.note || "No notes yet"}
            </span>
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
