import { db } from "../config/firebase-config";

import { addDoc, collection, getDocs } from "firebase/firestore";
import Music from "../models/Music";

const addMusic = async (music: Music) => {
  await addDoc(collection(db, "musics"), music).then((docRef) => {
    console.log("add music successfully :", docRef);
  });
};

const getAllMusics = async () => {
  let musics: Array<Object> = [];

  const querySnapshot = await getDocs(collection(db, "musics"));
  querySnapshot.forEach((doc: any) => {
    const musicInfo = { id: doc.id, data: doc.data() };
    musics.push(musicInfo);
  });

  return musics;
};

export { addMusic, getAllMusics };
