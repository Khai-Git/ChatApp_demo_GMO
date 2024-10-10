import "./Chat.css";

import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import useChatStore from "../lib/chatStore";

import EmojiPicker from "emoji-picker-react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Chat = () => {
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    const { chatId } = useChatStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [text]);

    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, "chats", chatId), (res) => {
                setChat(res.data())
            }
        )

        return () => {
            unSub();
        };
    }, [chatId])

    // console.log(chat);

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
                {chat?.message?.map((message) => (
                    <div className="message user" key={message?.createAt}>
                        <div className="textAndTime">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                            {/* <span>{message || "1 min ago"}</span> */}
                        </div>
                    </div>
                ))}
                {/* {chat.message.map((message) => (
                    <div className="message">
                        <div className="avatar">
                            <img src="./avatar.png" alt="" />
                        </div>
                        <div className="textAndTime">
                            <p>Lorem ipsum dolor</p>
                            <span>1 min ago</span>
                        </div>
                    </div>
                ))} */}

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