import { useEffect, useState, useRef } from "react"; // Added useRef
import Navbar from "../components/Navbar";
import useChatContext from "../context/ChatContext";

import { baseURL } from "../config/AxiosHelper";

import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getMessages } from "../js/api";

const Chat = () => {
  const { currentUser, roomId, connected } = useChatContext();

  const [stompClient, setStompClient] = useState(null);

  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  const messagesContainerRef = useRef(null); // Ref for messages container

  const data = {
    roomId: roomId,
    userName: currentUser,
  };

  // Fix: Add dependency array to prevent infinite loop
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await getMessages(roomId);
        setMessages(messages);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (roomId) {
      // Only load if roomId exists
      loadMessages();
    }
  }, [roomId]); // Add dependency array

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]); // Add dependencies

  useEffect(() => {
    const connectWebSocket = () => {
      ///SockJS
      const socket = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(() => socket);

      client.connect({}, () => {
        setStompClient(client);

        toast.success("connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);

          const newMessage = JSON.parse(message.body);

          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected && roomId) {
      connectWebSocket();
    }

    // Cleanup function
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [roomId, connected]); // Add dependencies

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };

      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );

      setInput("");
    }
    console.log(currentUser);
  };

  // Handle Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-amber-100 dark:bg-gray-950 overflow-hidden items-center flex flex-col">
      <Navbar data={data} />
      <main
        ref={messagesContainerRef}
        className="flex-1 w-2xl shrink bg-amber-50 dark:bg-gray-500 overflow-y-auto px-4 md:px-10 py-5"
      >
        <div className="flex flex-col gap-4 min-h-full">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 p-3 rounded-2xl max-w-[80%] md:max-w-[70%] ${
                  message.sender === currentUser
                    ? "bg-green-800 text-white flex-row-reverse"
                    : "bg-blue-950 text-white"
                }`}
              >
                <img
                  src="https://avatar.iran.liara.run/public"
                  className="h-10 w-10 rounded-full"
                  alt="avatar"
                />
                <div
                  className={`flex flex-col ${
                    message.sender === currentUser ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-xs opacity-80">{message.sender}</span>
                  <p className="mt-1 wrap-break-word">{message.content}</p>
                  {message.timestamp && (
                    <span className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <div className="w-full bg-gray-400 dark:bg-gray-700 p-4">
        <div className="flex justify-between gap-3 items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="bg-gray-200 dark:bg-gray-300 rounded-full flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-500 text-gray-800"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-green-700 hover:bg-green-800 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;
