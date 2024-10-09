import React, { useState } from "react";

import "./chatList.css";
import AddUser from "./addUser/AddUser";

const ChatList = () => {
  const [selected, setSelected] = useState(null);
  const [addMode, setAddMode] = useState(false);

  const handleSelect = (index) => {
    setSelected(index);
  };

  const chatItems = [
    { id: 1, img: "./avatar.png", name: 'Kelvin Klein', message: 'Hello' },
    { id: 2, img: "./avatar.png", name: 'Pam Beesly', message: 'Just checking in.' },
    { id: 3, img: "./avatar.png", name: 'Jim Halpert', message: 'Sounds good!' },
    { id: 4, img: "./avatar.png", name: 'Dwight Schrute', message: 'Question!' },
    { id: 5, img: "./avatar.png", name: 'Angela Martin', message: 'On my way.' },
    { id: 6, img: "./avatar.png", name: 'Ryan Howard', message: 'Let’s talk later.' },
    { id: 7, img: "./avatar.png", name: 'Kelly Kapoor', message: 'OMG, guess what?' },
    { id: 8, img: "./avatar.png", name: 'Stanley Hudson', message: 'Not now.' },
    { id: 9, img: "./avatar.png", name: 'Oscar Martinez', message: 'Looking forward to it.' },
    { id: 10, img: "./avatar.png", name: 'Phyllis Vance', message: 'Sounds perfect!' },
  ];

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="Search Icon" />
          <input type="text" placeholder="Search" />
        </div>
        <img className="add" src={addMode ? "./minus.png" : "./plus.png"} alt="Toggle Add" onClick={() => setAddMode((state)=>!state)} />
      </div>

      <div className="items">
        {chatItems.map((item, index) => (
          <div
            key={item.id}
            className={`item ${selected === index ? 'selected' : ''}`}
            onClick={() => handleSelect(index)}
          >
            <img src={item.img} alt="Profile" />
            <div className="texts">
              <span>{item.name}</span>
              <p>{item.message}</p>
            </div>
          </div>
        ))}
      </div>
      {
        addMode && <AddUser />
      }
    </div>
  );
};

export default ChatList;
