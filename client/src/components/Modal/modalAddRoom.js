import React, { useState } from "react";
import { AiFillSound, AiOutlineClose } from "react-icons/ai";
import { FaHashtag } from "react-icons/fa";
import {  useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { addRoom } from "../../service/CRUD";
import { serverTimestamp } from "firebase/firestore";

const Modal = ({ setModal }) => {
  const { channel } = useSelector((state) => state.channels);
  const [name, setName] = useState("");
  const [typeRoom, setTypeRoom] = useState(false);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if(name){
      const formData = {
        name,
        channelId: channel.id,
        type: typeRoom,
        timestamp: serverTimestamp(),
      };
      addRoom(formData);
      setModal(false);
    }else{
      toast.info("Please enter your room name" , { autoClose : 3000 , theme: "dark" })
    }
  };
  return (
    <>
      <div
        onClick={() => setModal(false)}
        className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] bg-opacity-50 !z-[51]"
      ></div>
      <ToastContainer 
      />
      <form
        onSubmit={handleSubmitForm}
        className="lg:absolute fixed z-[52] lg:top-[20%] top-0 left-0 bottom-0  lg:bottom-0 right-0 lg:left-[200%]  w-full lg:w-[440px] h-full lg:h-[10rem] lg:transparent bg-[#36393f] "
      >
        <div className="bg-[#36393f]  p-4">
          <div className="flex justify-between h-full">
            <span className="text-[20px] font-bold text-[#fff] ">
              {" "}
              Create room
            </span>
            <AiOutlineClose
              onClick={() => setModal(false)}
              className="text-xl text-[#B9BBBE] cursor-pointer hover:text-[#666]"
            />
          </div>
          <div className="gap-2  my-3 flex bg-[#444850] p-1">
            <FaHashtag className="text-[#B9BBBE]  text-xl my-6 w-[10%]" />
            <div className="w-[80%]">
              <span className="flex text-xl  text-[#fff]">Text</span>
              <span className="flex text-sm  text-[#B9BBBE]">
              Send messages, pictures, GIFs, emojis, comments, and puns
              </span>
            </div>
            <div className="w-[10%] py-8">
              <input
                onChange={() => setTypeRoom(!typeRoom)}
                checked={!typeRoom}
                type="radio"
                className="w-[24px] h-[24px] bg-[#000] text-[#fff]"
              />
            </div>
          </div>
          <div className="gap-2  my-3 flex bg-[#444850] p-1">
            <AiFillSound className="text-[#B9BBBE]  text-xl my-6 w-[10%]" />
            <div className="w-[80%]">
              <span className="flex text-xl  text-[#fff]">Voice</span>
              <span className="flex text-sm  text-[#B9BBBE]">
               Meet face to face by voice, video and screen sharing
              </span>
            </div>
            <div className="w-[10%] py-8">
              <input
                onChange={() => setTypeRoom(!typeRoom)}
                checked={typeRoom}
                type="radio"
                className="w-[24px] h-[24px] bg-[#000] text-[#fff]"
              />
            </div>
          </div>
          <span className="flex my-3 text-[#fff]">Room name</span>
          <div className="flex bg-[#202225] px-1 py-2">
            <FaHashtag className="text-[#B9BBBE] my-1 text-sm w-[10%]" />
            <input
              type=" text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="new-room"
              className="text-[#B9BBBE] bg-[#202225] outline-none w-full"
            />
          </div>
        </div>

        <div className="flex gap-5 bg-[#2f3136] lg:mt-0 mt-[48%] p-6 justify-end">
          <span onClick={() => setModal(false)} className="text-red-400 cursor-pointer py-2">
            Cancel
          </span>
          <button className="text-[#fff] bg-[#5865f2] py-2 px-4 rounded-md">
            Create room
          </button>
        </div>
      </form>
    </>
  );
};

export default Modal;
