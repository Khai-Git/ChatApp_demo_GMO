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

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  console.log(chatId);
  

  const handleSelect = async (chat) => {
    changeChat(chat.chatId, chat.user);
  };

  const handleSelectChat = (index) => {
    setSelected(index);
  };

  useEffect(() => {
    
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
      const items = res.data()?.chats || []; // Safely handle undefined data

      const promises = items.map(async (item) => {
        const receiverId = item.receiverId || item.reveiveId; // Fallback to 'reveiveId'

        if (!receiverId) {
          console.warn('Missing receiverId in chat item:', item);
          return null; // Skip if no valid receiverId
        }

        try {
          const userDocRef = doc(db, "users", receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        } catch (error) {
          console.error('Error fetching user data:', error);
          return null; // Skip failed user data fetch
        }
      });

      const chatData = (await Promise.all(promises)).filter(chat => chat !== null); // Filter out null values
      setChats(chatData.sort((a, b) => b.updateAt - a.updateAt));
    });

    return () => {
      unSub();
    };
  }, [currentUser.id]);


  // console.log(chats);

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="Search Icon" />
          <input type="text" placeholder="Search" />
        </div>
        <img className="add" src={addMode ? "./minus.png" : "./plus.png"} alt="Toggle Add" onClick={() => setAddMode((state) => !state)} />
      </div>

      <div className="items">
        {
          chats.map((chat, index) => (
            <div 
            className={`item ${selected === index ? 'selected' : ''}`} 
            key={chat.chatId || `chat-${index}`} // Fallback to `index` if `chatId` is missing
            onClick={() => {handleSelectChat(index); handleSelect(chat)}}
            >
              <img src={chat.user.avatar}/>
              <div className="texts">
                <span>{chat.user.username}</span>
                <p>{chat.lastMessage}</p>
              </div>
            </div>
          ))
        }
      </div>
      {
        addMode && <AddUser />
      }
    </div>
  );
};

export default ChatList;
