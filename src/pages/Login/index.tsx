import React from "react";
import {
  signInWithGoogle,
  signInWithFacebook,
} from "../../services/userServices";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      const notify = () => toast.success("Sign in successfully");
      notify();

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (error) {
      console.error(error);
      const notify = () => toast.error("Sign in failed");
      notify();
    }
  };

  const handleFacebook = async () => {
    try {
      const user = await signInWithFacebook();
      localStorage.setItem("user", JSON.stringify(user));

      const notify = () => toast.success("Sign in successfully");
      notify();

      navigate("/home");
    } catch (error) {
      console.error(error);

      const notify = () => toast.error("Sign in failed");
      notify();
    }
  };

  return (
    <>
      <div className="login flex flex-col justify-center items-center">
        <h1 className="my-2 text-2xl font-extrabold"> Log in</h1>
        <div className="flex flex-col">
          <Button
            clickEvent={handleGoogle}
            status="google"
            styleClass="p-2  my-3 flex items-center"
          >
            <div className="text-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 488 512"
              >
                {" "}
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            </div>
            <p className="ml-2">Sign in with google</p>
          </Button>

          <Button
            clickEvent={handleFacebook}
            status="facebook"
            styleClass="p-2  flex items-center"
          >
            <div className="text-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
              </svg>
            </div>
            <p className="ml-2">Sign in with Facebook</p>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
