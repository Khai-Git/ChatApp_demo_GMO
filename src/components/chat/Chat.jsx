import "./Chat.css";

import { useEffect, useRef, useState } from "react";
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";
import useChatStore from "../lib/chatStore";
import useUserStore from "../lib/userStore";
import upload from "../lib/upload";
import EmojiPicker from "emoji-picker-react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Chat = () => {
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: "",
    });

    const { chatId, user } = useChatStore();
    const { currentUser } = useUserStore();

    const endRef = useRef(null);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleEmoji = (e) => {
        setText((state) => state + e.emoji);
        setOpen(false);
    };

    const handleImg = async (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);

            // Show the image preview immediately
            setImg({ file, url });

            try {
                // Upload the image immediately
                const imgURL = await upload(file);

                // Automatically send the image after upload
                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        senderId: currentUser.id,
                        text: "", // No text, only image
                        createAt: new Date(),
                        img: imgURL,
                    }),
                });

                // Clear the image state after it's sent
                setImg({
                    file: null,
                    url: "",
                });
            } catch (err) {
                toast.warn(err.message);
                console.error(err);
            }
        }
    };

    const handleSend = async () => {
        if (text === "") return;

        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createAt: new Date(),
                }),
            });

            const userIds = [currentUser.id, user.id];

            userIds.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatID === chatId);

                    if (chatIndex !== -1) { // Ensure the chat exists
                        userChatsData.chats[chatIndex].lastMessage = text;
                        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                        userChatsData.chats[chatIndex].updateAt = Date.now();

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    }
                }
            });

            setText(""); // Clear the input after sending the message
        } catch (err) {
            toast.warn(err.message);
            console.log(err);
        }
    };

    return (
        <div className="chat">
            <div className="header">
                <div className="user">
                    <div className="avatar-user">
                        <img src={user.avatar} alt="" />
                    </div>
                    <div className="texts">
                        <span>{user.username || "Unknown User"}</span>
                        <span className="status-icon online">
                            <i className="bi bi-circle-fill"></i>
                            <span>Online</span>
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
                {chat?.messages?.map((message, index) => (
                    <div
                        className={message.senderId === currentUser.id ? "message user" : "message other"}
                        key={index}
                    >
                        <div className="textAndTime">
                            {message.img && <img src={message.img} alt="Attached" />}
                            <p>{message.text}</p>
                            <span>{new Date(message.createAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                        </div>
                    </div>
                ))}
                <div style={{display: "none"}}>
                    {img.url && (
                        <div className="message user">
                            <div className="textAndTime">
                                <img src={img.url} alt="Preview" />
                            </div>
                        </div>
                    )}
                </div>

                <div ref={endRef}></div>
            </div>

            <div className="footer">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    placeholder="Enter a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((state) => !state)} />
                    {open && (
                        <div className="pickEmo">
                            <EmojiPicker onEmojiClick={handleEmoji} />
                        </div>
                    )}
                </div>
                <button className="sendButton btn btn-outline-primary" onClick={handleSend}>
                    <i className="bi bi-send"></i>
                </button>
            </div>
        </div>
    );
};

export default Chat;
