import React, { memo, useEffect, useState } from "react";
import { RiUploadCloudFill } from "react-icons/ri";
import { addChannel, updateUser } from "../../service/CRUD";
import { storage } from "../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import Progress from "../Progess";
import { useSelector } from "react-redux";
import { serverTimestamp } from "firebase/firestore";

const Modal = ({ setModal }) => {
  const sessionId = sessionStorage.getItem("sessionId");
  const { users } = useSelector((state) => state.users);
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [name, setName] = useState("");
  const [isLoading] = useState(true);
  const [avatar, setAvatar] = useState();

  const currentUser = users.find((user) => user.id === sessionId);

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar.preview);
    };
  }, [avatar]);

  const onFileChange = (e) => {
    const blob = e.target.files[0];
    blob.preview = URL.createObjectURL(blob);
    setAvatar(blob);
    setFile(e.target.files[0]);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!file) {
      toast.info("Please choose a file", {
        autoClose: 3000,
        theme: "dark",
      });
    } else if (!name) {
      toast.info("Please enter channel name", {
        autoClose: 3000,
        theme: "dark",
      });
    } else {
      const storageRef = ref(storage, `/file/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percen = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percen);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            if (currentUser.id) {
              const formChannel = {
                channelId: uuidv4(),
                name,
                roomMaster: sessionId,
                members: sessionId,
                photoUrl: url,
                timestamp: serverTimestamp(),
              };
              const formUser = {
                ...currentUser,
                channels: formChannel.channelId,
              };
              addChannel(formChannel);
              updateUser(formUser, currentUser.id);
              toast.success("Successful channel creation", {
                autoclose: 3000,
                theme: "dark",
              });
              setModal(false);
            }
          });
        }
      );
    }
  };

  return (
    <>
      <div
        onClick={() => setModal(false)}
        className="fixed top-0 left-0 bottom-0 right-0 bg-[#080809] bg-opacity-50 z-[60]"
      ></div>
      <ToastContainer />
      <form
        onSubmit={handleSubmitForm}
        className="absolute my-0 mx-auto top-[20%] lg:top-[20%] left-[10%] lg:left-[35%] z-[61] bg-white w-[80%] lg:w-[440px] lg:h-auto h-[50%]"
      >
        <Progress percent={percent} />
        <div className="p-4">
          <span className="flex justify-center my-3 text-[#060607] text-lg font-semibold">
            Customize your server
          </span>
          <span className="lg:flex hidden justify-center my-2 text-[#4F5660]">
            Personalize the server by naming it and adding a giant icon face.
            You can change at any time
          </span>
          <div className="flex lg:my-6 my-0  justify-center h-[8rem]">
            <label
              onChange={onFileChange}
              htmlFor="upload"
              className="cursor-pointer  rounded-full"
            >
              {avatar ? (
                <img
                  className="object-fill h-full w-[8rem]  rounded-full"
                  src={avatar.preview}
                  alt=""
                />
              ) : (
                <RiUploadCloudFill
                  className="lg:h-full bg-gradient-to-r from-sky-500 to-indigo-500  w-[6rem] h-[6rem] lg:w-[8rem] p-4 text-[#fff] rounded-full"
                  alt=""
                />
              )}
              <input
                accept="image/*"
                hidden
                id="upload"
                name="img"
                type="file"
              />
            </label>
          </div>
          <div className="flex">
            <span className="text-[#4F5660] text-xs font-semibold">
               SERVER NAME
            </span>
          </div>
          <div className="flex my-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              type="text"
              className="bg-[#E3E5E8] text-[#4F5660] outline-none p-2 w-full"
            />
          </div>
          <div className="flex">
            <span className="text-xs font-normal">
            By creating a server, you agree to the{" "}
              <a
                className="text-sm text-[#0068E0]"
                href="https://discord.com/guidelines"
              >
                Discord Community Guidelines.
              </a>{" "}
            </span>
          </div>
        </div>

        <div className="flex justify-between p-4 bg-[#F2F3F5]">
          <span
            onClick={() => setModal(false)}
            className="text-[#3BA55D] text-sm cursor-pointer"
          >
            Back
          </span>
          <button
            disabled={!isLoading ? true : false}
            type="submit"
            className="bg-[#5865F2] text-white px-8 py-1 rounded-sm"
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
};

export default memo(Modal);
