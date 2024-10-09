import React, { useEffect } from 'react';

import SignIn from "./components/login/Signin";

import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Notification from './components/notification/Notification';

const App = () => {

  const user = false;

  return (
    <div className='container'>
      {
        user ? (
          // <SignIn />
          <>
            <List />
            <Chat />
            <Detail />
          </>
        ) : (<SignIn />)
      }

      <Notification />
    </div>
  )
}

export default App