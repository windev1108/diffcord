import clsx from "clsx";
import { serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  BsCircleFill,
  BsDashCircleFill,
  BsFillMicFill,
  BsFillMoonFill,
  BsRecordCircleFill,
  BsTrashFill,
} from "react-icons/bs";
import { GoReply } from "react-icons/go";
import {
  AiFillFileZip,
  AiFillPicture,
  AiOutlineDownload,
} from "react-icons/ai";
import {
  FaGift,
  FaSmileBeam,
  FaStickyNote,
  FaDiscord,
  FaTimesCircle,
  FaFileAudio,
  FaFileVideo,
  FaBars,
} from "react-icons/fa";
import { IoIosAddCircle, IoIosReturnLeft } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiFileGifFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../../firebase/config";
import { addMessage, deleteMessage } from "../../service/CRUD";
import { formatBytes, formatDate, typeImage } from "../../service/helper";
import EmojsPicker from "../Emojis/EmojsPicker";
import { toast, ToastContainer } from "react-toastify";
import LoadingFile from "./LoadingFile";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { useNavigate } from "react-router-dom";

const UserMessage = () => {
  const dispatch = useDispatch();
  const sessionId = sessionStorage.getItem("sessionId");
  const { setUser } = bindActionCreators(actionCreator, dispatch);
  const { user, users } = useSelector((state) => state.users);
  const { messages } = useSelector((state) => state.messages);
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState();
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentPercent, setCurrentPercent] = useState(0);
  const [reply, setReply] = useState({});
  const userSelected = user.id && users.find((u) => u.id === user.id);
  const currentUser =
    users.length > 0 ? users.find((user) => user.id === sessionId) : {};
  const messagesEndRef = useRef(null);
  const messageRef = useRef();
  const messageContainerRef = useRef();
  // Check RoomUser
  const filterMessages =
    messages.length > 0 && userSelected
      ? messages.filter(
          (m) =>
            m.roomId === userSelected.id + sessionId ||
            m.roomId === sessionId + userSelected.id
        )
      : [];

  const load = (img) => {
    const url = img.getAttribute("lazy-src");

    img.setAttribute("src", url);
  };

  useEffect(() => {
    const lazyImg = document.querySelectorAll("[lazy-src]");
    let obsever = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          load(entry.target);
        }
      });
    });
    lazyImg.forEach((img) => {
      obsever.observe(img);
    });
    return () => {
      //  clean fn
    };
  });
  useMemo(() => {
    if (currentPercent === 100) {
      setTimeout(() => {
        setCurrentPercent(0);
      }, 2000);
    }
  }, [currentPercent]);

  useEffect(() => {
    if (emoji) {
      setMessage(message.concat(emoji.native));
      messageRef.current.focus();
    }
  }, [emoji]);

  const handleShowEmoij = () => {
    setShowEmoji(true);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (message && currentUser.id) {
      const formData = {
        roomId: user.id + sessionId,
        userId: sessionId,
        message,
        name: currentUser.nickname,
        reply,
        timestamp: serverTimestamp(),
      };
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      addMessage(formData);
      setReply({});
      setMessage("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleChangeFile = (e) => {
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
        setCurrentPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          if (file.name) {
            const formData = {
              roomId: user.id + sessionId,
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

  const getImage = (id) => {
    const results = users.find((user) => user.id === id);
    return results.avatar;
  };

  const handleDeleteMessage = (id) => {
    deleteMessage(id);
  };

  const handleReplyMessage = (message) => {
    setReply(message);
    messageRef.current.focus();
  };

  const handleHideNavBarMobile = () => {
    setUser({});
  };

  return (
    <div
      className={clsx(
        { "!translate-x-[0%] !opacity-100": user.id },
        "lg:relative lg:w-[80%] w-[100%] fixed transition-all duration-500 lg:opacity-100 opacity-0  h-screen lg:translate-x-0 translate-x-[100%]  bg-[#36393f]"
      )}
    >
      <ToastContainer />
      <div className="absolute top-0 left-0 right-0 bg-[#36393f] h-[44px] z-50">
        <div className="flex gap-2 p-2 shadow-md h-full">
          <FaBars
            onClick={handleHideNavBarMobile}
            className="lg:hidden block text-[#8e9297] cursor-pointer text-2xl mr-3"
          />
          <MdOutlineAlternateEmail className="text-[#8e9297] translate-y-1 text-2xl" />
          <span className="text-lg font-bold text-[#fff]">{user.nickname}</span>
          {user.status === "online" && (
            <BsCircleFill className="text-[#3ba55d] rounded-full text-sm my-[8px]" />
          )}
          {user.status === "offline" && (
            <BsRecordCircleFill className="text-[#747f8d] rounded-full text-sm my-[8px]" />
          )}
          {user.status === "busy" && (
            <BsDashCircleFill className="text-[#ed4245] rounded-full text-sm my-[8px]" />
          )}
          {user.status === "sleep" && (
            <BsFillMoonFill className="rotate-[260deg] text-[#faa81a] rounded-full text-sm my-[8px]" />
          )}
        </div>
      </div>
      <div className="relative h-full overflow-hidden">
        <div
          ref={messageContainerRef}
          className="ml-3 lg:mx-4 flex flex-col-reverse overflow-y-scroll overflow-x-hidden h-[calc(100%_-_108px)] mt-[3rem]"
        >
          {currentPercent > 0 && (
            <LoadingFile
              percent={currentPercent}
              setCurrentPercent={setCurrentPercent}
            />
          )}

          {filterMessages.map((data) => (
            <div key={data.id}>
              <div className="relative border-t-[1px] border-[#41464d]">
                <span className="absolute top-[-8px] px-2 bg-[#36393f] text-xs font-semibold text-[#a3a69f] left-[45%] flex justify-center"></span>
              </div>

              {data.reply.id && (
                <div className="flex gap-1 relative ml-4 translate-y-3">
                  <IoIosReturnLeft className="text-[#b9bbbe] text-3xl rotate-[180deg]" />
                  {getImage(data.reply.userId).includes(typeImage) ? (
                    <img
                      lazy-src={getImage(data.reply.userId)}
                      alt=""
                      className="w-[20px] h-[20px] rounded-full cursor-pointer"
                    />
                  ) : (
                    <FaDiscord
                      style={{ background: getImage(data.reply.userId) }}
                      className="text-white  w-[20px] h-[20px] mt-[1px] p-[.2rem] rounded-full cursor-pointer"
                    />
                  )}
                  <span className="text-[#a3a69f] text-[14px] font-semibold">
                    {data.reply.name + " :"}
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
                            window.open(data.reply.urlFile, "_blank").focus()
                          }
                          className="text-[#d3d6fd] text-sm cursor-pointer"
                        >
                          Click to view image file
                        </div>
                        <div
                          onClick={() =>
                            window.open(data.reply.urlFile, "_blank").focus()
                          }
                        >
                          <AiFillPicture className="text-[#d3d6fd] text-sm mt-1 cursor-pointer" />
                        </div>
                      </div>
                    )}
                  {data.reply.typeFile &&
                    data.reply.typeFile.includes("audio") && (
                      <div className="flex gap-2">
                        <div
                          onClick={() =>
                            window.open(data.reply.urlFile, "_blank").focus()
                          }
                          className="text-[#d3d6fd] text-sm cursor-pointer"
                        >
                          Click to listen to the attachment
                        </div>
                        <div
                          onClick={() =>
                            window.open(data.reply.urlFile, "_blank").focus()
                          }
                        >
                          <FaFileAudio className="text-[#d3d6fd] text-sm mt-1 cursor-pointer" />
                        </div>
                      </div>
                    )}
                  {data.reply.typeFile &&
                    data.reply.typeFile.includes("video") && (
                      <div className="flex gap-2">
                        <div
                          onClick={() =>
                            window.open(data.reply.urlFile, "_blank").focus()
                          }
                          className="text-[#d3d6fd] text-sm  cursor-pointer"
                          href={data.reply.urlFile}
                          title=""
                        >
                          Click to view the video file
                        </div>
                        <div
                          onClick={() =>
                            window.open(data.reply.urlFile, "_blank").focus()
                          }
                        >
                          <FaFileVideo className="text-[#d3d6fd] text-sm mt-1 cursor-pointer" />
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
              <div className="group lg:mr-4 mr-0 gap-1 relative flex pt-2 ">
                <div className="group-hover:flex hidden  absolute top-0 right-0 bg-[#2f3136] shadow-md">
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
                      className="mb-2 bject-cover lg:w-[42px] lg:h-[42px] w-[36px]
                      h-[36px] rounded-full"
                      lazy-src={getImage(data.userId)}
                      alt=""
                    />
                  ) : (
                    <FaDiscord
                      style={{ background: getImage(data.userId) }}
                      className="my-2 text-white lg:w-[42px] w-[36px] lg:h-[42px] h-[36px] mt-[1px] p-[.5rem] rounded-full cursor-pointer"
                    />
                  )}
                </div>
                <div className="w-[85%] lg-w-[95%] max-h-[30rem]">
                  <div className="flex gap-2">
                    <span className="text-base text-[#fff]">{data.name}</span>

                    <span className="top-0 right-0 text-[10px] text-[#9ca69c]">
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

                    {data.typeFile && data.typeFile.includes("application") && (
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
              <div ref={messagesEndRef}></div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => handleSubmitMessage(e)}
          className={clsx(
            { "lg:rounded-b-lg": reply.name, "lg:rounded-lg": !reply.name },
            "lg:absolute rounded-top-lg h-12 fixed left-0 right-0 bottom-2  flex py-2  px-4 gap-3 bg-[#40444b] my-0 mt-0 lg:mt-2 mx-0 lg:mx-3 shadow-md"
          )}
        >
          {reply.name && (
            <div className="absolute top-[-100%] h-[48px] left-0 bottom-5 right-0 flex justify-between bg-[#31343a] rounded-t-lg px-3 py-2 shadow-[#ffffff35] shadow-sm">
              <span className="text-[#b0b2b5]">{`Responding to ${reply.name}`}</span>
              <FaTimesCircle
                onClick={() => setReply({})}
                className="text-[#b0b2b5] mt-[6px] cursor-pointer"
              />
            </div>
          )}
          <div className="w-[85%]">
            <div className="flex gap-2 ">
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
                placeholder={`Send message to ${user.nickname}`}
              />
            </div>
          </div>
          <div className="w-[15%]">
            <div className="flex gap-3 py-1 float-right mx-3">
              {/* <BsFillMicFill className="text-[#b9bbbe] lg:block hidden text-2xl cursor-pointer" />
              <FaGift className="text-[#b9bbbe] lg:block hidden text-2xl cursor-pointer" />
              <RiFileGifFill className="text-[#b9bbbe] lg:block hidden text-2xl cursor-pointer" />
              <div className="relative">
                <FaStickyNote className="text-[#b9bbbe] lg:block hidden text-2xl cursor-pointer rotate-[270deg]" />
              </div> */}
              <div className="relative">
                <FaSmileBeam
                  onClick={handleShowEmoij}
                  className={clsx(
                    { "text-[#ffb02e]": showEmoji },
                    " text-[#b9bbbe] text-2xl cursor-pointer"
                  )}
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
      </div>
    </div>
  );
};

export default React.memo(UserMessage);
