import React, { useLayoutEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { BsCircleFill, BsDashCircleFill, BsFillMoonFill, BsRecordCircleFill, BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { typeImage } from "../../service/helper";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import {  ToastContainer } from "react-toastify";
import Modal from "../Modal/modalDetailsUser";
import { useRef } from "react";

const AllFriends = () => {
  const sessionId = sessionStorage.getItem("sessionId");
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { setUser } = bindActionCreators(actionCreator, dispatch)
  const { users , user }  = useSelector((state) => state.users);
  const currentUser = sessionId && users.find(user => user.id === sessionId)
  const [formSearch, setFormSearch] = useState("");
  const [ userFilter , setUserFilter] = useState([])
  const [ showModalDetailUser , setShowModalDetailUser ] = useState(false)
  const optionUserRef = useRef()
  
  useLayoutEffect(() => {
      const results = users && users.filter(user => currentUser.friends.includes(user.id))
      setUserFilter(results)
  },[users])


  const handleSelectUser = (e, user) => {
      setUser(user)
      navigate(`/channels/@me/${user.nickname}`);
  };


  return (
    <div className="p-3 px-6">
      <ToastContainer />
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
        <span className="text-gray-400 text-xs font-semibold">{`ALL FRIENDS - ${userFilter.length} `}</span>
      </div>
      {userFilter.length > 0 &&
        userFilter.map((user) => (
          <div  key={user.id} onClick={e => handleSelectUser(e,user)} className="flex justify-between p-3 rounded-lg border-t-[1px] border-[#41454c] hover:bg-[#41454c] cursor-pointer">
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative">
                  {user.avatar.includes(typeImage) ? 
                  <img src={user.avatar} alt="" className="w-[34px] h-[34px] rounded-full cursor-pointer" /> 
                  :
                  <FaDiscord
                    style={{ background: user.avatar }}
                    className=" text-white w-[33px] h-[33px] p-[6px] rounded-full cursor-pointer"
                  />
                }
                  {user.status === "online" && (
                    <BsCircleFill className="absolute bottom-0 right-[-3px] text-[#3ba55d] bg-[#36393f] rounded-full text-sm p-[3px]" />
                  )}
                  {user.status === "offline" && (
                    <BsRecordCircleFill className="absolute bottom-0 right-[-3px] text-[#747f8d] bg-[#36393f] rounded-full text-sm p-[3px]" />
                  )}
                  {user.status === "busy" && (
                    <BsDashCircleFill className="absolute bottom-0 right-[-3px] text-[#ed4245] bg-[#36393f] rounded-full text-sm p-[3px]" />
                  )}
                  {user.status === "sleep" && (
                    <BsFillMoonFill className="rotate-[260deg]  absolute bottom-0 right-[-3px] text-[#faa81a] bg-[#36393f] rounded-full text-sm p-[3px]" />
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
        {showModalDetailUser && <Modal user={user} setModal={setShowModalDetailUser} />}
    </div>
  );
};

export default AllFriends;
