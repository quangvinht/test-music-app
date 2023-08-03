import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";
import { useNavigate } from "react-router-dom";

import { logOut } from "../../../services/userServices";
import Button from "../../../components/Button";
import User from "../../../models/User";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { getSingleUser } from "../../../services/userServices";
import Image from "../../../components/Image";

const Header: React.FC = () => {
  let { pathname } = useLocation();
  let jsonValue: any = localStorage.getItem("user");

  const [userInfo, setUserInfo] = useState<User>();
  const [dataLocal, setDataLocal] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const parsedData: any = JSON.parse(jsonValue);
        setDataLocal(parsedData);

        const user: any = await getSingleUser(parsedData?.uid);
        setUserInfo(user?.data);
      } catch (error) {
        localStorage.removeItem("user");
        navigate("/");
        // toast.error("Account can't be found");
      }
    }

    fetchData();
  }, [jsonValue]);

  const navigate = useNavigate();
  const handleSignOut = async () => {
    const notify = () => toast.success("Sign out");
    notify();
    await logOut();
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleToHome = () => {
    if (jsonValue) {
      navigate("/home");
    }
  };

  return (
    <>
      <header className="header flex justify-between items-center  ">
        <div onClick={handleToHome} className="flex items-center">
          <div className="text-5xl mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
            >
              <path d="M494.8 47c12.7-3.7 20-17.1 16.3-29.8S494-2.8 481.2 1L51.7 126.9c-9.4 2.7-17.9 7.3-25.1 13.2C10.5 151.7 0 170.6 0 192v4V304 448c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H218.5L494.8 47zM368 240a80 80 0 1 1 0 160 80 80 0 1 1 0-160zM80 256c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16zM64 320c0-8.8 7.2-16 16-16H208c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16zm16 64c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16z" />
            </svg>
          </div>
          <h1 className="font-bold text-2xl mt-2">Music App</h1>
        </div>
        {pathname !== "/" && (
          <div className="flex">
            <div className="flex items-center">
              <Image
                clickEvent={() => {
                  navigate(`/profile/${userInfo?.uid}`);
                }}
                src={dataLocal?.photoURL}
                alt="avatar"
                styleClass="avatar mr-2"
              />
              <div className="flex flex-col items-start">
                <h2 className="font-bold">Xin chào,</h2>
                <i>{userInfo?.name}</i>
              </div>
            </div>
            <Button
              clickEvent={handleSignOut}
              status="logout"
              styleClass="p-2 "
            >
              Sign out
            </Button>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
