import { useState } from "react";
import "./chatList.css";

const chatList = () => {
    const [addMode, setAddMode] = useState(false);
    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" />
                </div>
                <img className="add" src={addMode ? "./minus.png" : "./plus.png"} alt="" onClick={() => setAddMode((state) => !state)} />
            </div>
            
            <div className="item">
              <img src="./avatar.png" alt="" />
              <div className="texts">
                <span>Kelvin Klein</span>
                <p>Hello</p>
              </div>
            </div>
            <div className="item">
              <img src="./avatar.png" alt="" />
              <div className="texts">
                <span>Kelvin Klein</span>
                <p>Hello</p>
              </div>
            </div>
            <div className="item">
              <img src="./avatar.png" alt="" />
              <div className="texts">
                <span>Kelvin Klein</span>
                <p>Hello</p>
              </div>
            </div>
            <div className="item">
              <img src="./avatar.png" alt="" />
              <div className="texts">
                <span>Kelvin Klein</span>
                <p>Hello</p>
              </div>
            </div>
            <div className="item">
              <img src="./avatar.png" alt="" />
              <div className="texts">
                <span>Kelvin Klein</span>
                <p>Hello</p>
              </div>
            </div>
        </div>
    );
}

export default chatList;