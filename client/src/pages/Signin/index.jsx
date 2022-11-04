import React, { useEffect, useState } from "react";
import bgImg from "../../assets/images/backgound.jpg";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateUser } from "../../service/CRUD";
import clsx from "clsx";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiFillLock,
  AiTwotoneMail,
} from "react-icons/ai";
import { GiWhirlwind } from "react-icons/gi";

const Signin = () => {
  const sessionId = sessionStorage.getItem("sessionId");
  const rememberStorage = JSON.parse(localStorage.getItem("remember"));
  const navigate = useNavigate();
  const states = useSelector((state) => state.users);
  const { users } = states;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [typePassword, setTypePassword] = useState("password");

  useEffect(() => {
    if (sessionId) {
      navigate("/channels/@me");
    }
    if (rememberStorage) {
      setEmail(rememberStorage.email);
      setPassword(rememberStorage.password);
    }
  }, []);
  const handleShowPassword = () => {
    typePassword === "password"
      ? setTypePassword("text")
      : setTypePassword("password");
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email);
    if (!user) {
      toast.info("Email does not exist", { autoClose: 3000, theme: "dark" });
    } else if (!email || !password) {
      toast.info("Please fill in all the information", {
        autoClose: 3000,
        theme: "dark",
      });
    } else if (user && user.password !== password) {
      toast.info("Incorrect password", {
        autoClose: 3000,
        theme: "dark",
      });
    } else {
      if (remember) {
        localStorage.setItem("remember", JSON.stringify({ email, password }));
      }
      navigate("/channels/@me");
      updateUser({ ...user, status: "online" }, user.id);
      sessionStorage.setItem("sessionId", user.id);
    }
  };
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0">
      <div
        style={{ backgroundImage: `url(${bgImg})` }}
        className="bg-[#000] min-h-full flex items-center justify-center bg-no-repeat	bg-cover h-screen"
      >
        <ToastContainer />
        <div className="flex justify-center w-[95%] lg:w-[456px]">
          <div className="lg:mx-0 bg-[#36393f] shadow-md  p-[24px]  lg:p-[30px] w-full rounded-md">
            <form onSubmit={handleSubmitForm} className="w-full">
              <div className="flex justify-center">
                <span className="text-[#fff] text-2xl font-semibold">
                  Sign in
                </span>
              </div>
              <div className="my-2 mt-4">
                <label
                  className="text-[#bfb9b9]  font-medium text-[15px]"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div
                  className={clsx(
                    { "bg-[#e8f0fe]": rememberStorage },
                    "flex bg-[#fff] border-[1px] border-[#00000025] h-[2.6rem] my-1"
                  )}
                >
                  <div className="h-full py-[8px] px-[16px] border-r-[.3px] border-[#00000025] ">
                    <AiTwotoneMail className="h-full  border-[#00000025] text-theme" />
                  </div>
                  <input
                    required
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={clsx(
                      { "text-[#111]": rememberStorage },
                      "shaodow-lg bg-transparent w-full rounded-sm text-[#111] text-sm  py-2 px-3 outline-none"
                    )}
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
                <div
                  className={clsx(
                    { "bg-[#e8f0fe]": rememberStorage },
                    "flex bg-[#fff] border-[1px] border-[#00000025] h-[2.6rem] my-1"
                  )}
                >
                  <div className="h-full py-[8px] px-[16px] border-r-[.3px] border-[#00000025] ">
                    <AiFillLock className="h-full  border-[#00000025] text-theme" />
                  </div>
                  <input
                    required
                    type={typePassword}
                    value={password}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="curent-pasword"
                    className={clsx(
                      { "text-[#111]": rememberStorage },
                      "shaodow-lg bg-transparent w-full rounded-sm text-[#111] text-sm  py-2 px-3 outline-none"
                    )}
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
              <div className="flex my-3 justify-between">
                <div>
                  <Link to="/forgot" className="text-theme text-[13px]">
                    Forgot Password?
                  </Link>
                </div>
                <div>
                  <div className="flex gap-2">
                    <label
                      className="text-[#bfb9b9] text-[15px]"
                      htmlFor="remember"
                    >
                      Remember me
                    </label>
                    <input
                      checked={remember}
                      type="checkbox"
                      onChange={(e) => setRemember(!remember)}
                      id="remember"
                      className="rounded-[.5rem]  cursor-pointer "
                    />
                  </div>
                </div>
              </div>
              <div className="flex my-5">
                <button className="p-3 text-center bg-theme text-white w-full hover:bg-[#6159cb] rounded-sm">
                  Sign in
                </button>
              </div>
              <div className="mt-10">
                <div className="flex justify-center gap-1">
                  <span className="lg:text-base text-sm text-[#fff]">
                    Don't have an account ?
                  </span>
                  <Link className="lg:text-base text-sm text-theme" to="/signup">
                    Signup now
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

export default Signin;
