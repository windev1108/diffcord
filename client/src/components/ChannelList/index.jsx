import React, { useEffect, useRef, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { AiOutlinePlus } from "react-icons/ai";
import ModalAddChannel from "../Modal/modalAddChannel";
import ModalInvite from "../Modal/modalInvite";
import ShowOptionChannel from "./showOptionChannel";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";


const ChannelList = () => {
  const sessionId = sessionStorage.getItem("sessionId");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setChannel, setRoom , setUser} = bindActionCreators(actionCreator, dispatch);
  const { channels } = useSelector((state) => state.channels);
  const { users } = useSelector((state) => state.users);
  const [showModalAddChannel, setShowModalAddChanel] = useState(false);
  const [showModalInvite, setShowModalInvite] = useState(false);
  const [curremtIdOption, setCurremtIdOption] = useState();
  const [ homeEvent , setHomeEvent] = useState(false);
  const containerOptionRef = useRef();
  const currentUser = users.find((user) => user.id === sessionId);
  const channelFilter =
    currentUser &&
    channels.filter((channel) => channel.members.includes(sessionId));

  useEffect(() => {
    const unListen = (e) => {
      const checkInBarInfo = e.composedPath().some(
        (p) => p === containerOptionRef.current
      );
      if (!checkInBarInfo) {
        setCurremtIdOption(null);
      }
    };
    window.addEventListener("click", unListen);
    return () => {
      window.removeEventListener("click", unListen);
    };
  }, [curremtIdOption]);

  // Handle show options channels\

  const handleSelectChannel = (channel) => {
    setCurremtIdOption(null); //left click
    setRoom({});
    setChannel(channel);
    navigate("/channels/" + channel.id);
    const roomMaster = users.find(u => u.id === channel.roomMaster )
    localStorage.setItem("roomMaster", JSON.stringify(roomMaster))
  }
  const handleShowOptionChannel = (e, id) => {
    if ( e.nativeEvent.button === 0){
      navigate("/channels/@me") 
    }else if ( e.nativeEvent.button === 2) {
      setCurremtIdOption(id); //right click
    }
  };

  const handleNavigateHome = () => {
    navigate("/channels/@me");
    setUser({})
  };
  const onMouseDown = () => {
      setHomeEvent(true)
  }
  const onMouseUp = () => {
    setHomeEvent(false)
}


  return (
    <div className="lg:w-[4.5%] w-[15%] lg:block lg:px-0 bg-[#202225]">
      <div className="my-0 mx-auto w-[45px] lg:w-[50px] h-[45px] lg:h-[50px] mt-3 ">
        <div className="group relative">
        <FaDiscord
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onClick={handleNavigateHome}
          className={clsx(
            {
              "rounded-2xl bg-[#5865f2]":
                window.location.pathname === "/channels/@me",
              "rounded-full bg-[#36393f]":
                window.location.pathname !== "/channels/@me",
              "translate-y-[1.5px]" : homeEvent
            },
            "hover:bg-[#5865f2] hover:rounded-2xl bg-[#5865f2] transition-all  text-white w-full h-full p-[.5rem] cursor-pointer"
          )}
        />
          <div className="group-hover:block hidden absolute right-[-11rem] top-[.30rem] bg-[#18191c]  z-30 py-2 px-3 rounded-md">
              <span className="text-[#dcddde] font-bold text-center">Direct messages</span>
          </div>
        </div>
      </div>
      <div className="my-0 mx-[18px] border-t-[1px] mt-3 border-gray-700"></div>
      {channelFilter &&
        channelFilter.map((channel) => (
          <div
            onClick={(e) => handleSelectChannel(channel)}
            onContextMenu={(e) => handleShowOptionChannel(e, channel.id)}
            key={channel.id}
            className="group relative my-0 mx-auto w-[46px] lg:w-[50px] h-[46px] lg:h-[50px] mt-3"
          >
            <img
              src={channel.photoUrl}
              alt={channel.name}
              className=" w-full h-full rounded-full hover:rounded-xl transition-all duration-200 cursor-pointer"
            />
              <div className="group-hover:block hidden absolute right-[-11rem] top-[.30rem] bg-[#18191c] text-center w-[10rem] z-10 py-2 px-3 rounded-md">
              <span className="text-[#dcddde] font-bold ">{channel.name}</span>
          </div>
            <ShowOptionChannel
              setShowModalInvite={setShowModalInvite}
              curremtIdOption={curremtIdOption}
              channel={channel}
              ref={containerOptionRef}
            />
            {showModalInvite && (
              <ModalInvite channel={channel} setModal={setShowModalInvite} />
            )}
          </div>
        ))}
      <div
        onClick={() => setShowModalAddChanel(true)}
        className="mt-2 my-0 mx-auto w-[45px] lg:w-[50px] text-center h-[45px] lg:h-[50px] bg-[#36393f] rounded-full hover:rounded-xl transition-all duration-200 cursor-pointer"
      >
        <button className="my-0 mx-auto">
          <AiOutlinePlus className="text-[#3ba55d] text-xl lg:my-4 my-3 " />
        </button>
      </div>
      {showModalAddChannel && (
        <ModalAddChannel setModal={setShowModalAddChanel} />
      )}
    </div>
  );
};

export default ChannelList;
