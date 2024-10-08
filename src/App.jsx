import React, { useEffect } from 'react';

import SignIn from "./components/login/Signin";
import SignUp from "./components/login/Signup";

import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";

const App = () => {

  const user = true;

  return (
    <div className='container'>
      {
        user ? (
          <SignIn />
          // <>
          //   <List />
          //   <Chat />
          //   <Detail />
          // </>
        ) : (<SignUp />)
      }

    </div>
  )
}

export default App