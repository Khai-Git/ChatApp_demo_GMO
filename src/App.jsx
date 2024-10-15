import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
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
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid); // Fetch user info if authenticated
      } else {
        fetchUserInfo(null); // Set loading to false if no user
      }
    }, (error) => {
      console.error("Error in auth state change:", error);
      fetchUserInfo(null); // Ensure loading is false even on error
    });

    return () => {
      unSub();
    }
  }, [fetchUserInfo]);

  useEffect(() => {
    if (!isLoading && currentUser) {
      // Additional login logic can go here if necessary
    }
  }, [currentUser, isLoading]);

  if (isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List />
            {
              chatId ? (
                // Renders the Chat component with the selected chatId
                <>
                  <Chat key={chatId} />
                  <Detail />
                </>
              ) : (
                // Initially renders a default welcome chat screen
                <Chat key="default" />
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
