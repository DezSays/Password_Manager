import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";

const Register = () => {
  const [userData, setUserData] = useState({
    id: uuidv4(),
    email: "",
    pw: "",
    first_name: "",
    last_name: "",
    username: "",
    avatar: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const avatars = [
    "/penguin.svg",
    "/sheep.png",
    "/house-cat.svg",
    "/giraffe.svg",
    "/elephant.png",
    "/eggplant.png",
    "/battle-cat.svg",
  ];

  useEffect(() => {
    fetchAvatar();
  }, []);

  const fetchAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatars.length);
    setUserData({ ...userData, avatar: avatars[randomIndex] });
  };

  const handleAvatarSelect = (avatar) => {
    setUserData({ ...userData, avatar: avatar });
    setIsModalOpen(false);
  };
  console.log(userData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://lockbox-password-server.vercel.app/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
      console.log(data);
      window.location.replace("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 py-5">
      <div className="w-full md:w-2/3 p-4 bg-white rounded shadow-md">
        <h2 className="text-2xl mb-4 text-center text-navy">Why Register?</h2>
        <p className="text-gray-700 text-center mb-4">
          Our platform enables you to securely store and manage all your
          passwords in one place. Say goodbye to forgotten passwords and the
          hassle of insecure password storage. With our intuitive and secure
          solution, you can access your passwords whenever you need them, from
          any device. Your data remains encrypted and protected, ensuring your
          information stays safe and easily accessible only to you.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            required
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={userData.pw}
            onChange={(e) => setUserData({ ...userData, pw: e.target.value })}
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            required
            type="text"
            placeholder="First Name"
            value={userData.first_name}
            onChange={(e) =>
              setUserData({ ...userData, first_name: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            required
            type="text"
            placeholder="Last Name"
            value={userData.last_name}
            onChange={(e) =>
              setUserData({ ...userData, last_name: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            required
            type="text"
            placeholder="Username"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <div className="flex flex-col mb-2 items-center">
            <label
              htmlFor="avatar"
              className="text-sm font-semibold text-gray-700 mr-2"
            >
              Click on the image to choose your avatar:
            </label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-full w-16 h-16"
            >
              <img
                src={userData.avatar}
                className="rounded-full w-12 h-12"
                alt="Selected Avatar"
              />
            </button>
          </div>
          <button
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
      <p className="mt-2 mb-8">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">
          Login
        </a>
      </p>

      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          handleAvatarSelect={handleAvatarSelect}
          avatars={avatars}
        />
      )}
    </div>
  );
};

export default Register;
