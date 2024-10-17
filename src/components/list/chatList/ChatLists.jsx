import React, { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import useUserStore from "../../lib/userStore";
import useChatStore from "../../lib/chatStore";

const ChatList = () => {
  const [selected, setSelected] = useState(null);
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, setChatId, changeChat } = useChatStore();

  const handleSelect = async (chat) => {
    if (!chat.chatID) {
      console.warn('Cuộc trò chuyện không tìm thấy chatID:', chat);
      return;
    }
    changeChat(chat.chatID, chat.user);
  };

  const handleSelectChat = (index) => {
    setSelected(index);
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data()?.chats || [];

      const promises = items.map(async (item, index) => {
        const receiverId = item.receiverId || item.receiveId;

        if (!receiverId) {
          return null;
        }

        try {
          const userDocRef = doc(db, "users", receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        } catch (error) {
          console.error(error);
          return null;
        }
      });

      const chatData = (await Promise.all(promises)).filter((chat) => chat !== null);
      // Handle case when a chat is deleted and the current chat is no longer valid
      if (chatId && !chatData.find((chat) => chat.chatID === chatId)) {
        setChatId(null); // Reset chatId if the current chat is deleted
        setSelected(null); // Reset selected chat index
      }
      setChats(chatData.sort((a, b) => b.updateAt - a.updateAt));
    });

    return () => {
      unSub();
    };
  }, [currentUser.id, chatId, setChatId]);

  const filteredChats = chats.filter(c =>
    c.user?.username?.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="Search Icon" />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="add-container">
          <img
            className="add"
            src={addMode ? "./minus.png" : "./plus.png"}
            alt="Toggle Add"
            onClick={() => setAddMode((state) => !state)}
          />
          <span className="tooltip">Thêm cuộc trò chuyện</span>
        </div>

      </div>


      <div className="items">
        {filteredChats?.map((chat, index) => (
          <div
            className={`item ${selected === index ? "selected" : ""}`}
            key={chat.chatID || `chat-${index}`}
            onClick={() => {
              handleSelectChat(index);
              handleSelect(chat);
            }}
          >
            <img src={chat?.user?.blocked.includes(currentUser.id) ? "./avatar.png" : chat?.user?.avatar || "./avatar-user.png"} alt="User Avatar" />
            <div className="texts">
              <div className="user">
                <span>{chat?.user?.blocked.includes(currentUser.id) ? "User" : chat?.user?.username}</span>
                <div className="status">
                  <i className="bi bi-circle-fill" style={{ color: chat?.user?.isOnline ? "green" : "gray" }}></i>
                  {chat?.user?.isOnline ? "Online" : "Offline"}
                </div>
              </div>
              <p>
                { chat.lastMessage || "No message" }
                {/* {
                  chat.lastMessage
                    ? chat.lastMessage.img
                      ? (
                        <p>
                          <i className="bi bi-image" style={{ marginRight: "5px" }}></i>
                          Picture
                        </p>
                      )
                      : chat.lastMessage.text || "No message"
                    : "No message"
                } */}
              </p>
            </div>

          </div>
        ))}
      </div>
      {addMode && <AddUser setAddMode={setAddMode} />}
    </div>
  );
};

export default ChatList;
