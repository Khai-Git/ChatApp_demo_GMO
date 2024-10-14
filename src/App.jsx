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
        // If not logged in, make sure isLoading is false
        fetchUserInfo(null);
      }
    }, (error) => {
      console.error("Error in auth state change:", error);
      // Ensure loading state is false even if there's an error
      fetchUserInfo(null);
    });

    return () => {
      unSub();
    }
  }, [fetchUserInfo]);  

  if (isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List />
            {
              chatId && (
                <>
                  <Chat />
                  <Detail />
                </>
              )
            }
          </>
        ) : (<LogIn />)
      }

      <Notification />
    </div>
  )
}

export default App