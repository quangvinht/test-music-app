interface User {
  uid: string | null;
  name: string | null;
  email: string | null;
  img: string | null;
  favorites: Array<Object> | null;
}

export default User;
