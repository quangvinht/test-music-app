import "./Profile.css";
import { getSingleUser } from "../../services/userServices";
import { useEffect, useState } from "react";

import Music from "../../models/Music";
import CardSong from "../../components/CardSong";

const Profile = () => {
  const [musics, setMusics] = useState<Array<Music>>([]);
  useEffect(() => {
    async function fetchUserData() {
      try {
        const jsonValue: any = localStorage.getItem("user");
        const data = JSON.parse(jsonValue);

        if (data?.uid) {
          const user: any = await getSingleUser(data.uid);
          setMusics(user.data.favorites);
        }
      } catch (error) {
        // Xử lý lỗi nếu cần
      }
    }

    fetchUserData();
  }, [musics]);

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
