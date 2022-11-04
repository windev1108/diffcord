import { Progress } from 'antd'
import React , { memo } from 'react'
import { FaFile, FaTimes } from 'react-icons/fa'

const LoadingFile = ({ percent }) => {


  return (
    <div className="mx-12 flex gap-1 w-[50%] mb-5 bg-[#2f3136] p-1 py-2">
    <FaFile className="text-[#d3d6fd] text-4xl mt-1 cursor-pointer w-[10%]" />
    <div className="w-[80%]">
        <span className="flex w-full text-[#fff]">
            Đang xử lý...
        </span>
        <div className="flex w-full">
        <Progress
         showInfo={false}
         strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
         percent={percent}  className="z-50 w-full bg-[#40444b]" />
        </div>
    </div>
    <FaTimes className="w-[10%] text-[#a3a69f] text-sm mt-1 cursor-pointer" />
</div>
  )
}

export default memo(LoadingFile)