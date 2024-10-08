import "./Chat.css";

import EmojiPicker from "emoji-picker-react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useRef, useState } from "react";

const Chat = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [text]);

    const handleEmoji = (e) => {
        setText((state) => state + e.emoji);
        setOpen(false);
    }

    return (
        <div className="chat">
            <div className="header">
                <div className="user">
                    <div className="avatar-user">
                        <img src="./avatar.png" alt="" />
                    </div>
                    <div className="texts">
                        <span>Kelvin</span>
                        <span className="status-icon online">
                            <i className="bi bi-circle-fill"></i>
                            <span>Đang online</span>
                        </span>
                    </div>
                </div>
                <div className="icons">
                    <i className="bi bi-telephone"></i>
                    <i className="bi bi-camera-video"></i>
                    <i className="bi bi-info-circle"></i>
                </div>
            </div>

            <div className="main">
                <div className="message">
                    <div className="avatar">
                        <img src="./avatar.png" alt="" />
                    </div>
                    <div className="textAndTime">
                        <p>Lorem ipsum dolor</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message user">
                    <div className="textAndTime">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Facere tempora nesciunt quibusdam! Dolorum repellat maxime ratione nulla. Hic molestias excepturi sint dolor ab odit nam, quis sapiente quam repudiandae itaque!</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <div className="avatar">
                        <img src="./avatar.png" alt="" />
                    </div>
                    <div className="textAndTime">
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message user">
                    <div className="textAndTime">
                        <img src="./bg.jpg" alt="" />
                        <p>Lorem </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div ref={endRef}></div>
            </div>

            <div className="footer">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder="Nhập tin nhắn... " value={text} onChange={e => setText(e.target.value)} />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((state) => !state)} />
                    <div className="pickEmo">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton btn btn-outline-primary">
                    <i className="bi bi-send"></i>
                </button>
            </div>
        </div>
    );
}

export default Chat;