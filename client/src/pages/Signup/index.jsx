import React, { useState } from "react";
import { Link } from "react-router-dom";
import bgImg from "../../assets/images/backgound.jpg";
import { addUser } from "../../service/CRUD";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { colors } from "../../service/helper";
import { serverTimestamp } from "firebase/firestore";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiFillLock,
  AiTwotoneMail,
} from "react-icons/ai";
import { FaUser } from "react-icons/fa";

const Signup = () => {
  const states = useSelector((state) => state.users);
  const { users } = states;
  const [nickname, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [typePassword, setTypePassword] = useState("password");

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const checkEmail = users.some((user) => user.email === email);
    if (!password || !nickname || !email) {
      toast.info("Please fill in all the information", {
        autoClose: 3000,
        theme: "dark",
      });
    } else if (checkEmail) {
      toast.info("Email already exists", { autoClose: 3000, theme: "dark" });
    } else {
      toast.success("Signup success", { autoClose: 3000, theme: "dark" });
      const formData = {
        nickname,
        password,
        email,
        uid: Math.floor(Math.random() * 9000) + 1000,
        avatar: colors[Math.floor(Math.random() * colors.length)],
        status: "offline",
        friends: "",
        channels: "",
        timestamp: serverTimestamp(),
      };
      addUser(formData);
      setPassword("");
      setNickName("");
      setEmail("");
    }
  };

  const handleShowPassword = () => {
    typePassword === "password"
      ? setTypePassword("text")
      : setTypePassword("password");
  };
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0">
      <div
        style={{ backgroundImage: `url(${bgImg})` }}
        className="min-h-full flex items-center justify-center bg-no-repeat	bg-cover h-screen"
      >
        <ToastContainer />
        <div className="flex justify-center w-[95%] lg:w-[456px] ">
          <div className="lg:mx-0 bg-[#36393f] shadow-md  p-[24px]  lg:p-[30px] w-full rounded-md">
            <form onSubmit={handleSubmitForm} className="w-full">
              <div className="flex justify-center">
                <span className="text-[#fff] text-2xl font-semibold">
                  Sign up
                </span>
              </div>
              <div className="my-2 mt-4">
                <label
                  className="text-[#bfb9b9]  font-medium text-[15px]"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div className="flex bg-[#fff] border-[1px] border-[#00000025] rounded-md h-[2.6rem] my-1">
                  <div className="h-full py-[8px] px-[16px] border-r-[.3px] ">
                    <AiTwotoneMail className="h-full  border-[#99999962] text-theme" />
                  </div>
                  <input
                    required
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shaodow-lg bg-transparent w-full rounded-sm text-[#333] text-sm  py-2 px-3 outline-none"
                  />
                </div>
              </div>

              <div className="my-2 mt-4">
                <label
                  className="text-[#bfb9b9]  font-medium text-[15px]"
                  htmlFor="name"
                >
                  Name
                </label>
                <div className="flex bg-[#fff] border-[1px] border-[#00000025] rounded-md h-[2.6rem] my-1">
                  <div className="h-full py-[8px] px-[16px] border-r-[.3px] ">
                    <FaUser className="text-sm mr-[2px] h-full  border-[#99999962] text-theme" />
                  </div>
                  <input
                    required
                    id="name"
                    value={nickname}
                    onChange={(e) => setNickName(e.target.value)}
                    className="shaodow-lg bg-transparent w-full rounded-sm text-[#333] text-sm  py-2 px-3 outline-none"
                  />
                </div>
              </div>

              <div className="my-2 mt-4">
                <label
                  className="text-[#bfb9b9] font-medium text-sm"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="flex bg-[#fff] border-[1px] border-[#00000025] rounded-md h-[2.6rem] my-1">
                  <div className="h-full py-[8px] px-[16px] border-r-[.3px] ">
                    <AiFillLock className="h-full  border-[#99999962] text-theme" />
                  </div>
                  <input
                    required
                    type={typePassword}
                    value={password}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="curent-pasword"
                    className="shaodow-lg bg-transparent w-full rounded-sm text-[#333] text-sm  py-2 px-3 outline-none"
                  />
                  {typePassword === "password" ? (
                    <AiFillEyeInvisible
                      onClick={handleShowPassword}
                      className="text-2xl text-theme m-2 cursor-pointer"
                    />
                  ) : (
                    <AiFillEye
                      onClick={handleShowPassword}
                      className="text-2xl text-theme m-2 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              <div className="flex my-5">
                <button className="p-3 text-center bg-theme text-white w-full hover:bg-[#6159cb] rounded-sm">
                  Sign up
                </button>
              </div>
              <div className="mt-10">
                <div className="flex justify-center gap-1">
                  <span className="lg:text-base text-sm text-[#fff]">
                   Already have an account ?
                  </span>
                  <Link className="lg:text-base text-sm text-theme" to="/signin">
                   Signin
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
