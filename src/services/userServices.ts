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
    const userInfo = { id: doc.id, data: doc.data() };
    userData.push(userInfo);
  });

  return userData;
};

const getSingleUser = async (uid: string) => {
  let userData: Array<Object> = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const userInfo: Object = { id: doc.id, data: doc.data() };
    userData.push(userInfo);
  });

  const findUser = userData.find((user: any) => {
    return user.data.uid === uid;
  });

  return findUser;
};

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  return await signInWithPopup(auth, provider)
    .then((result: any) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const user = result.user;

      const { uid, displayName, email, photoURL } = user;
      const createUser: User = {
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
      localStorage.removeItem("user");

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
    .then((result: any) => {
      const user = result.user;

      const { uid, displayName, email, photoURL } = user;
      const createUser: User = {
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
      localStorage.removeItem("user");

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
    })
    .catch((error) => {
      // An error happened.
    });
};

const updateUser = async (
  userData: any,

  musicFavorite: Music
) => {
  getSingleUser(userData.data.uid).then(async (user: any) => {
    let updateFavoriteMusic: Array<any> = [
      ...user.data.favorites,
      musicFavorite,
    ];

    let isUnique: boolean = false;

    let uniqueFavoriteMusic = [];
    let seenTitles = new Set();

    for (let obj of updateFavoriteMusic) {
      if (!seenTitles.has(obj.title)) {
        isUnique = true;
        uniqueFavoriteMusic.push(obj);
        seenTitles.add(obj.title);
      } else {
        isUnique = false;
      }
    }

    const userCollRef = doc(db, "users", user.id);

    if (!isUnique) {
      alert("this music already have");
    } else {
      await updateDoc(userCollRef, { favorites: uniqueFavoriteMusic })
        .then(() => {
          console.log("updated music successfully");
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  });
};

const deleteFavoriteMusic = async (userData: any, music: Music) => {
  getSingleUser(userData.data.uid).then(async (user: any) => {
    let listFavorites: Array<Music> = user.data.favorites;
    const userCollRef = doc(db, "users", userData.id);

    const filteredFavorite: Array<Music> = listFavorites.filter(
      (favorite: Music) => favorite.title !== music.title
    );

    await updateDoc(userCollRef, { favorites: filteredFavorite })
      .then(() => {
        console.log("updated music successfully");
      })
      .catch((error) => {
        console.log(error.message);
      });
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
