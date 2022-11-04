import React, { useEffect, memo } from "react";
import PropTypes from "prop-types";

const CountDown = ({ countdown, setCountdown }) => {
  useEffect(() => {
    const timerId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(timerId);
      setCountdown(60)
    };
  }, []);
  

  return <div>{`Your OTP will expire in ${countdown} seconds`}</div>;
};

export default memo(CountDown);

CountDown.propsTypes = {
  countNumber: PropTypes.number,
};
