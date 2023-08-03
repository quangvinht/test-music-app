import { db } from "../config/firebase-config";

import { addDoc, collection, getDocs } from "firebase/firestore";
import Music from "../models/Music";

const addMusic = async (music: Music) => {
  await addDoc(collection(db, "musics"), music).then((docRef) => {
    console.log("add music successfully :", docRef);
  });
};

const getAllMusics = async () => {
  const querySnapshot = await getDocs(collection(db, "musics"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));
};

export { addMusic, getAllMusics };
