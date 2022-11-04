import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AiTwotoneSetting } from "react-icons/ai";
import clsx from "clsx";
import {
  BsCircleFill,
  BsDashCircleFill,
  BsFillMicFill,
  BsFillMicMuteFill,
  BsFillMoonFill,
  BsFillPencilFill,
  BsHeadphones,
  BsRecordCircleFill,
} from "react-icons/bs";
import { MdOutlineNavigateNext, MdLogout } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../service/CRUD";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal/modalDetailsUser";
import { typeImage } from "../../service/helper";

const BarInfo = ({ audio }) => {
  const dispatch = useDispatch();
  const sessionId = sessionStorage.getItem("sessionId");
  const { users, user } = useSelector((state) => state.users);
  const { room } = useSelector((state) => state.rooms);
  const { setChannel } = bindActionCreators(actionCreator, dispatch);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState([]);
  const [showOptionInfo, setShowOptionInfo] = useState(false);
  const [status, setStatus] = useState("");
  const [showModalUserDetail, setShowModalUserDetail] = useState(false);
  const optionInfoRef = useRef();
  const optionContainer = useRef();

  useLayoutEffect(() => {
    const results =
      users.length > 0 && users.find((user) => user.id === sessionId);
    setCurrentUser(results);
  }, [users]);

  useEffect(() => {
    const unListen = window.addEventListener("click", (e) => {
      const checkInBarInfo = e.composedPath().some((p) => p === optionInfoRef.current);
      const checkInContainer = e.composedPath().some(
        (p) => p === optionContainer.current
      );
      if (checkInContainer || checkInBarInfo) {
        setShowOptionInfo(true);
      } else {
        setShowOptionInfo(false);
      }
    });
    // Check sessionId
    if (!sessionId) {
      navigate("/signin");
    }
    return () => {
      window.removeEventListener("click", unListen);
    };
  }, [status]);

  //  handle Log out
  const handleLogout = () => {
    navigate("/signin");
    sessionStorage.removeItem("sessionId");
    updateUser({ ...currentUser, status: "offline" }, currentUser.id);
    setChannel({});
  };

  const handleChangeStatus = (value) => {
    setStatus(value);
    updateUser({ ...currentUser, status: value }, currentUser.id);
    setShowOptionInfo(false);
  };

  const handleShowInfoDetail = () => {
    setShowOptionInfo(false);
    setShowModalUserDetail(true);
  };
  return (
    <div
      className={clsx(
        { hidden: room.id || user.id },
        "lg:absolute fixed block  lg:block bottom-0  left-0 right-0 bg-[#292b2f] "
      )}
    >
      <div className="relative flex justify-between gap-2 py-1 px-2">
        <div className="w-full hover:bg-[#36393f] rounded-md">
          <div
            onClick={() => setShowOptionInfo(true)}
          ref={optionContainer} className="flex gap-2 cursor-pointer">
            <div 
            className="relative p-1 ">
              {currentUser.avatar && currentUser.avatar.includes(typeImage) && (
                <img
                  className="w-[37px] h-[37px] rounded-full cursor-pointer"
                  src={currentUser.avatar}
                  alt=""
                />
              )}
              {currentUser.avatar &&
                !currentUser.avatar.includes(typeImage) && (
                  <FaDiscord
                    style={{ background: currentUser.avatar }}
                    className=" text-white w-[36px] h-[36px] p-[.4rem] rounded-full cursor-pointer"
                  />
                )}

              {currentUser.status === "online" && (
                <BsCircleFill className="absolute bottom-[6px] right-[3px] text-[#3ba55d] bg-[#42464d] rounded-full text-sm p-[2px]" />
              )}
              {currentUser.status === "offline" && (
                <BsRecordCircleFill className="absolute bottom-[6px] right-[3px] text-[#747f8d] bg-[#42464d] rounded-full text-sm p-[2px]" />
              )}
              {currentUser.status === "busy" && (
                <BsDashCircleFill className="absolute bottom-[6px] right-[3px] text-[#ed4245] bg-[#42464d] rounded-full text-sm p-[2px]" />
              )}
              {currentUser.status === "sleep" && (
                <BsFillMoonFill className="rotate-[260deg] absolute bottom-[6px] right-[3px] text-[#faa81a] bg-[#42464d] rounded-full text-sm p-[2px]" />
              )}

              {showOptionInfo && (
                  <div
                    ref={optionInfoRef}
                    className="lg:absolute fixed z-[20]  left-0 right-0 lg:left-0  bottom-0 lg:right-0 lg:bottom-0  h-[50%] lg:top-[-15rem]  lg:h-[13.5rem] lg:w-[20rem]  shadow-md shadow-gray-800 "
                  >
                    <div className="relative h-[30%] lg:h-[3rem]">
                      <div
                        style={{
                          background: currentUser.avatar.includes(typeImage)
                            ? "#3d363f"
                            : currentUser.avatar,
                        }}
                        className="flex justify-end h-full lg:h-[60px]"
                      >
                        <BsFillPencilFill
                          onClick={handleShowInfoDetail}
                          className="lg:block hidden bg-black bg-opacity-30 text-white mt-3 mr-3 rounded-full cursor-pointer  text-2xl p-1 "
                        />
                      </div>

                      <div className="absolute top-[30%] lg:top-[1.2rem] left-[35%] lg:left-[1rem] ">
                        <div className="group relative">
                          {currentUser.avatar.includes(typeImage) ? (
                            <img
                              src={currentUser.avatar}
                              alt=""
                              className="border-[6px] border-[#18191c] text-white w-[7rem] h-[7rem] lg:w-[90px] lg:h-[90px] rounded-full cursor-pointer"
                            />
                          ) : (
                            <FaDiscord
                              style={{
                                background: currentUser.avatar.includes(
                                  typeImage
                                )
                                  ? "#3d363f"
                                  : currentUser.avatar,
                              }}
                              className="border-[6px] border-[#18191c] p-[1.5rem] text-white w-[8rem] h-[20%]  lg:w-[90px] lg:h-[90px] lg:p-[10px] rounded-full cursor-pointer"
                            />
                          )}

                          <div
                            onClick={handleShowInfoDetail}
                            className="group-hover:block hidden absolute top-0 left-0 right-0 bottom-0 cursor-pointer rounded-full bg-[#333] bg-opacity-60"
                          >
                            <span className="flex mt-3 justify-center text-[#fff] text-[10px] font-bold translate-y-6">
                              VIEW PROFILE
                            </span>
                          </div>
                        </div>

                        {currentUser.status === "online" && (
                          <BsCircleFill className="absolute bottom-[2px] right-[8px] w-[2.5rem] h-[2.5rem] lg:w-[20px] lg:h-[20px] text-[#3ba55d] bg-[#18191c] rounded-full lg:text-sm p-[.4rem] lg:p-[3px]" />
                        )}
                        {currentUser.status === "offline" && (
                          <BsRecordCircleFill className="absolute bottom-[2px] right-[8px] w-[2.5rem] h-[2.5rem] lg:w-[20px] lg:h-[20px] text-[#747f8d] bg-[#18191c] rounded-full lg:text-sm p-[.4rem] lg:p-[3px]" />
                        )}
                        {currentUser.status === "busy" && (
                          <BsDashCircleFill className="absolute bottom-[2px] right-[8px] w-[2.5rem] h-[2.5rem] lg:w-[20px] lg:h-[20px] text-[#ed4245] bg-[#18191c] rounded-full lg:text-sm p-[.4rem] lg:p-[3px]" />
                        )}
                        {currentUser.status === "sleep" && (
                          <BsFillMoonFill className="rotate-[260deg]  absolute bottom-[2px] right-[8px] w-[2.5rem] h-[2.5rem] lg:w-[20px] lg:h-[20px] text-[#faa81a] bg-[#18191c] rounded-full lg:text-sm p-[.4rem] lg:p-[3px]" />
                        )}
                      </div>
                    </div>

                    <div className="bg-[#18191c] h-[70%]  lg:h-auto pt-[35%] lg:pt-16 pb-2">
                      <div className="flex mx-4  overflow-hidden">
                        <span className="text-xl font-bold text-white ">
                          {currentUser.nickname.length > 10
                            ? currentUser.nickname.substring(0, 10) + "... "
                            : currentUser.nickname}
                        </span>
                        <span className="text-xl font-bold text-[#b9bbbe]">{`#${
                          currentUser && currentUser.uid
                        }`}</span>
                      </div>
                      <div className="flex border-b-[1px] border-[#32353b] mx-4"></div>

                      <div className="relative group flex mx-3 py-1 px-1 justify-between cursor-pointer hover:bg-[#4752c4]">
                        <div>
                          <div className="flex gap-2 ">
                            {currentUser.status === "offline" && (
                              <BsRecordCircleFill className="w-[18px] h-[18px] my-1 text-[#747f8d] rounded-full text-sm p-[3px]" />
                            )}
                            {currentUser.status === "online" && (
                              <BsCircleFill className="w-[18px] h-[18px] my-1 text-[#3ba55d] rounded-full text-sm p-[3px]" />
                            )}
                            {currentUser.status === "busy" && (
                              <BsDashCircleFill className="w-[18px] h-[18px] my-1 text-[#ed4245] rounded-full text-sm p-[3px]" />
                            )}
                            {currentUser.status === "sleep" && (
                              <BsFillMoonFill className="rotate-[260deg]  w-[18px] h-[18px] my-1 text-[#faa81a] rounded-full text-sm p-[3px]" />
                            )}

                            {currentUser.status === "online" && (
                              <span className="group-hover:text-white mt-[2px] text-[#B9BBBE] text-sm">
                                Online
                              </span>
                            )}
                            {currentUser.status === "offline" && (
                              <span className="group-hover:text-white mt-[2px] text-[#B9BBBE] text-sm">
                                Offline
                              </span>
                            )}
                            {currentUser.status === "busy" && (
                              <span className="group-hover:text-white mt-[2px] text-[#B9BBBE] text-sm">
                                Please don't disturb
                              </span>
                            )}
                            {currentUser.status === "sleep" && (
                              <span className="group-hover:text-white mt-[2px] text-[#B9BBBE] text-sm">
                                Sleep
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="hidden hover:block lg:absolute h-[28%] lg:h-[12rem] w-full group-hover:block fixed bottom-[12%] left-0 right-0  lg:top-[-200%] shadow-sm shadow-[#36393f]  lg:left-[100%] bg-[#18191c] p-2  rounded-md">
                          <div
                            onClick={() => handleChangeStatus("online")}
                            className="flex my-2 gap-2 hover:bg-[#4752c4] p-1 rounded-sm"
                          >
                            <BsCircleFill className="w-[16px] h-[16px] my-1 text-[#3ba55d] rounded-full text-sm p-[3px]" />
                            <span className=" text-gray-300">Online</span>
                          </div>
                          <div className="flex border-b-[1px] border-[#32353b] mx-1"></div>
                          <div
                            onClick={() => handleChangeStatus("sleep")}
                            className="flex my-2 gap-2 hover:bg-[#4752c4] p-1 rounded-sm"
                          >
                            <BsFillMoonFill className="rotate-[260deg] w-[18px] h-[16px] my-1 text-[#faa81a] rounded-full text-sm p-[3px]" />
                            <span className=" text-gray-300">Sleep</span>
                          </div>
                          <div
                            onClick={() => handleChangeStatus("busy")}
                            className="flex my-2 gap-2 hover:bg-[#4752c4] p-1 rounded-sm"
                          >
                            <BsDashCircleFill className="w-[18px] h-[16px] my-1 text-[#ed4245] rounded-full text-sm p-[3px]" />
                            <span className=" text-gray-300">
                              Please don't disturb
                            </span>
                          </div>
                          <div
                            onClick={() => handleChangeStatus("offline")}
                            className="flex my-2 gap-2 hover:bg-[#4752c4] p-1 rounded-sm"
                          >
                            <BsRecordCircleFill className="w-[18px] h-[16px] my-1 text-[#747f8d] rounded-full text-sm p-[3px]" />
                            <span className=" text-gray-300">Offline</span>
                          </div>
                        </div>
                        <MdOutlineNavigateNext className="group-hover:text-white text-[#B9BBBE] text-2xl" />
                      </div>

                      <div className="flex border-b-[1px] border-[#32353b] mx-4"></div>
                      <div
                        onClick={handleLogout}
                        className="group flex mx-3 py-1 px-1 gap-2 cursor-pointer hover:bg-[#4752c4]"
                      >
                        <MdLogout className="group-hover:text-white text-[#B9BBBE] text-base my-1" />
                        <span className="group-hover:text-white text-[#B9BBBE] text-sm">
                          Log out
                        </span>
                      </div>
                    </div>
                  </div>
              )}
            </div>
            <div className="overflow-hidden py-1">
              <div className="flex ">
                <span className="text-white text-sm ">
                  {currentUser.nickname}
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-400 text-xs">{`#${currentUser.uid}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModalUserDetail && (
        <Modal user={currentUser} setModal={setShowModalUserDetail} />
      )}
    </div>
  );
};

export default BarInfo;
