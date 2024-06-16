"use client";

import axios from "axios";
import { useContext, useState } from "react";
import { ToastContext } from "../../contexts/ToastContext";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const { notify } = useContext(ToastContext);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/login", loginData);
      const dataRes = response.data;
      if (dataRes) {
        localStorage.setItem("username", dataRes.username);
        notify("success", "Login successfully");
      }
      router.push("/homepage");
    } catch (error: any) {
      const errorMessage = error.response.data.message;
      notify("error", errorMessage);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen lg:block bg-blue-500 relative">
        <p className="text-5xl absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          Rent House Management
        </p>
      </div>

      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4 text-black">Login</h1>
        <form action="#" method="POST" onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4 text-gray-600">
            <label htmlFor="username" className="block text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              value={loginData.username}
              onChange={(e) => {
                setLoginData({
                  ...loginData,
                  username: e.target.value,
                });
              }}
            />
          </div>

          <div className="mb-4 text-gray-600">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              value={loginData.password}
              onChange={(e) => {
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                });
              }}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full mt-5"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
