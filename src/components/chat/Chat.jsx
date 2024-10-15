import { useEffect, useRef, useState } from "react";
import { arrayUnion, arrayRemove, doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";
import useChatStore from "../lib/chatStore";
import useUserStore from "../lib/userStore";
import upload from "../lib/upload";
import EmojiPicker from "emoji-picker-react";

import ChatDetail from "../detail/Detail";

import "./Chat.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Chat = () => {
    const [chat, setChat] = useState(null);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [showDetail, setShowDetail] = useState(false);
    const [img, setImg] = useState({
        file: null,
        url: "",
    });

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();

    const endRef = useRef(null);

    // Listen for chat messages only when chatId is set
    useEffect(() => {
        if (!chatId) {
            setChat(null); // Reset chat when no chat is selected
            return;
        }

        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        }, (err) => {
            toast.error("Error fetching chat: " + err.message);
            console.error(err);
        });

        return () => unSub();
    }, [chatId]);

    // Scroll to the last message when the user selects a chat (chatId changes)
    useEffect(() => {
        if (chatId && chat) {
            const timer = setTimeout(() => {
                endRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [chatId, chat]);

    const handleEmoji = (e) => {
        setText((state) => state + e.emoji);
        setOpen(false);
    };

    const handleImg = async (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file); // For preview in chat before upload completes
            setImg({ file, url });

            try {
                // Upload the image to storage
                const imgURL = await upload(file);

                // Update Firestore with the new image in the messages array
                await updateDoc(doc(db, "chats", chatId), {
                    messages: arrayUnion({
                        senderId: currentUser.id,
                        text: "", // No text, just the image
                        createAt: new Date(),
                        img: imgURL,
                    }),
                    media: arrayUnion(imgURL) // Add the image to the media array
                });

                setImg({ file: null, url: "" }); // Reset image state after upload
            } catch (err) {
                toast.warn(err.message);
                console.error(err);
            }
        }
    };

    const handleSend = async () => {
        if (text === "" || isCurrentUserBlocked || isReceiverBlocked) return;

        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createAt: new Date(),
                }),
            });

            const userIds = [currentUser.id, user.id];

            for (const id of userIds) {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatID === chatId);

                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = text;
                        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                        userChatsData.chats[chatIndex].updateAt = Date.now();

                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    }
                }
            }

            setText("");
        } catch (err) {
            toast.warn(err.message);
            console.error(err);
        }
    };

    // Render Placeholder when no chat is selected
    if (!chatId) {
        return (
            <div className="chat"></div>
        );
    }

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
                    <i className="bi bi-info-circle" onClick={() => setShowDetail(prev => !prev)}></i>
                </div>
            </div>

            <div className="main">
                {chat?.messages?.map((message, index) => {
                    // Check blocking conditions
                    if (message.senderId === user.id && isReceiverBlocked) {
                        // Don't display messages from blocked user
                        return null;
                    }
                    if (message.senderId === currentUser.id && isCurrentUserBlocked) {
                        // Don't display messages from current user if blocked
                        return null;
                    }

                    return (
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
                    );
                })}

                <div style={{ display: "none" }}>
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
                    placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message" : "Type a message ..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((state) => !state)} />
                    {open && (
                        <div className="pickEmo">
                            <EmojiPicker onEmojiClick={handleEmoji} />
                        </div>
                    )}
                </div>
                <button className="sendButton btn btn-outline-primary" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
                    <i className="bi bi-send"></i>
                </button>
            </div>
            {showDetail && <ChatDetail user={user} onClose={() => setShowDetail(false)} />}
        </div>
    );
};

export default Chat;
