import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";



const LoadingOverlay = ({ visible = false }) => {
  if(!visible) return null
  return (
    <div className="bg-black/50 absolute inset-0 z-[99999999] flex items-center justify-center">
    <AiOutlineLoading3Quarters  className="text-white animate-spin duration-1000 ease-linear" size={30} />
  </div>
  );
};

export default LoadingOverlay;
