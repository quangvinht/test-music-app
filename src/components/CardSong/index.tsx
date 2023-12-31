import React from "react";
import { getSingleUser } from "../../services/userServices";
import { useEffect, useState } from "react";
import "./CardSong.css";
import Button from "../Button";
import Image from "../Image";
import User from "../../models/User";
import Music from "../../models/Music";
import {
  saveFavoriteMusic,
  deleteFavoriteMusic,
} from "../../services/userServices";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast, useToast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

interface Props {
  music: Music;
}

const CardSong: React.FC<Props> = ({ music }) => {
  const [userInfo, setUserInfo] = useState<User>();
  const [idUser, setIdUser] = useState<string>("");
  const [isHaveFavoriteMusic, setIsHaveFavoriteMusic] =
    useState<boolean>(false);

  let { pathname } = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue: any = localStorage.getItem("user");
        const parse: any = JSON.parse(jsonValue);

        if (parse?.uid) {
          const user: any = await getSingleUser(parse.uid);
          if (
            user.data.favorites.some(
              (favorites: Music) => favorites.title === music.title
            )
          ) {
            setIsHaveFavoriteMusic(true);
          } else {
            setIsHaveFavoriteMusic(false);
          }

          setUserInfo(user);
          setIdUser(user.id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userInfo]);

  const handleSaveMusic = async () => {
    await saveFavoriteMusic(userInfo, music);
    const notify = () => toast.success("Add favorite music successfully !");
    notify();
  };

  const handleDeleteMusic = async () => {
    await deleteFavoriteMusic(userInfo, music);
    const notify = () => toast.info("Delete favorite music successfully !");
    notify();
  };

  return (
    <>
      <div className="card flex items-center justify-between w-full my-4">
        <a href={music.url} target="_blank" className="flex items-center ">
          <Image
            src={music.img}
            alt="music avatar"
            styleClass="music_icon mr-3"
          />
          <div className="flex flex-col items-start">
            <h2 className="font-bold ">{music?.title}</h2>
            <h3 className="text-sky-500">{music?.author}</h3>
          </div>
        </a>
        <div>
          {pathname === "/home" && (
            <Button
              clickEvent={handleSaveMusic}
              status="logout"
              styleClass="p-2"
              disabled={isHaveFavoriteMusic}
            >
              {isHaveFavoriteMusic && (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                  >
                    <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                  </svg>
                  <p className="ml-3">Saved Favorite</p>
                </div>
              )}
              {!isHaveFavoriteMusic && (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 384 512"
                  >
                    <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z" />
                  </svg>
                  <p className="ml-3">Add favorite</p>
                </div>
              )}
            </Button>
          )}

          {pathname !== "/home" && (
            <Button
              clickEvent={handleDeleteMusic}
              status="delete"
              styleClass="p-2 ml-2"
            >
              {" "}
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
                <p className="ml-3">Remove</p>
              </div>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default CardSong;
