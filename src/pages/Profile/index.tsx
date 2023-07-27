import "./Profile.css";
import { getSingleUser } from "../../services/userServices";
import { useEffect, useState } from "react";

import Music from "../../models/Music";
import CardSong from "../../components/CardSong";

const Profile = () => {
  let jsonValue: any = localStorage.getItem("user");
  let data: any = JSON.parse(jsonValue);

  const [musics, setMusics] = useState<Array<Music>>([]);

  useEffect(() => {
    getSingleUser(data.uid).then((user: any) => {
      setMusics(user.data.favorites);
    });
  }, []);

  return (
    <>
      {musics && (
        <div className="flex flex-col items-center">
          {musics.map((music: any) => {
            return <CardSong key={music.title} music={music} />;
          })}
        </div>
      )}

      {musics.length === 0 && (
        <div className="flex flex-col items-center">
          <h1 className="text-5xl">Chưa có bài hát yêu thích</h1>
        </div>
      )}
    </>
  );
};

export default Profile;
