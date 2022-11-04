import React, { useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImg from "../../assets/images/backgound.jpg";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import { useSelector } from "react-redux";
import {
  PUBLIC_KEY,
  SERVICE_ID,
  TEMPLATE_ID,
} from "../../service/helper";
import { updateUser } from "../../service/CRUD";
import OtpInput from "react-otp-input";
import mailBoxImg from "../../assets/images/logoDog.png";
import CountDown from "../../components/CountDown";
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible, AiFillLock, AiOutlineLoading3Quarters, AiTwotoneMail } from "react-icons/ai";

const ForgotPasswordComponent = () => {
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [inputOTP, setInputOTP] = useState({ otp: "" });
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isCountDown, setIsCountDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typePassword, setTypePassword] = useState("password");
  const [typeRepeatPassword, setTypeRepeatPassword] = useState("password");
  


  const OTPRef = useRef(
    Math.floor(Math.floor(Math.random() * 900000) + 100000)
  );
  const emailRef = useRef();
  const [currentForm, setCurrentForm] = useState("forgot");

  const handleShowPassword = () => {
    typePassword === "password"
      ? setTypePassword("text")
      : setTypePassword("password");
  };

  const handleShowRepeatPassword = () => {{
    typeRepeatPassword === "password"
    ? setTypeRepeatPassword("text")
    : setTypeRepeatPassword("password");
  }}

  useMemo(() => {
    if (countdown <= 0) {
      setIsCountDown(false);
      OTPRef.current = Math.floor(Math.floor(Math.random() * 900000) + 100000);
    }
  }, [countdown]);

  const handleSendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const OTP = Math.floor(Math.floor(Math.random() * 900000) + 100000);
    const checkEmailExist = users.some((user) => user.email === email);
    const toUser = users.find((user) => user.email === email);
    OTPRef.current = OTP;
    emailRef.current = email;
    setUserInfo(toUser);
    if (checkEmailExist) {
      const temlateParams = {
        to_email: email,
        to_user: toUser.nickname,
        OTP,
      };
      emailjs.send(SERVICE_ID, TEMPLATE_ID, temlateParams, PUBLIC_KEY).then(
        (result) => {
          setIsCountDown(true);
          toast.success("Please check your email", {
            autoClose: 3000,
            theme: "dark",
          });
          setIsLoading(false);
          setCurrentForm("OTP");
          setEmail("");
        },
        (error) => {
          toast.info("Email sending failed!", {
            autoClose: 3000,
            theme: "dark",
          });
        }
      );
    } else {
      toast.info("Your email could not be found!", {
        autoClose: 3000,
        theme: "dark",
      });
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    const temlateParams = {
      to_email: emailRef.current,
      to_user: userInfo.nickname,
      OTP: OTPRef.current,
    };
    emailjs.send(SERVICE_ID, TEMPLATE_ID, temlateParams, PUBLIC_KEY).then(
      (result) => {
        setIsCountDown(true);
        toast.success("Please check your email", {
          autoClose: 3000,
          theme: "dark",
        });
        setIsLoading(false);
      },
      (error) => {
        toast.info("Email sending failed!", {
          autoClose: 3000,
          theme: "dark",
        });
      }
    );
  };

  const handleSubmitOTP = (e) => {
    e.preventDefault();
    if (+inputOTP.otp === OTPRef.current) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentForm("ResetPassword");
        setIsLoading(false);
      }, 2000);
    } else if (+inputOTP.otp !== OTPRef.current) {
      toast.info("Mã OTP không chính xác", {
        autoClose: 3000,
        theme: "dark",
      });
    }
  };

  const handleChangeInput = (otp) => setInputOTP({ otp });

  const handleSubmitFormResetPassword = (e) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      toast.info("Confirm password doesn't match", {
        autoClose: 3000,
        theme: "dark",
      });
    } else if (!password || !repeatPassword) {
      toast.info("Please enter password", {
        autoClose: 3000,
        theme: "dark",
      });
    } else {
      const formUser = {
        ...userInfo,
        password,
      };
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        updateUser(formUser, userInfo.id);
        setCurrentForm("success");
        toast.success("Password recovery successful", {
          autoClose: 3000,
          theme: "dark",
        });
      }, 2000);
    }
  };
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0">
      <div
        style={{ backgroundImage: `url(${bgImg})` }}
        className="min-h-full flex items-center justify-center bg-no-repeat	bg-cover h-screen"
      >
        <ToastContainer />
        <div className="flex justify-center w-[95%]">
          {currentForm === "OTP" && (
            <form
              onSubmit={handleSubmitOTP}
              className="bg-[#36393f] lg:mx-0 p-[20px]  w-full lg:w-[480px]  rounded-md"
            >
              <div className="flex mb-3 gap-1 justify-center text-gray-300 font-semibold text-sm">
                <label htmlFor="OTP">
                  {isCountDown ? (
                    <CountDown
                      countdown={countdown}
                      setCountdown={setCountdown}
                    />
                  ) : (
                    <span>Your OTP has expired</span>
                  )}
                </label>
                {!isCountDown && (
                  <div
                    onClick={handleResendEmail}
                    className="text-blue-400 text-sm cursor-pointer"
                  >
                    Resend
                  </div>
                )}
              </div>
              <OtpInput
                containerStyle="flex justify-evenly"
                inputStyle={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "12px",
                  outline: "none",
                  fontSize: "16px",
                }}
                id="OTP"
                type="number"
                value={inputOTP.otp}
                onChange={handleChangeInput}
                numInputs={6}
              />
              <div className="flex mt-6">
                <button
                  type="submit"
                  className="flex justify-center gap-2 bg-theme hover:bg-opacity-70  w-full p-2 rounded-sm text-white text-lg"
                >
                  {isLoading && (
                    <AiOutlineLoading3Quarters className="h-auto my-1 animate-spin" />
                  )}
                  <span>Confirm</span>
                </button>
              </div>
              <div className="flex mt-4">
                <div
                  onClick={() => navigate(-1)}
                  className="text-blue-400 cursor-pointer"
                >
                  Back
                </div>
              </div>
            </form>
          )}
          {currentForm === "forgot" && (
            <form
              onSubmit={handleSendEmail}
              className="bg-[#36393f] lg:mx-0  p-[20px]  w-full lg:w-[480px]  rounded-md"
            >
              <div className="my-2 mt-4">
                <label
                  className="text-[#bfb9b9]  font-medium text-[15px]"
                  htmlFor="email"
                >
                  Enter your email address
                </label>
                <div
                  className=
                    "flex bg-[#fff] border-[1px] border-[#00000025] h-[2.6rem] my-1"
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
                    className=
                      "shaodow-lg bg-transparent w-full rounded-sm text-[#111] text-sm  py-2 px-3 outline-none"
                  />
                </div>
              </div>
              <div className="flex mt-6">
                <button
                  type="submit"
                  className="flex justify-center gap-2 py-2 bg-theme hover:bg-opacity-70 h-[3rem] w-full rounded-sm text-white text-lg"
                >
                  {isLoading && (
                    <AiOutlineLoading3Quarters className="h-auto my-1 animate-spin" />
                  )}
                  <span>Confirm</span>
                </button>
              </div>
              <div className="flex mt-4">
                <div
                  onClick={() => navigate(-1)}
                  className="text-blue-400 cursor-pointer"
                >
                  Back
                </div>
              </div>
            </form>
          )}

          {currentForm === "ResetPassword" && (
            <form
              className="bg-[#36393f] lg:mx-0  p-[20px]  w-full lg:w-[480px]  rounded-md"
              onSubmit={handleSubmitFormResetPassword}
            >
              <div>
                <div className="flex justify-center">
                  <RiLockPasswordFill className="text-[5rem] text-[#999]" />
                </div>
                <div className="my-2 mt-4">
                <label
                  className="text-[#bfb9b9] font-medium text-sm"
                  htmlFor="password"
                >
                  Password
                </label>
                <div
                  className=
                    "flex bg-[#fff] border-[1px] border-[#00000025] h-[2.6rem] my-1"
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
                    className=
                      "shaodow-lg bg-transparent w-full rounded-sm text-[#111] text-sm  py-2 px-3 outline-none"
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
              <div className="my-2 mt-4">
                <label
                  className="text-[#bfb9b9] font-medium text-sm"
                  htmlFor="repeatPassword"
                >
                  Repeat Password
                </label>
                <div
                  className=
                    "flex bg-[#fff] border-[1px] border-[#00000025] h-[2.6rem] my-1"
                >
                  <div className="h-full py-[8px] px-[16px] border-r-[.3px] border-[#00000025] ">
                    <AiFillLock className="h-full  border-[#00000025] text-theme" />
                  </div>
                  <input
                    required
                    type={typeRepeatPassword}
                    value={repeatPassword}
                    id="repeatPassword"
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    autoComplete="curent-pasword"
                    className=
                      "shaodow-lg bg-transparent w-full rounded-sm text-[#111] text-sm  py-2 px-3 outline-none"
                  />
                  {typeRepeatPassword === "password" ? (
                    <AiFillEyeInvisible
                      onClick={handleShowRepeatPassword}
                      className="text-2xl text-theme m-2 cursor-pointer"
                    />
                  ) : (
                    <AiFillEye
                      onClick={handleShowRepeatPassword}
                      className="text-2xl text-theme m-2 cursor-pointer"
                    />
                  )}
                </div>
              </div>

                <div className="flex mt-6">
                  <button
                    type="submit"
                    className="flex justify-center gap-2 bg-theme hover:bg-opacity-70  w-full p-2 rounded-sm text-white text-lg"
                  >
                    {isLoading && (
                      <AiOutlineLoading3Quarters className="h-auto my-1 animate-spin" />
                    )}
                    <span>Confirm</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {currentForm === "success" && (
            <div
              className="bg-[#36393f] lg:mx-0  p-[20px]  w-full lg:w-[480px]  rounded-md"
              onSubmit={handleSubmitFormResetPassword}
            >
              <div className="flex justify-center h-[10rem]">
                <img src={mailBoxImg} className="object-fill h-full" alt="" />
              </div>
              <span className="text-white font-bold text-lg">
                {`Congratulations ${userInfo.nickname} has successfully recovered the password`}
              </span>
              <div className="flex justify-center w-full ">
                <button
                  type="submit"
                  className=" gap-2 bg-theme hover:bg-opacity-70 mt-5 w-full p-2 rounded-sm text-white text-lg"
                >
                  <Link className="text-sm lg:text-base " to="/signin">Sign in</Link>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
