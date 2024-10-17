import React, { useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LogIn from "./components/login/Login";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Notification from './components/notification/Notification';

import { auth } from "./components/lib/firebase";
import useUserStore from "./components/lib/userStore";
import useChatStore from './components/lib/chatStore';

const App = () => {

  const { currentUser, isLoading, fetchUserInfo, setCurrentUser } = useUserStore();
  const { chatId, setChatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, fetch their information
        fetchUserInfo(user.uid);
      } else {
        // User is logged out, reset chatId and sign them out
        setChatId(null); // Reset chatId when user logs out
        await signOut(auth);
        fetchUserInfo(null);
      }
    }, () => {
      // Handle errors by ensuring user info and chatId are reset
      fetchUserInfo(null);
      setChatId(null); // Reset chatId on error
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo, setChatId]);

  const handleConversationDeleted = (deletedChatId) => {
    console.log(`Cuộc trò chuyện với chatID ${deletedChatId} đã bị xóa.`);
    setChatId(null); // Reset chatId after deleting conversation
  };

  if (isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List handleConversationDeleted={handleConversationDeleted} />

          {chatId ? (
            <>
              <Chat key={chatId} />
              <Detail handleConversationDeleted={handleConversationDeleted} />
            </>
          ) : (
            <div className="no-chat-selected"></div>
          )}
        </>
      ) : (
        <LogIn />
      )}
      <Notification />
    </div>
  );
}

export default App;
