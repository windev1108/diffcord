import React, {  useLayoutEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import {
  BsCircleFill,
  BsDashCircleFill,
  BsFillMoonFill,
  BsRecordCircleFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import svgImg from "../../assets/images/svg-img.svg";
import { actionCreator } from "../../redux";
import { typeImage } from "../../service/helper";

const ListOnline = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const sessionId = sessionStorage.getItem("sessionId");
  const { setUser } = bindActionCreators(actionCreator, dispatch)
  const { users } = useSelector((state) => state.users);
  const currentUser = sessionId && users.find(user => user.id === sessionId);
  const [formSearch, setFormSearch] = useState("");
  const [userFilter, setUsersilter] = useState([]);
  
  useLayoutEffect(() => {
    const results = users.filter(
      (user) => user.status !== "offline" && currentUser?.friends.includes(user.id)
    );
    setUsersilter(results);
  }, [users]);

  const handleSelectUser = (user) => {
    setUser(user)
    navigate(`/channels/@me/${user.nickname}`);
};

  return (
    <>
      {userFilter.length > 0 ? (
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
            <span className="text-gray-400 text-xs font-semibold">{`ONLINE - ${userFilter.length} `}</span>
          </div>
          {userFilter.length > 0 &&
            userFilter.map((user) => (
              <div
                onClick={() => handleSelectUser(user)}
                key={user.id}
                className="flex justify-between p-3 rounded-lg border-t-[1px] border-[#41454c] hover:bg-[#41454c] cursor-pointer"
              >
                <div>
                  <div className="flex gap-2">
                    <div className="relative">
                      {user.avatar.includes(typeImage) ?
                      <img src={user.avatar} alt="" className="w-[34px] h-[34px] rounded-full"/>  :
                      <FaDiscord
                        style={{ background: user.avatar.includes(typeImage) ? "#3d363f" : user.avatar }}
                        className=" text-white w-[33px] h-[33px] p-[6px] rounded-full cursor-pointer"
                      />
                      }
                      {user.status === "online" && (
                        <BsCircleFill className="absolute bottom-0 right-[-3px] text-[#3ba55d] bg-[#36393f] text-sm rounded-full p-[3px]" />
                      )}
                      {user.status === "offline" && (
                        <BsRecordCircleFill className="absolute bottom-0 right-[-3px] text-[#747f8d] bg-[#36393f] text-sm rounded-full p-[3px]" />
                      )}
                      {user.status === "busy" && (
                        <BsDashCircleFill className="absolute bottom-0 right-[-3px] text-[#ed4245] bg-[#36393f] text-sm rounded-full p-[3px]" />
                      )}
                      {user.status === "sleep" && (
                        <BsFillMoonFill className="rotate-[260deg]  absolute bottom-0 right-[-3px] text-[#faa81a] bg-[#36393f] text-sm rounded-full p-[3px]" />
                      )}
                    </div>
                    <div>
                      <span className="text-white flex text-sm font-bold">
                        {user.nickname}
                      </span>
                      <span className="text-[#B9BBBE] text-xs font-semibold flex">
                        {user.status === "online" && "Online"}
                        {user.status === "offline" && "Offline"}
                        {user.status === "busy" && "Please don't disturb"}
                        {user.status === "sleep" && "Sleep"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex gap-3">
                    <RiMessage2Fill className="text-[#b9bbbe] rounded-full bg-[#2f3136] text-4xl p-2" />
                    <BsThreeDotsVertical className="text-[#b9bbbe] rounded-full bg-[#2f3136] text-4xl p-2" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="relative lg:top-[30%] top-[50%] left-[0%]  lg:left-[30%]">
          <div className="">
            <img src={svgImg} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default ListOnline;
