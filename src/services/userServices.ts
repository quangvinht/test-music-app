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
  const querySnapshot = await getDocs(collection(db, "users"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));
};

const getSingleUser = async (uid: string) => {
  const querySnapshot = await getDocs(collection(db, "users"));
  const userData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));

  return userData.find((user) => user.data.uid === uid) || null;
};

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    const result = await signInWithPopup(auth, provider);

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

    const allUsers = await getAllUsers();
    const existingUser = allUsers.find((user) => user.data.uid === uid);

    if (!existingUser) {
      await addUser(createUser);
    } else {
      console.log("User already exists");
    }

    return user;
  } catch (error: any) {
    localStorage.removeItem("user");

    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData?.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    throw error; // Rethrow the error for higher-level error handling
  }
};

const signInWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    provider.addScope("email");
    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    const { uid, displayName, email, photoURL } = user;
    const createUser: User = {
      uid,
      name: displayName,
      email,
      img: photoURL,
      favorites: [],
    };

    const allUsers = await getAllUsers();
    const existingUser = allUsers.find((user) => user.data.uid === uid);

    if (!existingUser) {
      await addUser(createUser);
    } else {
      console.log("User already exists");
    }

    return user;
  } catch (error: any) {
    localStorage.removeItem("user");

    const errorCode = error.code;
    const errorMessage = error.message;

    const email = error.customData?.email;

    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
    throw error; // Rethrow the error for higher-level error handling
  }
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

const saveFavoriteMusic = async (userData: any, musicFavorite: Music) => {
  try {
    const user: any = await getSingleUser(userData.data.uid);
    const userFavorites: Music[] = user.data.favorites;

    if (userFavorites.some((fav: Music) => fav.title === musicFavorite.title)) {
      alert("This music already exists in favorites.");
      return;
    }

    const seenTitles = new Set();
    const uniqueFavoriteMusic = userFavorites.filter((fav: Music) => {
      if (!seenTitles.has(fav.title)) {
        seenTitles.add(fav.title);
        return true;
      }
      return false;
    });

    const userCollRef = doc(db, "users", user.id);
    await updateDoc(userCollRef, {
      favorites: [...uniqueFavoriteMusic, musicFavorite],
    });
    console.log("Updated music successfully");
  } catch (error: any) {
    console.log(error.message);
  }
};

const deleteFavoriteMusic = async (userData: any, music: Music) => {
  try {
    const user: any = await getSingleUser(userData.data.uid);
    const updatedFavorites: Music[] = user.data.favorites.filter(
      (favorite: Music) => favorite.title !== music.title
    );

    const userCollRef = doc(db, "users", userData.id);
    await updateDoc(userCollRef, { favorites: updatedFavorites });
    console.log("Deleted music successfully");
  } catch (error: any) {
    console.log(error.message);
  }
};

export {
  signInWithGoogle,
  logOut,
  signInWithFacebook,
  getAllUsers,
  getSingleUser,
  saveFavoriteMusic,
  deleteFavoriteMusic,
};
