import clsx from 'clsx'
import React, { useMemo, useState } from 'react'
import { FaBars, FaUserFriends } from 'react-icons/fa'
import { TbMessagePlus } from 'react-icons/tb'
import { IoIosGitPullRequest, IoIosSave } from 'react-icons/io'
import {  BiHelpCircle } from 'react-icons/bi'
import { HiStatusOnline, HiUserAdd } from 'react-icons/hi'
// import { GoRequestChanges } from 'react-icons/go'
import AllFriends from './AllFriends'
import ListOnline from './ListOnline'
import Modal from '../Modal/modalAddFriends'
import Request from './Request'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreator } from '../../redux'

const ChatRoom = () => {
    const dispatch = useDispatch()
    const sessionId = sessionStorage.getItem("sessionId");
    const { setShowFriendListMobile } = bindActionCreators(actionCreator, dispatch)
    const { requests } = useSelector((state) => state.requests)
    const { showFriendListMobile } = useSelector((state) => state.is)
    const [onlineList , setOnlineList ] = useState(true)
    const [allList , setAllList ] = useState(false)
    const [ requestList , setRequestList ] = useState(false)
    const [ showModalAddFriends , setShowModalAddFriends ] = useState(false)

    const countRequest = useMemo(() => {
        return requests.filter(request => request.to === sessionId)?.length ?? 0
    },[requests, sessionId])


    const handleShowAllList = () => {
        setAllList(true)
        setOnlineList(false)
        setRequestList(false)
    } 

    const handleShowOnlineList = () => {
        setOnlineList(true)
        setAllList(false)
        setRequestList(false)
    }

    const handleShowRequestList = () => {
        setOnlineList(false)
        setAllList(false)
        setRequestList(true)
    }
  return (
    <div className={clsx({ "!translate-x-0 !opacity-100 w-[100%]" : showFriendListMobile },"lg:relative lg:w-[80%] lg:opacity-100 opacity-0 transition-all duration-500 lg:translate-x-0 fixed translate-x-[100%] bg-[#36393f]  h-screen")}>
      {showModalAddFriends && <Modal setModal={setShowModalAddFriends} />}
     
     <div className="flex w-full">
     <div className="lg:w-[75%] w-[100%] ">
     <div className="flex gap-1 lg:gap-2 w-full  h-[44px] shadow-md">
        <div onClick={() => setShowFriendListMobile(false)} className="lg:hidden block p-2">
            <FaBars className="text-white text-[22px] m-1" />
        </div>
        <div className="p-2 ">
            <div className="flex gap-3 px-2 py-1 rounded-md">
             <FaUserFriends className="lg:block hidden text-white text-[18px]" />
             <span className="lg:block hidden text-gray-300 cursor-default select-none text-sm">Friends</span>
        </div>
        </div>
        <div className="p-2">
        <div onClick={handleShowOnlineList} className={clsx({ "bg-[#42464d]" : onlineList } ," text-sm px-2 py-1  hover:bg-[#42464d] rounded-md")}>
            <span className="lg:block hidden text-gray-300 cursor-pointer ">Online</span>
            <HiStatusOnline className="lg:hidden block text-white text-[20px]" />
        </div>
        </div>
        <div className="p-2">
        <div onClick={handleShowAllList} className={clsx({ "bg-[#42464d]" : allList }," text-sm px-2 py-1  hover:bg-[#42464d] rounded-md")}>
            <span className="lg:block hidden text-gray-300 cursor-pointer ">All</span>
            <FaUserFriends className="lg:hidden block text-white text-[20px]" />
        </div>
        </div>
        <div className="p-2">
        <div onClick={handleShowRequestList} className={clsx({ "bg-[#42464d]" : requestList }, "text-sm px-2 py-1  hover:bg-[#42464d] rounded-md")}>
            <div className="flex gap-2">
            <span className="lg:block hidden text-gray-300 cursor-pointer ">Requests</span>
            <IoIosGitPullRequest  className="lg:hidden block text-white text-[20px]" />
            {countRequest > 0 && 
            <span className="text-[#fff] bg-[#ed4245] w-[18px] h-[18px] text-center text-xs mt-0 p-[1px] rounded-full">{countRequest}</span>
            }
            </div>
        </div>
        </div>
        {/* <div className="p-2">
        <div className=" text-sm px-2 py-1  hover:bg-[#42464d] rounded-md">
            <span className="lg:block hidden text-gray-300 cursor-pointer ">Đã chặn</span>
            <ImBlocked className="lg:hidden block text-white text-[15px]" />
        </div>
        </div> */}
        <div onClick={() => setShowModalAddFriends(true)} className="p-2">
        <div   className="text-sm lg:px-0 lg:py-0  px-2 py-1">
            <button className="lg:block hidden p-[2px]  bg-[#2d7d46] px-2 py-1  text-white  rounded-md cursor-pointer">Add friend</button>
            <HiUserAdd className="lg:hidden block text-white text-[20px]" />
        </div>
        </div>
     </div>
     {onlineList &&
       <ListOnline />
     }
     {allList &&
       <AllFriends />
     }
     {requestList && 
        <Request />
       }
    </div>
    <div className="lg:w-[25%] lg:block hidden bg-[#36393f]">
        <div className="p-[6px] shadow-md">
          <div className="flex gap-3 justify-end">
          <div  className="p-1 cursor-pointer">
             <TbMessagePlus className="text-gray-400 text-2xl"/>
        </div>
        <div className="p-1 cursor-pointer">
            <IoIosSave className="text-gray-400 text-2xl"/>
        </div>
        <div className="p-1 cursor-pointer">
            <BiHelpCircle className="text-gray-400 text-2xl"/>
        </div>
          </div>
        </div>

        <div className="p-4 border-l-[0.3px] border-[#41454c]  h-screen">
              <div className="flex">
                 <span className="text-lg font-bold text-white cursor-default select-none">Active</span>
              </div>

              <div className="flex px-6 justify-center mt-5 font-semibold">
                  <span className="text-white cursor-default select-none">There are currently no new updates...</span>
                  
              </div>
              <div className="flex px-6">
              <span className="text-gray-400 text-xs cursor-default select-none">
              If your friend has a new activity, like gaming or voice chat, we'll show it here!
                  </span>
              </div>
              
        </div>
     
     </div>
     </div>
    </div>
  )
}

export default ChatRoom