import clsx from "clsx";
import React, { useEffect, useState, useRef , memo, useMemo} from "react";
import {
  BsCircleFill,
  BsDashCircleFill,
  BsFillMoonFill,
  BsPlusLg,
  BsRecordCircleFill,
} from "react-icons/bs";
import { FaUserFriends, FaDiscord } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { updateUser } from "../../service/CRUD";
import { typeImage } from "../../service/helper";
import BarInfo from "../BarInfo";
import Modal from "../Modal/modalDetailsUser";

const FriendList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionId = sessionStorage.getItem("sessionId");
  const { setUser } = bindActionCreators(actionCreator, dispatch);
  const { setShowFriendListMobile } = bindActionCreators(actionCreator, dispatch);
  const { users, user } = useSelector((state) => state.users);
  const { requests} = useSelector((state) => state.requests);
  const currentUser = sessionId && users.find((user) => user.id === sessionId);
  const [usersFilter, setUserFilter] = useState([]);
  const [currentUserActive, setCurrentUserActive] = useState(null);
  const [currentUserOption, setCurremtUserOption] = useState(null);
  const [showModalDetailUser, setShowModalDetailUser] = useState(false);
  const [ myRequest , setMyRequest ] = useState(0)
  const optionUserRef = useRef();

  useMemo(() => {
    const results = requests.filter(request => request.to === sessionId)
    setMyRequest(results.length) 
},[requests])


  useEffect(() => {
    const unListen = (e) => {
      const checkContainer = e.composedPath().some((p) => p === optionUserRef.current);
      if (!checkContainer) {
        setCurremtUserOption(null);
      }
    };
    window.addEventListener("click", unListen);
    return () => {
      window.removeEventListener("click", unListen);
    };
  }, [currentUserOption]);

  useEffect(() => {
    const results =
      users && users.filter((user) => currentUser?.friends.includes(user.id));
    setUserFilter(results);
  }, [users]);

  const handleSelectUser = (e, user) => {
    if (e.nativeEvent.button === 0) {
      setUser(user);
      navigate(`/channels/@me/${user.nickname}`);
      setCurrentUserActive(user.id);
    } else if (e.nativeEvent.button === 2) {
      setCurremtUserOption(user.id);
    }
  };

  const handleShowInfoDetail = async (user) => {
    setUser(user);
    setShowModalDetailUser(true);
    setCurremtUserOption(null);
  };

  const handleDeleteFriend = (user) => {
    const formUser1 = {
      ...user,
      friends: user.friends.replace(currentUser.id, ""),
    };
    const formUser2 = {
      ...currentUser,
      friends: currentUser.friends.replace(user.id, ""),
    };
    updateUser(formUser1, user.id);
    updateUser(formUser2, currentUser.id);
    toast.success("Unfriend success", { autoClose: 3000, theme: "dark" });
  };

  const showListFriends = () => {
      setShowFriendListMobile(true)
  }
  return (
    <div className="lg:w-[15.5%] lg:block w-[85%] relative h-screen bg-[#2f3136]">
      {showModalDetailUser && (
        <Modal user={user} setModal={setShowModalDetailUser} />
      )}
      <ToastContainer 
      />
      <div className=" flex p-1 h-[44px] shadow-md">
        <input
          className="p-2 bg-[#202225] w-full rounded-md text-white outline-none text-xs"
          type="text"
          placeholder="Find or start a conversation"
        />
      </div>
      <div className="p-3">
        <div onClick={showListFriends} className="cursor-pointer flex gap-3 py-2 px-5 rounded-md bg-[#42464d]">
          <FaUserFriends className="text-white text-[18px]" />
          <span className="text-white text-sm font-medium ">Friends</span>
          {myRequest > 0 && 
            <span className="text-[#fff] bg-[#ed4245] w-[18px] h-[18px] text-center text-xs mt-0 p-[1px] rounded-full">{myRequest}</span>
            }
        </div>
        <div className="flex justify-between my-4 mx-2">
          <span className="text-gray-400 font-semibold text-xs hover:text-white cursor-default">
            DIRECT MESSAGES
          </span>
          <BsPlusLg className="text-gray-300 text-sm" />
        </div>

        <div>
          {usersFilter &&
            usersFilter.map((user) => (
              <div
                onClick={(e) => handleSelectUser(e, user)}
                onContextMenu={(e) => handleSelectUser(e, user)}
                key={user.id}
                className={clsx(
                  { "bg-[#42464d]": currentUserActive === user.id },
                  "relative flex gap-2 p-2 my-1 cursor-pointer hover:bg-[#42464d] rounded-md h-[50px]"
                )}
              >
                {currentUserOption === user.id && (
                  <div
                    ref={optionUserRef}
                    className="absolute top-0 right-[-1rem] bg-[#18191c] w-[12rem] p-1 z-10 rounded-md shadow-md"
                  >
                    <div
                      onClick={() => handleShowInfoDetail(user)}
                      className="hover:bg-[#4752c4] hover:text-[#fff] rounded-t-md flex text-[#a1a3a6] font-semibold p-2"
                    >
                      Profile
                    </div>
                    <div
                      onClick={() => handleDeleteFriend(user)}
                      className="hover:bg-[#d83c3e] hover:text-[#fff] rounded-b-md flex text-[#d83c3e] font-semibold p-2"
                    >
                      Unfriend
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                <div className="relative">
                  {user.avatar.includes(typeImage) ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-[34px] h-[34px] rounded-full"
                    />
                  ) : (
                    <FaDiscord
                      style={{
                        background: user.avatar.includes(typeImage)
                          ? "#3d363f"
                          : user.avatar,
                      }}
                      className="text-white w-[33px] h-[33px] p-[6px] rounded-full"
                    />
                  )}
                  {user.status === "online" && (
                    <BsCircleFill className="bottom-[-2px] absolute right-[-1px] text-[#3ba55d] bg-[#36393f] rounded-full text-sm p-[3px]" />
                  )}
                  {user.status === "offline" && (
                    <BsRecordCircleFill className="bottom-[-2px] absolute right-[-1px] text-[#747f8d] bg-[#36393f] rounded-full text-sm p-[3px]" />
                  )}
                  {user.status === "busy" && (
                    <BsDashCircleFill className="bottom-[-2px] absolute right-[-1px] text-[#ed4245] bg-[#36393f] rounded-full text-sm p-[3px]" />
                  )}
                  {user.status === "sleep" && (
                    <BsFillMoonFill className="bottom-[-2px] rotate-[260deg] absolute right-[-1px] text-[#faa81a] bg-[#36393f] rounded-full text-sm p-[3px]" />
                  )}
                </div>
                </div>
                <div className="relative">
                <span className={clsx({"mt-[6px]" : !user.note  } ,"flex text-[#96989d]")} >{user.nickname}</span> 
                {user.note && <div className="flex translate-y-[-4px]  text-xs font-semibold text-[#96989d]">{user.note.length > 28 ? user.note.substring(0, 28) + "..." : user.note}</div>}
                </div>
              </div>
            ))}
        </div>
      </div>
      <BarInfo />
    </div>
  );
};

export default memo(FriendList);
