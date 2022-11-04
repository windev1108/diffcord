import React, {  memo,  } from 'react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

const EmojsPicker = ({ setEmoji , setShowEmoji  } ) => {

  return (
    <>
    <div onClick={() => setShowEmoji(false)}  className="fixed top-0 left-0 right-0 bottom-0"></div>
    <div className="absolute bottom-[100%] right-[100%]">
        <Picker theme="dark" autoFocus={true} data={data}  onEmojiSelect={setEmoji}/>
    </div>
    </>
  )
}

export default memo(EmojsPicker)