import React, { useMemo, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { FaDiscord } from "react-icons/fa";
import { useSelector } from "react-redux";
import { typeImage } from "../../service/helper";
import svgImg from "../../assets/images/svg-img.svg";
import { deleteRequest, updateChannel, updateUser } from "../../service/CRUD";
import { toast } from "react-toastify";
import Notification from "../Notification";

function Request() {
  const sessionId = sessionStorage.getItem("sessionId");
  const { requests } = useSelector((state) => state.requests);
  const { users } = useSelector((state) => state.users);
  const { channels } = useSelector((state) => state.channels);
  const [formSearch, setFormSearch] = useState("");

  const requestFilter = useMemo(() => {
    return requests.filter(request => request.to === sessionId) ?? []
},[requests, sessionId])


  const getUser = (id) => {
    const user = users.find((user) => user.id === id);
    return user;
  };

  const getChannel = (id) => {
    const channel = channels.find((channel) => channel.id === id);
    return channel;
  };

  const handleAcceptRequest = (request) => {
    const userFrom = getUser(request.from);
    const userTo = getUser(request.to);
    const channel = getChannel(request.channelId) 
    if (request.action === "addFriend") {
      const formUserFrom = {
        friends: userFrom.friends.concat(userTo.id),
      };
      const formUserTo = {
        friends: userTo.friends.concat(userFrom.id),
      };
      updateUser(formUserFrom, userFrom.id);
      updateUser(formUserTo, userTo.id);
      deleteRequest(request.id);
      toast.success("Add friend success", {
        autoClose: 3000,
        theme: "dark",
      });
    } else if (request.action === "addChannel") {
      // do something
      const formUser = {
         channels : userTo.channels.concat(channel.channelId)
      }
      const formChannel = {
         members: channel.members.concat(userTo.id)
      }
      updateUser(formUser,userTo.id)
      updateChannel(formChannel,channel.id )
      deleteRequest(request.id);
      toast.success(`Welcome to ${channel.name}`, {
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  const handleCancelRequest = (request) => {
    deleteRequest(request.id);
    toast.success("Cancel request success", { autoClose: 3000, theme: "dark" });
  };
  return (
    <>
      <Notification />
      {requestFilter?.length > 0 ? (
        <div className="p-3 px-6">
          <div className="flex mx-2 justify-between bg-[#202225] rounded-sm">
            <input
              onChange={(e) => setFormSearch(e.target.value)}
              value={formSearch}
              type="text"
              className="px-2 w-full outline-none bg-transparent text-white"
              placeholder="Search"
            />
            <div className="p-[.35rem]">
              {!formSearch && (
                <BiSearch className="text-gray-400 text-xl cursor-pointer" />
              )}
              {formSearch && (
                <AiOutlineClose
                  onClick={() => setFormSearch("")}
                  className="text-gray-400 text-xl cursor-pointer"
                />
              )}
            </div>
          </div>

          <div className="flex my-4">
            <span className="text-gray-400 text-xs font-semibold">{`PENDING - ${requestFilter.length} `}</span>
          </div>
          {requestFilter.length > 0 &&
            requestFilter.map((request) => (
              <div
                key={request.id}
                className="group flex justify-between p-3 rounded-lg border-t-[1px] border-[#41454c] hover:bg-[#41454c] cursor-pointer"
              >
                <div>
                  <div className="flex gap-2">
                    <div className="relative">
                      {request.from === sessionId ? (
                        getUser(request.to).avatar.includes(typeImage) ? (
                          <img
                            src={getUser(request.to).avatar}
                            alt=""
                            className="w-[34px] h-[34px] rounded-full"
                          />
                        ) : (
                          <FaDiscord
                            style={{ background: getUser(request.to).avatar }}
                            className=" text-white w-[33px] h-[33px] p-[6px] rounded-full cursor-pointer"
                          />
                        )
                      ) : getUser(request.from).avatar.includes(typeImage) ? (
                        <img
                          src={getUser(request.from).avatar}
                          alt=""
                          className="w-[34px] h-[34px] rounded-full"
                        />
                      ) : (
                        <FaDiscord
                          style={{ background: getUser(request.from).avatar }}
                          className=" text-white w-[33px] h-[33px] p-[6px] rounded-full cursor-pointer"
                        />
                      )}
                    </div>
                    <div>
                      <span className="text-[#fff] text-xs font-bold flex">
                        {request.from === sessionId
                          ? getUser(request.to).nickname
                          : getUser(request.from).nickname}
                      </span>
                      <span className="text-[#B9BBBE] text-xs font-medium flex">
                        {request.action === "addFriend" &&
                          request.from === sessionId &&
                          "Friend request sent"}

                        {request.action === "addFriend" &&
                          request.to === sessionId &&
                          "Friend request received"}

                        {request.action === "addChannel" &&
                          request.from === sessionId &&
                          "Invitation to join the server sent" }

                        {request.action === "addChannel" &&
                          request.to === sessionId &&
                          `${getUser(request.from).nickname} invited you to join the server ${getChannel(request.channelId).name}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex gap-3">
                    {request.from !== sessionId && (
                      <AiOutlineCheck
                        onClick={() => handleAcceptRequest(request)}
                        className="text-[#b9bbbe] group-hover:bg-[#222] rounded-full bg-[#2f3136] hover:text-green-400 text-4xl p-2"
                      />
                    )}
                    <AiOutlineClose
                      onClick={() => handleCancelRequest(request)}
                      className="text-[#b9bbbe] group-hover:bg-[#222] rounded-full bg-[#2f3136] hover:text-red-500 text-4xl p-2"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="relative lg:top-[30%] top-[50%] left-[0%]  lg:left-[30%]">
          <div className="">
            <img className="object-cover" src={svgImg} alt="" />
          </div>
        </div>
      )}
    </>
  );
}

export default Request;
