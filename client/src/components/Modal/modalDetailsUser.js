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
  const [note, setNote] = useState("");
  const [nickname , setNickname] = useState("");
  const [percent, setPercent] = useState(0);

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

  const handleSubmitNote = (e) => {
    e.preventDefault();
    const formUser = {
      ...user,
      note,
    };
    updateUser(formUser, user.id);
    toast.info("Update note success", {
      autoClose: 3000,
      theme: "dark",
    });
  };

  const handleSubmitName = (e) => {
    e.preventDefault()
    const formUser = {
      ...user,
      nickname
    };
    updateUser(formUser, user.id);
    toast.info("Update name success", {
      autoClose: 3000,
      theme: "dark",
    });
  }

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `/file/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          if (currentUser.id) {
            const formUser = {
              ...currentUser,
              avatar: url,
            };
            updateUser(formUser, currentUser.id);
            toast.success("Change avatar success", {
              autoClose: 3000,
              theme: "dark",
            });
          }
        });
      }
    );
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
      <Progess percent={percent} />
      <div
        onClick={() => setModal(false)}
        className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] z-20 bg-opacity-50"
      ></div>
      <Notification />
    
      <div className="fixed lg:top-[20%] lg:left-[30%]  left-0 right-0 bottom-0 z-30 w-full lg:w-[40rem]  bg-[#18191c] h-[60%] lg:h-[30rem] shadow-md">
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
              <label onChange={handleChangeAvatar} htmlFor="changeAvatar">
                <input hidden id="changeAvatar" type="file" accept="image/*" />
                <BsFillPencilFill className="bg-black bg-opacity-30 text-white mt-3 mr-3 rounded-full  text-4xl p-1 cursor-pointer" />
              </label>
            )}
          </div>

          <div className="absolute top-[3.5rem] left-[1.5rem]">
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
          <div className="flex-row items-center space-x-1">
            <span className="text-[#b9bbbe] font-bold text-xl  max-h-[2rem]">
              {currentUser.nickname}
            </span>
          <span className="text-[#b9bbbe] font-bold text-xl mt-2 ">{`#${currentUser.uid}`}</span>
          </div>
        </div>
        <form onSubmit={handleSubmitNote} className="relative px-6 py-4">
          <span className="text-[#b9bbbe] text-sm font-bold flex">NOTE</span>
          {currentUser.id !== sessionId ? (
            <span className="flex bg-transparent text-base outline-none mt-2 text-[#b9bbbe] w-full max-h-[2rem]">
              {currentUser.note || "No notes yet"}
            </span>
          ) : (
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex bg-transparent text-base outline-none mt-2 text-[#b9bbbe] w-full max-h-[2rem]"
              type="text"
              placeholder={
                currentUser.note ? currentUser.note : "Click to add notes"
              }
            />
          )}
        </form>
      </div>
    </>
  );
};

export default Modal;

Modal.propTypes = {
  setModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
