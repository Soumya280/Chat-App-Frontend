import { useState } from "react";
import Theme from "./Theme";
import { useNavigate } from "react-router";
import useChatContext from "../context/ChatContext";

const Navbar = ({ data }) => {
  const [userData, setUserData] = useState(data);

  const { setConnected } = useChatContext();

  const navigate = useNavigate();

  const handleLeave = () => {
    setConnected(false);
    navigate("/", { replace: true });
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      <nav className="w-full bg-amber-200 dark:bg-gray-600 py-4 px-10 gap-2 flex justify-between font-semibold">
        <div>
          <Theme />
        </div>
        {userData ? (
          <>
            <div className="gap-3 flex">
              <span>Room:{` ${userData.roomId}`}</span>
              <span>User:{` ${userData.userName}`}</span>
            </div>
            <button
              className="px-3 py-1 bg-amber-800 hover:bg-amber-600 dark:bg-gray-500 text-gray-100 dark:text-amber-100 dark:hover:bg-gray-400 rounded-full font-bold"
              onClick={handleLeave}
            >
              Leave Room
            </button>
          </>
        ) : (
          <></>
        )}
      </nav>
    </div>
  );
};
export default Navbar;
