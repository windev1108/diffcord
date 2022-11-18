import React, { useEffect, useRef, useState } from "react";
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from "react-icons/bs";
import { HiPhoneMissedCall } from "react-icons/hi";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { useDispatch, useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import clsx from "clsx";
import { AiFillSound } from "react-icons/ai";
import { CgLogOut } from "react-icons/cg";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const RoomStream = ({ userId }) => {
  const dispatch = useDispatch();
  const { setRoom } = bindActionCreators(actionCreator, dispatch);
  const { room } = useSelector((state) => state.rooms);
  const [camera, setCamera] = useState(true);
  const [micro, setMicro] = useState(true);
  const [isNavOption, setIsNavOption] = useState(false);
  const localTracksRef = useRef([]);
  const remoteUsersRef = useRef({});



  const joinAndDisplayLocalStream = async () => {
    client.on("user-published", handleUserJoined);

    client.on("user-left", handleUserLeft);

    let UID = await client.join(process.env.REACT_APP_APP_ID, process.env.REACT_APP_CHANNEL, process.env.REACT_APP_TOKEN, +userId);

    localTracksRef.current = await AgoraRTC.createMicrophoneAndCameraTracks();

    let player = `<div
      class="max-h-[100%]" id="user-container-${UID}">
       <div class="w-full h-full" id="user-${UID}"></div>
         </div>`;
    document
      .getElementById("video-streams")
      .insertAdjacentHTML("beforeend", player);

    localTracksRef.current[1].play(`user-${UID}`);

    await client.publish([
      localTracksRef.current[0],
      localTracksRef.current[1],
    ]);
  };

  const joinStream = async () => {
    await joinAndDisplayLocalStream();
  };
  const handleUserJoined = async (user, mediaType) => {
    remoteUsersRef.current[user.uid] = user;
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      let player = document.getElementById(`user-container-${user.uid}`);
      if (player != null) {
        player.remove();
      }

      player = `<div class="max-h-[100%]" id="user-container-${user.uid}">
                        <div class="w-full h-full" id="user-${user.uid}"></div> 
                 </div>`;
      document
        .getElementById("video-streams")
        .insertAdjacentHTML("beforeend", player);

      user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = async (user) => {
    delete remoteUsersRef.current[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();
  };

  const leaveAndRemoveLocalStream = async () => {
    for (let i = 0; localTracksRef.current.length > i; i++) {
      localTracksRef.current[i].stop();
      localTracksRef.current[i].close();
    }
    await client.leave();
    setRoom({});
  };

  const toggleMic = async (e) => {
    if (localTracksRef.current[0].muted) {
      await localTracksRef.current[0].setMuted(false);
      setMicro(true);
    } else {
      await localTracksRef.current[0].setMuted(true);
      setMicro(false);
    }
  };

  const toggleCamera = async (e) => {
    if (localTracksRef.current[1].muted) {
      await localTracksRef.current[1].setMuted(false);
      setCamera(true);
    } else {
      await localTracksRef.current[1].setMuted(true);
      setCamera(false);
    }
  };


  useEffect(() => {
    joinStream();
  }, []);

  return (
    <div className="group top-0 left-0 right-0 bottom-0 z-[60]  w-[100%] fixed transition-all  duration-500 lg:opacity-100  h-screen  bg-[#111]">
      <div
        onClick={() => setIsNavOption(!isNavOption)}
        className=" grid gap-2 grid-cols-[repeat(auto-fit,minmax(50%,_1fr))]  lg:grid-cols-[repeat(auto-fit,minmax(33.33%,_1fr))] my-0 mx-auto h-screen w-full"
        id="video-streams"
      ></div>

      <div
        className={clsx(
          { "opacity-100": isNavOption, "opacity-0": !isNavOption },
          "lg:group-hover:!opacity-100 z-30 transition-opacity duration-500 !lg:opacity-0 absolute  gap-2 flex top-0 left-0 right-0 h-[3rem] bg-[#111] bg-opacity-70"
        )}
      >
        <CgLogOut
          onClick={leaveAndRemoveLocalStream}
          className="lg:hidden block text-gray-300 ml-3 text-[2rem] my-2 bg-[#2f3136] rounded-full p-2 cursor-pointer"
        />
        <AiFillSound className="text-gray-300 ml-3 text-[1rem] my-4 rounded-full  cursor-pointer" />
        <span className="text-[#fff] my-3">{room.name}</span>
      </div>
      <div
        className={clsx(
          { "opacity-100": isNavOption, "opacity-0": !isNavOption },
          "lg:group-hover:!opacity-100 z-50 transition-opacity duration-500  !lg:opacity-0 absolute  justify-center gap-2 block lg:flex lg:right-0 lg:bottom-0 lg:left-0 right-1 lg:top-auto top-[36%]  h-[9rem] lg:h-[5rem] bg-transparent lg:bg-[#111]  lg:bg-opacity-60"
        )}
      >
        <div onClick={toggleCamera}>
          {camera ? (
            <BsFillCameraVideoFill className="text-gray-300  my-2 text-[4rem] bg-[#2f3136] rounded-full p-[1.3rem] cursor-pointer" />
          ) : (
            <BsFillCameraVideoOffFill className="text-gray-300  my-2 text-[4rem] bg-[#2f3136] rounded-full p-[1.3rem] cursor-pointer" />
          )}
        </div>
        <div onClick={toggleMic}>
          {micro ? (
            <BsFillMicFill className="text-gray-300  my-2 text-[4rem] bg-[#2f3136] rounded-full p-[1.3rem] cursor-pointer" />
          ) : (
            <BsFillMicMuteFill className="text-gray-300  my-2 text-[4rem] bg-[#2f3136] rounded-full p-[1.3rem] cursor-pointer" />
          )}
        </div>
        <HiPhoneMissedCall
          onClick={leaveAndRemoveLocalStream}
          className="text-gray-300  my-2 text-[4rem] bg-[#ed4245] rounded-full p-[1.3rem] cursor-pointer"
        />
      </div>
    </div>
  );
};

export default React.memo(RoomStream);
