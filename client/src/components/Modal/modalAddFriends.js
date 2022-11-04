import clsx from "clsx";
import { serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState, memo } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addRequest } from "../../service/CRUD";
import { typeImage } from "../../service/helper";

const Modal = ({ setModal }) => {
  const sessionId = sessionStorage.getItem("sessionId");
  const { users } = useSelector((state) => state.users);
  const { requests } = useSelector((state) => state.requests);
  const [myRequest, setMyRequest] = useState([]);
  const [formSearch, setFormSearch] = useState("");
  const [userFilter, setUserFilter] = useState([]);

  useEffect(() => {
    const results = users.filter(
      (user) => 
        user.id !== sessionId &&
        user.nickname.match(formSearch) &&
        !user.friends.includes(sessionId)
    );
    setUserFilter(results);
  }, [formSearch]);

  useEffect(() => {
    const results = users.filter(
      (user) => !user.friends.includes(sessionId) && user.id !== sessionId
    );
    setUserFilter(results);
  }, [users]);

  useEffect(() => {
    const results = requests.filter((request) => request.from === sessionId);
    setMyRequest(results);
  }, [requests]);

  const handleSendRequest = (user) => {
    const formRequest = {
      action: "addFriend",
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
        className="fixed z-[60] top-0 left-[-30%] bottom-0 right-0 bg-[#080809] bg-opacity-50"
      ></div>
      <ToastContainer />

      <div className="absolute lg:top-[20%] lg:bottom-0 w-full lg:left-[20%] top-0 left-0 right-0 bottom-0 z-[61]  lg:w-[440px] p-4 bg-[#36393f] h-full lg:h-[30rem]">
        <div className="flex justify-between">
          <span className="text-[16px] font-semibold text-[#fff]">
            People you may know
          </span>
          <AiOutlineClose
            onClick={() => setModal(false)}
            className="text-xl text-[#9a9c9f] cursor-pointer"
          />
        </div>

        <div className="flex justify-between px-3 py-1 w-full bg-[#202225] my-4 rounded-md">
          <input
            onChange={(e) => setFormSearch(e.target.value)}
            value={formSearch}
            type="text"
            placeholder="Looking for friends"
            className="bg-transparent w-full outline-none text-sm text-[#fff]"
          />
          <FiSearch className="text-[#e4e4e4]  my-1" />
        </div>
        <div className="border-t-[1px] border-[#28292e] p-2 overflow-y-scroll h-[80%]">
          {userFilter.length === 0  ? (
            <span className="text-[#fff]">{`Không tìm thấy '${formSearch}'`}</span>
          ) : userFilter.length > 0 ? (
            userFilter.map((user) => (
              <div
                key={user.id}
                className=" hover:bg-[#3e4148] flex justify-between px-2 py-1 cursor-pointer "
              >
                <div className="">
                  <div className="flex gap-2">
                    {user.avatar.includes(typeImage) ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-[34px] h-[34px] my-1 rounded-full cursor-pointer"
                      />
                    ) : (
                      <FaDiscord
                        style={{ backgroundColor: user.avatar }}
                        className="text-white w-[33px] h-[33px] p-[.4rem] my-1 rounded-full cursor-pointer"
                      />
                    )}
                    <div>
                      <span className="text-[#fff] text-base flex">
                        {user.nickname}
                      </span>
                      <span className="text-[#B9BBBE] text-[12px] flex ">{`#${user.uid}`}</span>
                    </div>
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
                    className={clsx(
                      {
                        "opacity-50 cursor-not-allowed hover:bg-transparent":
                          myRequest.some((request) => request.to === user.id),
                      },
                      "text-[#fff] my-2 border-[1px] border-[#3ba55d] hover:bg-[#3ba55d] px-[16px] py-[2px]"
                    )}
                  >
                    {myRequest.some((request) => request.to === user.id)
                      ? "Friend request sent "
                      : "Add friend"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <span className="text-[#999]">No other users found
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Modal);
