import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createRoom, joinRoom } from "../js/api";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const CreateJoinChat = () => {
  const [details, setDetails] = useState({
    userName: "",
    roomId: "",
  });

  const {
    setRoomId,
    setCurrentUser,
    setConnected,
    roomId,
    currentUser,
    connected,
  } = useChatContext();

  useEffect(() => {
    console.log("Room: " + roomId);
    console.log("currentUser: " + currentUser);
    console.log("status: " + connected);
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    setDetails({
      ...details,
      [event.target.name]: event.target.value,
    });
  };

  const validateForm = () => {
    if (details.userName === "" || details.roomId === "") {
      toast.error("empty fields!!");
      return false;
    }
    return true;
  };

  const JoinRoom = async () => {
    if (validateForm()) {
      try {
        const res = await joinRoom(details.roomId);

        toast.success(`joined "${res.roomId}"`);

        setConnected(true);
        setCurrentUser(details.userName);
        setRoomId(res.roomId);
        setConnected(true);

        navigate("/chat");
      } catch (error) {
        if (error.status === 400) {
          toast.error(error.response.data);
        }
        console.log(error);
      }
    }
  };

  const CreateRoom = async () => {
    if (validateForm()) {
      try {
        const response = await createRoom(details.roomId);

        toast.success("room created successfully!!");

        setCurrentUser(details.userName);
        setRoomId(response.roomId);
        setConnected(true);

        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error("room already exists");
        }
        console.log(error);
      }
    }
  };

  return (
    <div className="flex flex-col p-4 bg-amber-50 dark:bg-gray-800 shadow-xl gap-3 rounded-2xl ">
      <img
        src="https://img.icons8.com/clouds/100/chat.png"
        alt="img"
        onError={(e) => (e.target.src = "src/assets/icons8-chat-50.png")}
        className="h-32 w-32 place-self-center animate-soft-bounce translate-y-3 "
      />
      <h1 className="text-5xl">Join Room..!</h1>
      <hr className="bg-amber-900 h-1 rounded-md " />
      <div className="flex flex-col">
        <label className="px-2" htmlFor="name">
          Your name
        </label>
        <input
          type="text"
          className=" dark:bg-gray-200   bg-amber-100 rounded-2xl placeholder-gray-500 px-2 py-1 focus:outline-none focus:ring-2 ring-amber-900 text-gray-800 "
          name="userName"
          id="name"
          onChange={handleChange}
          placeholder="Enter your name"
        />
      </div>
      <div className="flex flex-col">
        <label className="px-2" htmlFor="name">
          Room ID
        </label>
        <input
          type="text"
          className=" dark:bg-gray-200   bg-amber-100 rounded-2xl placeholder-gray-500 px-2 py-1 focus:outline-none focus:ring-2 ring-amber-900 text-gray-800 "
          id="name"
          name="roomId"
          onChange={handleChange}
          placeholder="Enter room ID"
        />
      </div>

      <div className="flex justify-between font-semibold mt-1.5">
        <button
          className=" bg-amber-200 dark:bg-gray-400 px-3 py-1 rounded-full cursor-pointer hover:opacity-80"
          onClick={JoinRoom}
        >
          Join Room
        </button>
        <button
          className=" bg-amber-200 dark:bg-gray-400 px-3 py-1 rounded-full cursor-pointer hover:opacity-80"
          onClick={CreateRoom}
        >
          Create Room
        </button>
      </div>
    </div>
  );
};
export default CreateJoinChat;
