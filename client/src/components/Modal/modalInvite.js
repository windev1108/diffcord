import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AiOutlineClose } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addRequest} from "../../service/CRUD";
import { typeImage } from "../../service/helper";
import { serverTimestamp } from "firebase/firestore";
import clsx from "clsx";

const Modal = ({ setModal }) => {
  const sessionId = sessionStorage.getItem("sessionId");
  const { users } = useSelector((state) => state.users);
  const { channels, channel } = useSelector((state) => state.channels);
  const { requests } = useSelector((state) => state.requests);
  const currentUser = users.find((user) => user.id === sessionId);
  const [userFilter, setUserFilter] = useState([]);
  const [myRequest, setMyRequest] = useState([]);

  useEffect(() => {
    const results = requests.filter((request) => request.from === sessionId);
    setMyRequest(results);
  }, [requests]);


  useEffect(() => {
    const results = users.filter(
      (user) =>
        currentUser.friends.includes(user.id) &&
        !user.channels.includes(channel.channelId) &&  user.id !== channel.roomMaster
    );
    setUserFilter(results);
  }, [users, channels]);

  const handleSendRequest = (user) => {
    const formRequest = {
      action: "addChannel",
      channelId : channel.id,
      from: sessionId,
      to: user.id,
      timestamp: serverTimestamp(),
    };

    addRequest(formRequest);
  };

  return (
    <>
      <div
        onClick={() => setModal(false)}
        className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] bg-opacity-50 z-20"
      ></div>
      <ToastContainer />

      <div className="fixed z-[53] lg:top-[25%] lg:left-[35%] top-0 bottom-0 right-0 left-0 w-full lg:w-[440px] p-4 bg-[#36393f] h-full lg:h-[30rem]">
        <div className="flex justify-between w-full">
          <span className="text-[16px] font-semibold text-[#fff]">{`Invite your friends to ${channel.name}`}</span>
          <AiOutlineClose
            onClick={() => setModal(false)}
            className="text-xl text-[#9a9c9f] cursor-pointer"
          />
        </div>

        <div className="flex justify-between px-3 py-1 w-full bg-[#202225] my-4 rounded-md">
          <input
            type="text"
            placeholder="Looking for friends"
            className="bg-transparent w-full outline-none text-sm text-[#fff]"
          />
          <FiSearch className="text-[#e4e4e4]  my-1" />
        </div>
        <div className="border-t-[1px] border-[#28292e] p-2 overflow-y-scroll h-[30rem]">
          {userFilter.length > 0 &&
            userFilter.map((user) => (
              <div
                key={user.id}
                className=" hover:bg-[#3e4148] flex justify-between p-2 cursor-pointer"
              >
                <div className="">
                  <div className="flex gap-2">
                    {user.avatar.includes(typeImage) ? (
                      <img
                        className="w-[40px] h-[40px] rounded-full "
                        src={user.avatar}
                        alt=""
                      />
                    ) : (
                      <FaDiscord
                        style={{ backgroundColor: user.avatar }}
                        className="text-white w-[40px] h-[40px] p-[.5rem] rounded-full cursor-pointer"
                      />
                    )}
                    <span className="text-[#fff] my-2">{user.nickname}</span>
                  </div>
                </div>
                <div>
                  <button
                   disabled={
                    myRequest.some((request) => request.to === user.id)
                      ? true
                      : false
                  }
                    onClick={() => handleSendRequest(user)}
                    className={clsx({ "opacity-70 !cursor-not-allowed hover:bg-transparent" : myRequest.some((request) => request.to === user.id) },"text-[#fff] mt-1 border-[1px] border-[#3ba55d] hover:bg-[#3ba55d] px-[16px] py-[2px]")}
                  >
                    {myRequest.some((request) => request.to === user.id)
                      ? "Invitation sent"
                      : "Invite"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Modal;

Modal.propTypes = {
  channel: PropTypes.object,
};
