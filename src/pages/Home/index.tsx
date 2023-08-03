import CardSong from "../../components/CardSong";
import "./Home.css";
import { useEffect, useState } from "react";
import { getAllMusics } from "../../services/musicService";
import Music from "../../models/Music";

const Home = () => {
  const [musics, setMusics] = useState<Array<Object>>([]);

  useEffect(() => {
    async function fetchMusics() {
      const musics = await getAllMusics();
      setMusics(musics);
    }

    fetchMusics();
  }, []);

  return (
    <div className=" flex flex-col items-center">
      {musics.map((music: any) => {
        return <CardSong key={music.id} music={music.data} />;
      })}
    </div>
  );
};

export default Home;
