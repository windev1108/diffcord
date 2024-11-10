import clsx from "clsx";
import React, { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreator } from "../../redux";
import { deleteChannel, updateChannel, updateUser } from "../../service/CRUD";

const ShowOptionChannel = (props, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionId = sessionStorage.getItem("sessionId");
  const { setChannel } = bindActionCreators(actionCreator, dispatch);
  const { channel, currentIdOption, setShowModalInvite } = props;
  const { users , authUser } = useSelector((state) => state.users);
  const { channels } = useSelector((state) => state.channels);
  const currentUser = users && users.find((user) => user.id === sessionId);
  const handleDeleteChanel = (channel) => {
    deleteChannel(channel.id);
    navigate("/channels/@me");
  };

  const handleLeaveChannel = (channel) => {
    const formChannel = {
      members: channel.members.replace(sessionId, ""),
    };
    const formUser = {
      channels: currentUser.channels.replace(channel.channelId, ""),
    };
    updateChannel(formChannel, channel.id);
    updateUser(formUser, currentUser.id);
  };
  //  handle  invite
  const handleInvite = () => {
    setShowModalInvite(true);
    setChannel(channel)
  };

  return (
    <div
      ref={ref}
      className={clsx(
        {
          block: currentIdOption === channel.id,
          hidden: currentIdOption !== channel.id,
        },
        "absolute rounded-md top-0 right-[-11rem] w-[10rem] bg-[#18191c] p-1 z-10 shadow-sm shadow-[#343333]"
      )}
    >
      <div
        onClick={handleInvite}
        className="text-center p-2 hover:text-white hover:bg-[#949CF7] text-sm font-semibold text-[#949CF7] border-b-[1px] border-[#32353b]  rounded-t-md cursor-pointer"
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
  );
};

export default forwardRef(ShowOptionChannel);
