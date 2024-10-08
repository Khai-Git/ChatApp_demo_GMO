import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../src/components/lib/firebase";
import useUserStore from "../src/components/lib/userStore"; // default import

import LogIn from "./components/login/Login";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Notification from './components/notification/Notification';
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

  // console.log(currentUser);
  

  if (isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (<LogIn />)
      }

      <Notification />
    </div>
  )
}

export default App