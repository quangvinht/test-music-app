import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import User from "../models/User";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Music from "../models/Music";

const addUser = async (user: User) => {
  await addDoc(collection(db, "users"), user).then((docRef) => {
    console.log("add user successfully :", docRef);
  });
};

const getAllUsers = async () => {
  let userData: Array<Object> = [];

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const userInfor = { id: doc.id, data: doc.data() };
    userData.push(userInfor);
  });

  return userData;
};

const getSingleUser = async (id: string) => {
  let userData: Array<Object> = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const userInfor = { id: doc.id, data: doc.data() };
    userData.push(userInfor);
  });

  const userMapByData = userData.map((user: any) => {
    return user.data;
  });

  const findUser = userData.find((user: any) => {
    return user.data.uid === id;
  });

  return findUser;
};

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  return await signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const user = result.user;

      const { uid, displayName, email, photoURL } = user;
      const createUser = {
        uid,
        name: displayName,
        email,
        img: photoURL,
        favorites: [],
      };
      const allUserData = getAllUsers().then((users) => {
        return users.find((user: any) => user.data.uid === uid);
      });
      const checkAddUser = async () => {
        const data = await allUserData;

        if (!data) {
          addUser(createUser);
        } else {
          console.log("user exits");
        }
      };
      checkAddUser();
      return user;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  provider.addScope("email");

  return await signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;

      const { uid, displayName, email, photoURL } = user;
      const createUser = {
        uid,
        name: displayName,
        email,
        img: photoURL,
        favorites: [],
      };
      const allUserData = getAllUsers().then((users) => {
        return users.find((user: any) => user.data.uid === uid);
      });
      const checkAddUser = async () => {
        const data = await allUserData;

        if (!data) {
          addUser(createUser);
        } else {
          console.log("user exits");
        }
      };
      checkAddUser();
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      const email = error.customData.email;

      const credential = FacebookAuthProvider.credentialFromError(error);

      // ...
    });
};

const logOut = async () => {
  await signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("signout succfully");
    })
    .catch((error) => {
      // An error happened.
    });
};

const updateUser = async (
  userData: any,

  musicFavorite: Music
) => {
  const updateFavoriteMusic: any = [...userData.data.favorites, musicFavorite];

  let isUnique = false;

  const uniqueObjectsArray = [];
  const seenTitles = new Set();

  for (const obj of updateFavoriteMusic) {
    if (!seenTitles.has(obj.title)) {
      isUnique = true;
      uniqueObjectsArray.push(obj);
      seenTitles.add(obj.title);
    } else {
      isUnique = false;
    }
  }

  const userCollRef = doc(db, "users", userData.id);

  if (!isUnique) {
    console.log("Da có bài hát rồi");
  } else {
    await updateDoc(userCollRef, { favorites: uniqueObjectsArray })
      .then((response) => {
        console.log("updated music successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
};

const deleteFavoriteMusic = async (userData: any, music: Music) => {
  let listFavorites = userData.data.favorites;
  const userCollRef = doc(db, "users", userData.id);

  let filteredFavorite = listFavorites.filter(
    (favorite: Music) => favorite.title !== music.title
  );

  await updateDoc(userCollRef, { favorites: filteredFavorite })
    .then((response) => {
      console.log("updated music successfully");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export {
  signInWithGoogle,
  logOut,
  signInWithFacebook,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteFavoriteMusic,
};
