import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChannelList, ChatRoom, FriendList } from "../../components";


const Home = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const navigateFn = () => navigate("/channels/@me");
    window.addEventListener("load", navigateFn);
    
    return () => {
      window.removeEventListener("load", navigateFn);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex overflow-hidden h-screen select-none">
      <ChannelList />
      <FriendList />
      <ChatRoom />
    </div>
  );
};

export default Home;
