import clsx from "clsx";
import React, { memo, useEffect, useRef, useState } from "react";
import RoomMessage from "../RoomMessage";
import RoomStream from "../RoomStream";
import { BsChevronDown, BsChevronUp, BsPlusLg } from "react-icons/bs";
import { FaHashtag } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import {
  deleteChannel,
  deleteRoom,
  updateChannel,
  updateUser,
} from "../../service/CRUD";
import ModalAddRoom from "../Modal/modalAddRoom";
import BarInfo from "../BarInfo";
import { toast } from "react-toastify";
import Notification from "../Notification";
import { AiFillSound, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ModalInvite from "../Modal/modalInvite";
import ModalDetailsChannel from "../Modal/modalDetailsChannel";

const RoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionId = sessionStorage.getItem("sessionId");
  const { setRoom, setChannel } = bindActionCreators(actionCreator, dispatch);
  const { users } = useSelector((state) => state.users);
  const { rooms, room } = useSelector((state) => state.rooms);
  const { channel } = useSelector((state) => state.channels);
  const currentUser = users.find((u) => u.id === sessionId);
  const [showModalAddRoom, setShowModalAddRoom] = useState(false);
  const [roomText, setRoomText] = useState([]);
  const [roomVoice, setRoomVoice] = useState([]);
  const [currentRoomOption, setCurrentRoomOption] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [audio, setAudio] = useState(false);
  const [showRoomTextList, setShowRoomTextList] = useState(true);
  const [showRoomVoiceList, setShowRoomVoiceList] = useState(true);
  const [showModalOptionChannel, setShowModalOptionChannel] = useState(false);
  const [showModalInvite, setShowModalInvite] = useState(false);
  const [showModalSettingChannel, setShowModalSettingChannel] = useState(false);
  const roomOptionRef = useRef();
  const clientRef = useRef();

  useEffect(() => {
    if (channel.id) {
      const roomTextFilter =
        channel.id &&
        rooms.filter((room) => room.channelId === channel.id && !room.type);
      const roomVoiceFilter =
        channel.id &&
        rooms.filter((room) => room.channelId === channel.id && room.type);
      setRoomText(roomTextFilter);
      setRoomVoice(roomVoiceFilter);
    }
  }, [channel, rooms, channel]);

  useEffect(() => {
    const unListen = window.addEventListener("click", (e) => {
      const checkInBarInfo = e.composedPath().some((p) => p === roomOptionRef.current);
      if (!checkInBarInfo) {
        setCurrentRoomOption(null);
      }
    });
    return () => {
      window.removeEventListener("click", unListen);
    };
  }, [currentRoomOption]);

  const handleShowOptionRoomText = (e, room) => {
    if (e.nativeEvent.button === 0) {
      setCurrentRoom(room.id);
      setRoom(room)
    } else if (e.nativeEvent.button === 2) {
      setCurrentRoomOption(room.id); //right click
      setCurrentRoom(room.id);
    }
  };

  const handleDeleteRoom = (id) => {
    deleteRoom(id);
    setRoom({});
    console.log("====================================");
    console.log("room :", room);
    console.log("====================================");
    toast.success("Delete room success", { autoClose: 3000, theme: "dark" });
  };

  const handleDeleteChanel = (channel) => {
    deleteChannel(channel.id);
    navigate("/channels/@me");
  };

  const handleLeaveChannel = (channel) => {
    const formChannel = {
      ...channel,
      members: channel.members.replace(sessionId, ""),
    };
    const formUser = {
      ...currentUser,
      channels: currentUser.channels.replace(channel.channelId, ""),
    };
    navigate("/channels/@me");
    updateChannel(formChannel, channel.id);
    updateUser(formUser, currentUser.id);
  };

  //  handle  invite
  const handleInvite = () => {
    setShowModalOptionChannel(false);
    setShowModalInvite(true);
    setChannel(channel);
  };

  const handleSettingChannel = () => {
    setShowModalOptionChannel(false);
    setShowModalSettingChannel(true);
    setChannel(channel);
  };

  return (
    <div className="w-[85%] lg:w-[95.5%] overflow-hidden">
      <div className="flex">
        <div className="relative lg:w-[16.2%] w-[100%] h-screen bg-[#2f3136]">
          <Notification />
          {showModalInvite && <ModalInvite setModal={setShowModalInvite} />}
          {showModalAddRoom && <ModalAddRoom setModal={setShowModalAddRoom} />}
          {showModalSettingChannel && (
            <ModalDetailsChannel setModal={setShowModalSettingChannel} />
          )}
          <div className="relative flex justify-between p-[.68rem] shadow-md h-[44px]">
            <span className="font-bold text-[#fff]">
              {channel.id && channel.name.length > 20
                ? channel.name.substr(0, 20) + "..."
                : channel.name}
            </span>

            {showModalOptionChannel ? (
              <AiOutlineClose
                onClick={() => setShowModalOptionChannel(false)}
                className="text-[#d5d5d6] transition-all duration-500 text-lg m-1 cursor-pointer"
              />
            ) : (
              <BsChevronDown
                onClick={() => setShowModalOptionChannel(true)}
                className="text-[#d5d5d6] text-lg m-1 cursor-pointer"
              />
            )}
            <div
              className={clsx(
                {
                  "opacity-100 scale-100 z-30": showModalOptionChannel,
                  "opacity-0 scale-0 z-0": !showModalOptionChannel,
                },
                "absolute top-[100%] transition-all duration-500 right-0 left-0  w-full bg-[#18191c] p-1 shadow-sm shadow-[#343333]"
              )}
            >
              {channel.roomMaster === sessionId && (
                <div
                  onClick={handleSettingChannel}
                  className="text-center p-2 hover:text-white hover:bg-[#949CF7] text-sm font-semibold text-[#949CF7] border-b-[1px] border-[#32353b]  rounded-t-md cursor-pointer"
                >
                  Channel settings
                </div>
              )}
              <div
                onClick={handleInvite}
                className={clsx(
                  { "rounded-t-md": channel.roomMaster !== sessionId },
                  "text-center p-2 hover:text-white hover:bg-[#949CF7] text-sm font-semibold text-[#949CF7] border-b-[1px] border-[#32353b]  cursor-pointer"
                )}
              >
                Invite everyone
              </div>

              {channel.roomMaster === sessionId ? (
                <div
                  onClick={() => handleDeleteChanel(channel)}
                  className="text-center p-2 mt-1 hover:text-white hover:bg-[#ED4245] text-sm font-semibold text-[#ED4245] rounded-b-md cursor-pointer"
                >
                  Delete channel
                </div>
              ) : (
                <div
                  onClick={() => handleLeaveChannel(channel)}
                  className="text-center p-2 mt-1 hover:text-white hover:bg-[#ED4245] text-sm font-semibold text-[#ED4245] rounded-b-md cursor-pointer"
                >
                  Leave channel
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between m-3">
            <div className="flex">
              <BsChevronUp
                onClick={() => setShowRoomTextList(!showRoomTextList)}
                className={clsx(
                  { "rotate-[180deg]": showRoomTextList },
                  "text-[#d5d5d6] transition-all duration-500 text-sm  cursor-pointer m-1"
                )}
              />
              <span className="text-[#d5d5d6] text-sm font-semibold">
                ROOM CHAT
              </span>
            </div>
            <BsPlusLg
              onClick={() => setShowModalAddRoom(true)}
              className="text-[#d5d5d6] text-sm m-1 cursor-pointer"
            />
          </div>
          <div
            className={clsx({
              "hidden h-0 transition-all duration-500": !showRoomTextList,
            })}
          >
            {roomText.map((room) => (
              <div
                onClick={(e) => handleShowOptionRoomText(e, room)}
                onContextMenu={(e) => handleShowOptionRoomText(e, room)}
                key={room.id}
                className={clsx(
                  { "bg-[#42464d]": currentRoom === room.id },
                  "relative flex m-3 p-[.3rem] cursor-pointer  rounded-md"
                )}
              >
                <FaHashtag className="text-sm text-[#8e9297] m-[5px]" />
                <span className="text-[#fff]">{room.name}</span>
                {currentRoomOption === room.id &&
                  channel.roomMaster === sessionId && (
                    <div
                      ref={roomOptionRef}
                      className="group hover:bg-[#ED4245] absolute top-2 right-[3rem] bg-[#18191c] p-2 z-10 cursor-pointer rounded-md"
                    >
                      <span
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-center p-2 mt-1 group-hover:text-white group-hover:bg-[#ED4245] text-sm font-semibold text-[#ED4245] cursor-pointer"
                      >
                        Delete room
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
          <div className="flex justify-between m-3">
            <div className="flex">
              <BsChevronUp
                onClick={() => setShowRoomVoiceList(!showRoomVoiceList)}
                className={clsx(
                  { "rotate-[180deg]": showRoomVoiceList },
                  "transition-all duration-500 text-[#d5d5d6] text-sm  cursor-pointer m-1"
                )}
              />
              <span className="text-[#d5d5d6] text-sm font-semibold">
                ROOM MEET
              </span>
            </div>
            <BsPlusLg
              onClick={() => setShowModalAddRoom(true)}
              className="text-[#d5d5d6] text-sm m-1 cursor-pointer"
            />
          </div>

          <div className={clsx({ hidden: !showRoomVoiceList })}>
            {roomVoice.map((room) => (
              <div
                onClick={(e) => handleShowOptionRoomText(e, room)}
                onContextMenu={(e) => handleShowOptionRoomText(e, room)}
                key={room.id}
                className={clsx(
                  { "bg-[#42464d]": currentRoom === room.id },
                  "relative flex m-3 p-[.3rem] cursor-pointer  rounded-md"
                )}
              >
                <AiFillSound className="text-sm text-[#8e9297] m-[5px]" />
                <span className="text-[#fff]">{room.name}</span>
                {currentRoomOption === room.id &&
                  channel.roomMaster === sessionId && (
                    <div
                      ref={roomOptionRef}
                      className="group hover:bg-[#ED4245] absolute top-2 right-[3rem] bg-[#18191c] p-2 z-10 cursor-pointer rounded-md"
                    >
                      <span
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-center p-2 mt-1 group-hover:text-white group-hover:bg-[#ED4245] text-sm font-semibold text-[#ED4245] cursor-pointer"
                      >
                        Delete room
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>

          <BarInfo audio={audio} setAudio={setAudio} />
        </div>
        {room.type ? (
          <RoomStream userId={sessionId} client={clientRef.current} />
        ) : (
          <RoomMessage />
        )}
      </div>
    </div>
  );
};

export default memo(RoomList);
