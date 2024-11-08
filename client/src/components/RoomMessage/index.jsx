import clsx from "clsx";
import { serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState, useEffect, useRef, memo } from "react";
import {
  AiFillFileZip,
  AiFillPicture,
  AiOutlineDownload,
} from "react-icons/ai";
import {
  BsCircleFill,
  BsDashCircleFill,
  BsFillMicFill,
  BsFillMoonFill,
  BsRecordCircleFill,
  BsTrashFill,
} from "react-icons/bs";
import {
  FaCrown,
  FaGift,
  FaSmileBeam,
  FaStickyNote,
  FaDiscord,
  FaTimesCircle,
  FaBars,
  FaFileAudio,
} from "react-icons/fa";
import { HiHashtag } from "react-icons/hi";
import { IoIosAddCircle, IoIosReturnLeft } from "react-icons/io";
import { RiFileGifFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Notification from "../Notification";
import { storage } from "../../firebase/config";
import {
  addMessage,
  deleteMessage,
  updateChannel,
  updateUser,
} from "../../service/CRUD";
import { formatBytes, formatDate, typeImage } from "../../service/helper";
import EmojsPicker from "../Emojis/EmojsPicker";
import { GoReply } from "react-icons/go";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import Modal from "../Modal/modalDetailsUser";
import { useNavigate } from "react-router-dom";

const RoomMessage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUser, setRoom } = bindActionCreators(actionCreator, dispatch);
  const sessionId = sessionStorage.getItem("sessionId");
  const roomMaster = JSON.parse(localStorage.getItem("roomMaster"));
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState();
  const [showEmoji, setShowEmoji] = useState(false);
  const { users } = useSelector((state) => state.users);
  const { channel, channels } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);
  const { room, rooms } = useSelector((state) => state.rooms);
  const currentUser = sessionId && users.find((user) => user.id === sessionId);
  const [membersFilter, setMembersFilter] = useState([]);
  const [currentMemberOption, setCurrentMemberOption] = useState(null);
  const [showModalDetailUser, setShowModalDetailUser] = useState(false);
  const [currentMember, setCurrentMember] = useState({});
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState();
  const [reply, setReply] = useState({});
  const [filterMessages, setFilterMessages] = useState([]);
  const memberOptionRef = useRef();
  const messageRef = useRef();

  useEffect(() => {
    if (room.id) {
      const results =
        room.id && messages.filter((message) => message.roomId === room.id);
      setFilterMessages(results);
    }
  }, [room, rooms, messages]);

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

  useEffect(() => {
    if (emoji) {
      setMessage(message.concat(emoji.native));
      messageRef.current.focus();
    }
  }, [emoji]);

  useEffect(() => {
    const unListen = window.addEventListener("click", (e) => {
      const checkInBarInfo = e.composedPath().some((p) => p === memberOptionRef.current);
      if (!checkInBarInfo) {
        setCurrentMemberOption(null);
      }
    });
    return () => {
      window.removeEventListener("click", unListen);
    };
  }, [currentMemberOption]);
  const handleShowEmoij = () => {
    setShowEmoji(true);
  };

  const handleSubmitMessage = (e) => {
    if(!message) return
    e.preventDefault();
    if (room.id) {
      const formData = {
        roomId: room.id,
        name: currentUser.nickname,
        message,
        reply,
        userId: sessionId,
        timestamp: serverTimestamp(),
      };
      addMessage(formData);
      setMessage("");
      setReply({});
    }
  };

  const handleShowOptionMember = (e, member) => {
    if (e.nativeEvent.button === 0) {
      setCurrentMemberOption(null); //left click
    } else if (e.nativeEvent.button === 2) {
      setCurrentMemberOption(member.id); //right click
    }
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    setFile(e.target.files);
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
          if (file.name) {
            const formData = {
              roomId: room.id,
              userId: sessionId,
              urlFile: url,
              typeFile: file.type,
              sizeFile: file.size,
              nameFile: file.name,
              reply,
              name: currentUser.nickname,
              timestamp: serverTimestamp(),
            };
            setReply({});
            addMessage(formData);
          }
        });
      }
    );
  };

  const handleDeleteMember = (member) => {
    const formChannel = {
      ...channel,
      members: channel.members.replace(member.id, ""),
    };
    const formUser = {
      ...member,
      channels: member.channels.replace(channel.channelId, ""),
    };
    updateChannel(formChannel, channel.id);
    updateUser(formUser, member.id);
    toast.success("Delete member successfully", {
      autoClose: 3000,
      theme: "dark",
    });
  };

  const handleDeleteMessage = (id) => {
    deleteMessage(id);
  };

  const handleShowInfoDetail = (member) => {
    setCurrentMember(member);
    setShowModalDetailUser(true);
    setCurrentMemberOption(null);
  };

  const handleReplyMessage = (message) => {
    setReply(message);
    messageRef.current.focus();
  };

  const handleToMessage = (user) => {
    setUser(user);
    navigate("/channels/@me/" + user.nickname);
  };

  const getImage = (id) => {
    const results = users.find((user) => user.id === id);
    return results.avatar;
  };

  const handleHideNavBarMobile = () => {
    setRoom({});
  };
  return (
    <>
      {showModalDetailUser && (
        <Modal user={currentMember} setModal={setShowModalDetailUser} />
      )}
      <div
        className={clsx(
          { "translate-x-[-15%] !opacity-100": room.id },
          "lg:relative z-10 lg:w-[83.8%]  w-[100%] fixed transition-all  duration-500 lg:opacity-100  opacity-0 h-screen lg:translate-x-0 translate-x-[100%]  bg-[#36393f]"
        )}
      >
        <Notification />

        <div className="flex gap-2 p-2  shadow-md h-[44px]">
          <FaBars
            onClick={handleHideNavBarMobile}
            className="lg:hidden block text-[#8e9297] cursor-pointer text-2xl translate-y-1 mr-3"
          />
          <HiHashtag className="text-[#8e9297] translate-y-1 text-2xl" />
          <span className="text-lg h-[2rem] font-semibold text-[#fff]">
            {room.name ? room.name : "Please choose a room to chat"}
          </span>
        </div>
        <div className="w-full h-screen overflow-hidden">
          <div className="flex h-full">
            <div className="lg:w-[80%] w-full relative overflow-hidden ">
              <div className="ml-3 lg:mx-4 flex flex-col-reverse overflow-y-scroll h-[calc(100%_-_102px)] overflow-x-hidden ">
                {room.id &&
                  filterMessages.map((data) => (
                    <div key={data.id}>
                      <div className="flex relative border-t-[1px] border-[#41464d]">
                        <span className="absolute top-[-8px] px-2 bg-[#36393f] text-xs font-semibold text-[#a3a69f] left-[45%] flex justify-center"></span>
                      </div>
                      {data.reply.id && (
                        <div className="flex gap-1 relative ml-4 translate-y-3">
                          <IoIosReturnLeft className="text-[#b9bbbe] text-3xl rotate-[180deg]" />
                          {getImage(data.reply.userId).includes(typeImage) ? (
                            <img
                              src={getImage(data.reply.userId)}
                              alt=""
                              className="w-[20px] h-[20px] rounded-full cursor-pointer"
                            />
                          ) : (
                            <FaDiscord
                              style={{
                                background: getImage(data.reply.userId),
                              }}
                              className="text-white w-[20px] h-[20px] mt-[1px] p-[.2rem] rounded-full cursor-pointer"
                            />
                          )}
                          <span className="text-[#a3a69f] text-[14px] font-semibold">
                            {data.reply.name}
                          </span>
                          {data.reply.typeFile &&
                            data.reply.typeFile.includes("application") && (
                              <div className="flex gap-2">
                                <a
                                  className="text-[#14afee] text-sm hover:underline"
                                  href={data.reply.urlFile}
                                  title=""
                                >
                                  Click to download attachment
                                </a>
                                <a href={data.reply.urlFile} title="">
                                  <AiFillFileZip className="text-[#d3d6fd] text-sm mt-1 cursor-pointer" />
                                </a>
                              </div>
                            )}
                          {data.reply.typeFile &&
                            data.reply.typeFile.includes("image") && (
                              <div className="flex gap-2">
                                <div
                                  onClick={() =>
                                    window
                                      .open(data.reply.urlFile, "_blank")
                                      .focus()
                                  }
                                  className="text-[#d3d6fd] text-sm cursor-pointer"
                                >
                                  Click to view image file
                                </div>
                                <div
                                  onClick={() =>
                                    window
                                      .open(data.reply.urlFile, "_blank")
                                      .focus()
                                  }
                                >
                                  <AiFillPicture className="text-[#d3d6fd] text-sm mt-1 cursor-pointer" />
                                </div>
                              </div>
                            )}
                          {!data.reply.typeFile && (
                            <span
                              title={data.reply.message}
                              className="text-[#a3a69f] text-[12px] translate-y-[2px]"
                            >
                              {data.reply.message.length > 30
                                ? data.reply.message.substr(0, 30) + "..."
                                : data.reply.message}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="group mr-4 relative flex  gap-3 py-2 ">
                        <div className="group-hover:flex hidden absolute top-0 right-0 bg-[#2f3136] shadow-md z-50">
                          <GoReply
                            onClick={() => handleReplyMessage(data)}
                            className="text-[#a3a69f] text-[30px] p-1 hover:bg-[#40444b] cursor-pointer"
                          />
                          {data.userId === sessionId && (
                            <BsTrashFill
                              onClick={() => handleDeleteMessage(data.id)}
                              className="text-[#a3a69f] text-[30px] p-1 hover:bg-[#40444b] cursor-pointer"
                            />
                          )}
                        </div>
                        <div className="w-[15%] lg:w-[5%] relative my-1">
                          {getImage(data.userId).includes(typeImage) ? (
                            <img
                              className="lg:w-[42px] lg:h-[42px] w-[36px]
                            h-[36px] rounded-full"
                              src={getImage(data.userId)}
                              alt=""
                            />
                          ) : (
                            <FaDiscord
                              style={{ background: getImage(data.userId) }}
                              className="my-2 text-white lg:w-[42px] w-[36px] lg:h-[42px] h-[36px] mt-[1px] p-[.4rem] rounded-full cursor-pointer"
                            />
                          )}
                        </div>
                        <div className="w-[85%] lg-w-[95%] max-h-[30rem]">
                          <div className="flex gap-2">
                            <span className="text-base text-[#fff]">
                              {data.name}
                            </span>

                            <span className="top-0 right-0 text-[.65rem] text-[#9ca69c]">
                              {data.timestamp &&
                                formatDate(data.timestamp.toDate().toString())}
                            </span>
                          </div>

                          <div className="flex w-[20rem] max-h-[25rem]">
                            {data.typeFile && data.typeFile.includes("image") && (
                              <img
                                className={clsx(
                                  {
                                    "h-[15rem] mt-2 bg-slate-700 animate-pulse":
                                      !data.urlFile,
                                  },
                                  "h-[15rem] mt-2"
                                )}
                                src={data.urlFile}
                                alt=""
                              />
                            )}

                            {data.typeFile &&
                              data.typeFile.includes("application") && (
                                <div className="flex gap-1 bg-[#2f3136] px-1 py-2">
                                  <AiFillFileZip className="text-5xl text-[#d3d6fd]" />
                                  <div>
                                    <a
                                      href={data.urlFile}
                                      title=""
                                      className="flex text-[#14afee] hover:underline"
                                    >
                                      {data.nameFile}
                                    </a>
                                    <span className="flex text-[#5a645d] text-[12px]">
                                      {formatBytes(data.sizeFile)}
                                    </span>
                                  </div>
                                  <a href={data.urlFile}>
                                    <AiOutlineDownload className="text-2xl text-[#b9bbbe] my-3" />
                                  </a>
                                </div>
                              )}

                            {data.typeFile && data.typeFile.includes("audio") && (
                              <div className="bg-[#2f3136] w-[30rem] p-2">
                                <div className="flex gap-1 px-1 py-2 justify-between">
                                  <div>
                                    <div className="flex gap-2">
                                      <FaFileAudio className="text-4xl text-[#d3d6fd]" />
                                      <div>
                                        <a
                                          href={data.urlFile}
                                          title=""
                                          className="flex text-[#14afee] hover:underline"
                                        >
                                          {data.nameFile}
                                        </a>
                                        <span className="flex text-[#5a645d] text-[12px]">
                                          {formatBytes(data.sizeFile)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <a href={data.urlFile}>
                                      <AiOutlineDownload className="text-2xl text-[#b9bbbe] my-2" />
                                    </a>
                                  </div>
                                </div>
                                <div className="flex">
                                  <audio
                                    className="rounded-md w-full h-[2rem]"
                                    src={data.urlFile}
                                    controls
                                  ></audio>
                                </div>
                              </div>
                            )}

                            {data.typeFile && data.typeFile.includes("video") && (
                               <div className="max-w-[20rem] max-h-[30rem]">
                               <video
                                 className="h-full"
                                 src={data.urlFile}
                                 controls
                               ></video>
                             </div>
                            )}

                            {!data.typeFile && (
                              <span className="break-words text-[14px] w-[20rem] text-[#ccddd9]">
                                {data.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {room.id && (
                <form
                  onSubmit={handleSubmitMessage}
                  className={clsx(
                    { "rounded-b-lg": reply.name, "rounded-lg": !reply.name },
                    "absolute bottom-12 h-12 left-0 right-0 flex py-2 px-4 gap-3 bg-[#40444b] mx-3 shadow-md"
                  )}
                >
                  {reply.name && (
                    <div className="absolute top-[-42px] left-0 right-0 flex justify-between bg-[#31343a] rounded-t-lg px-3 py-2 drop-shadow-lg">
                      <span className="text-[#b0b2b5]">{`Responding to ${reply.name}`}</span>
                      <FaTimesCircle
                        onClick={() => setReply({})}
                        className="text-[#b0b2b5] mt-[6px] cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="w-[85%]">
                    <div className="flex gap-2">
                      <label onChange={handleChangeFile} htmlFor="uploadFile">
                        <input id="uploadFile" type="file" hidden />
                        <IoIosAddCircle className="text-[#b9bbbe] text-3xl cursor-pointer" />
                      </label>
                      <input
                        ref={messageRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-[#fff] bg-transparent outline-none w-full py-1"
                        type="text"
                        placeholder="Send a message to everyone in the room                      "
                      />
                    </div>
                  </div>
                  <div className="w-[15%]">
                    <div className="flex gap-3 py-1 float-right mx-3">
                      {/* <BsFillMicFill className="text-[#b9bbbe] text-2xl cursor-pointer lg:block hidden" />
                      <FaGift className="text-[#b9bbbe] text-2xl cursor-pointer lg:block hidden" />
                      <RiFileGifFill className="text-[#b9bbbe] text-2xl cursor-pointer lg:block hidden" />
                      <FaStickyNote className="text-[#b9bbbe] text-2xl cursor-pointer lg:block hidden rotate-[270deg]" /> */}
                      <div className="relative">
                        <FaSmileBeam
                          onClick={handleShowEmoij}
                          className="text-[#b9bbbe] text-2xl cursor-pointer"
                        />
                        {showEmoji && (
                          <EmojsPicker
                            setShowEmoji={setShowEmoji}
                            setEmoji={setEmoji}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            <div className="lg:block hidden w-[20%] bg-[#2f3136] px-2 pt-6 overflow-y-scroll h-full">
              <div className="">
                <span className="text-[#96989d]">Owner</span>
                <div
                  onContextMenu={(e) => handleShowOptionMember(e, roomMaster)}
                  className="flex gap-2 my-1 hover:bg-[#36393f] py-1 px-2 cursor-pointer rounded-md h-[3rem]"
                >
                  <div className="relative cursor-pointer">
                    {roomMaster.id === currentMemberOption && (
                      <div
                        ref={memberOptionRef}
                        className="absolute top-0 left-[30%] bg-[#18191c] w-[10rem] p-1 z-10 rounded-md shadow-md"
                      >
                        <div
                          onClick={() => handleShowInfoDetail(roomMaster)}
                          className={clsx(
                            { "rounded-md": roomMaster.id === sessionId },
                            "hover:bg-[#4752c4] hover:text-[#fff] rounded-t-md  flex text-[#a1a3a6] font-semibold p-2"
                          )}
                        >
                          Hồ sơ
                        </div>

                        {roomMaster.id !== sessionId && (
                          <div
                            onClick={() => handleToMessage(roomMaster)}
                            className={clsx(
                              {
                                "rounded-b-md ":
                                  currentUser.id !== roomMaster.id,
                              },
                              "hover:bg-[#4752c4] hover:text-[#fff]  flex text-[#a1a3a6] font-semibold p-2"
                            )}
                          >
                            Nhắn tin
                          </div>
                        )}
                      </div>
                    )}
                    {roomMaster.avatar &&
                    roomMaster.avatar.includes(typeImage) ? (
                      <img
                        src={roomMaster.avatar}
                        alt=""
                        className="w-[37px] h-[37px] mt-[1px] rounded-full"
                      />
                    ) : (
                      <FaDiscord
                        style={{ background: roomMaster.avatar }}
                        className="text-white w-[36px] h-[36px] mt-[1px] p-[.4rem] rounded-full "
                      />
                    )}
                    {roomMaster.status === "online" && (
                      <BsCircleFill className="absolute bottom-[0px] right-0 text-[#3ba55d] bg-[#42464d] rounded-full text-sm p-[2px]" />
                    )}
                    {roomMaster.status === "offline" && (
                      <BsRecordCircleFill className="absolute bottom-[0px] right-0 text-[#747f8d] bg-[#42464d] rounded-full text-sm p-[2px]" />
                    )}
                    {roomMaster.status === "busy" && (
                      <BsDashCircleFill className="absolute bottom-[0px] right-0 text-[#ed4245] bg-[#42464d] rounded-full text-sm p-[2px]" />
                    )}
                    {roomMaster.status === "sleep" && (
                      <BsFillMoonFill className="rotate-[260deg] absolute bottom-[0px] right-0 text-[#faa81a] bg-[#42464d] rounded-full text-sm p-[2px]" />
                    )}
                  </div>
                  <div>
                    <div
                      className={clsx(
                        { "translate-y-[8px]": !roomMaster.note },
                        "flex  gap-2 "
                      )}
                    >
                      <span className="text-[#b9bbbe] font-semibold">
                        {roomMaster.nickname}
                      </span>
                      <FaCrown className="text-sm mt-1 text-[#faa81a]" />
                    </div>
                    {roomMaster.note && (
                      <div>
                        <span
                          className="flex text-[#b9bbbe] text-[12px] font-medium"
                          title={roomMaster.note}
                        >
                          {roomMaster.note.length > 20
                            ? roomMaster.note.substr(0, 20) + "..."
                            : roomMaster.note}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex">
                  <span className="text-[#96989d]">Members</span>
                </div>
                {membersFilter.map((member) => (
                  <div
                    onContextMenu={(e) => handleShowOptionMember(e, member)}
                    key={member.id}
                    className="relative flex gap-2 my-2 cursor-pointer py-1 px-2 hover:bg-[#42464d] rounded-md h-[3rem]"
                  >
                    {member.id === currentMemberOption && (
                      <div
                        ref={memberOptionRef}
                        className="absolute top-0 left-[30%] bg-[#18191c] w-[10rem] p-1 z-10 rounded-md shadow-md"
                      >
                        <div
                          onClick={() => handleShowInfoDetail(member)}
                          className={clsx(
                            { "rounded-md": member.id === sessionId },
                            "hover:bg-[#4752c4] hover:text-[#fff] rounded-t-md  flex text-[#a1a3a6] font-semibold p-2"
                          )}
                        >
                          Profile
                        </div>

                        {member.id !== sessionId && (
                          <div
                            onClick={() => handleToMessage(member)}
                            className={clsx(
                              {
                                "rounded-b-md ":
                                  currentUser.id !== roomMaster.id,
                              },
                              "hover:bg-[#4752c4] hover:text-[#fff]  flex text-[#a1a3a6] font-semibold p-2"
                            )}
                          >
                            Send Message
                          </div>
                        )}
                        {currentUser.id === roomMaster.id && (
                          <div
                            onClick={() => handleDeleteMember(member)}
                            className="hover:bg-[#d83c3e] hover:text-[#fff] rounded-b-md flex text-[#d83c3e] font-semibold p-2"
                          >
                            Kick out
                          </div>
                        )}
                      </div>
                    )}
                    <div className="relative ">
                      {member.avatar.includes(typeImage) ? (
                        <img
                          className="w-[37px] h-[37px] mt-[1px] rounded-full cursor-pointer"
                          src={member.avatar}
                          alt=""
                        />
                      ) : (
                        <FaDiscord
                          style={{ background: member.avatar }}
                          className="text-white w-[36px] h-[36px] mt-[1px] p-[.4rem] rounded-full cursor-pointer"
                        />
                      )}
                      {member.status === "online" && (
                        <BsCircleFill className="absolute bottom-[0px] right-0 text-[#3ba55d] bg-[#42464d] rounded-full text-sm p-[2px]" />
                      )}
                      {member.status === "offline" && (
                        <BsRecordCircleFill className="absolute bottom-[0px] right-0 text-[#747f8d] bg-[#42464d] rounded-full text-sm p-[2px]" />
                      )}
                      {member.status === "busy" && (
                        <BsDashCircleFill className="absolute bottom-[0px] right-0 text-[#ed4245] bg-[#42464d] rounded-full text-sm p-[2px]" />
                      )}
                      {member.status === "sleep" && (
                        <BsFillMoonFill className="rotate-[260deg] absolute bottom-[0px] right-0 text-[#faa81a] bg-[#42464d] rounded-full text-sm p-[2px]" />
                      )}
                    </div>
                    <div>
                      <span
                        className={clsx(
                          { "translate-y-[8px]": !member.note },
                          "flex text-[#b9bbbe] font-semibold"
                        )}
                      >
                        {member.nickname}
                      </span>
                      {member.note && (
                        <span className="flex text-[#b9bbbe] text-[12px] font-medium ">
                          {member.note}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default memo(RoomMessage);
