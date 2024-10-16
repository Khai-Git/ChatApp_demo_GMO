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

  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchUserInfo(user.uid);
      } else {
        await signOut(auth);
        fetchUserInfo(null);
      }
    }, (error) => {
      console.error("Error in auth state change:", error);
      fetchUserInfo(null);
    });

    return () => {
      unSub();
    }
  }, [fetchUserInfo]);

  const handleConversationDeleted = (deletedChatId) => {
    console.log(`Cuộc trò chuyện với chatID ${deletedChatId} dã bị xóa.`);
  };

  if (isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List handleConversationDeleted={handleConversationDeleted} />
            {
              chatId ? (
                <>
                  <Chat key={chatId} />
                  <Detail handleConversationDeleted={handleConversationDeleted} />
                </>
              ) : (
                <>
                  <Chat key="default" />
                  <Detail />
                </>
              )
            }
          </>
        ) : (
          <LogIn />
        )
      }
      <Notification />
    </div>
  );
}

export default App;
