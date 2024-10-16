import { useEffect, useRef, useState } from "react";
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../lib/firebase";
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
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [showDetail, setShowDetail] = useState(false);
    const [img, setImg] = useState({
        file: null,
        url: "",
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const { currentUser } = useUserStore();

    // Reference for scrolling to the bottom
    const endRef = useRef(null);

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                setIsLoggedIn(true);
            } else {
                // User is not logged in
                setIsLoggedIn(false);
            }
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, []);

    // Listen for chat messages only when chatId is set
    useEffect(() => {
        if (!chatId) {
            setChat(null); // Reset chat when no chat is selected
            return;
        }

        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            const chatData = res.data();
            // Check if there are new messages
            if (chatData?.messages?.length > chat?.messages?.length) {
                const newMessages = chatData.messages.slice(chat?.messages?.length);
                
                // Loop through new messages and trigger notification for each
                newMessages.forEach((message) => {
                    // Check if the new message is from the other user (not the current user)
                    if (message.senderId !== currentUser.id) {
                        // Trigger a notification toast
                        toast.info(`Bạn có tin nhắn từ ${user?.username}`);
                        console.log(`Bạn có tin nhắn từ ${user?.username}`);
                        
                    }
                });
            }

            setChat(res.data());
        }, (err) => {
            toast.error("Error fetching chat: " + err.message);
            console.error(err);
        });

        return () => unSub();
    }, [chatId]);

    const scrollToBottom = (delay = 2000) => {
        setTimeout(() => {
            endRef.current?.scrollIntoView({ behavior: "smooth" });
        }, delay);
    };

    useEffect(() => {
        if (chat?.messages) {
            scrollToBottom(); // Immediately scroll to the bottom
        }
    }, [chat?.messages]);

    const handleEmoji = (e) => {
        setText((state) => state + e.emoji);
        // setOpen(false);
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

            scrollToBottom(); // Scroll immediately after sending

        } catch (err) {
            toast.warn(err.message);
            console.error(err);
        }
    };

    // Render login prompt if the user is not logged in
    if (!isLoggedIn) {
        return <div className="chat">Please log in to access the chat</div>;
    }


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
                        <img
                            src={user?.blocked?.includes(currentUser.id) ? "./avatar-user.png" : user?.avatar || "./avatar-user.png"}
                            alt="User Avatar"
                        />
                    </div>
                    <div className="texts">
                        <span>{user?.blocked?.includes(currentUser.id) ? "User" : user?.username || "Unknown User"}</span>
                        <div className="status-icon">
                            <i
                                className="bi bi-circle-fill"
                                style={{ color: user?.isOnline ? "green" : "gray" }}
                            ></i>
                            <span>{user?.isOnline ? "Online" : "Offline"}</span>
                        </div>
                    </div>
                </div>
                {/* <div className="icons">
                    <i className="bi bi-telephone"></i>
                    <i className="bi bi-camera-video"></i>
                    <i
                        className="bi bi-info-circle"
                        onClick={() => setShowDetail((prev) => !prev)}
                    ></i>
                </div> */}
            </div>


            <div className="main">
                {chat?.messages?.map((message, index) => {
                    if (message.senderId === user.id && isReceiverBlocked) {
                        return null;
                    }
                    if (message.senderId === currentUser.id && isCurrentUserBlocked) {
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

                <div ref={endRef}></div> {/* This is the element to scroll to */}
            </div>

            <div className="footer">
                <div className="icons">
                    <label htmlFor="file">
                        <img
                            src="./img.png"
                            alt=""
                            style={{ opacity: isCurrentUserBlocked || isReceiverBlocked ? 0.5 : 1, pointerEvents: isCurrentUserBlocked || isReceiverBlocked ? 'none' : 'auto' }}
                        />
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleImg}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    />
                    <img
                        src="./camera.png"
                        alt=""
                        style={{ opacity: isCurrentUserBlocked || isReceiverBlocked ? 0.5 : 1, pointerEvents: isCurrentUserBlocked || isReceiverBlocked ? 'none' : 'auto' }}
                    />
                    <img
                        src="./mic.png"
                        alt=""
                        style={{ opacity: isCurrentUserBlocked || isReceiverBlocked ? 0.5 : 1, pointerEvents: isCurrentUserBlocked || isReceiverBlocked ? 'none' : 'auto' }}
                    />
                </div>
                <input
                    type="text"
                    placeholder={isCurrentUserBlocked || isReceiverBlocked ? "Bạn không thể nhập tin nhắn" : "Nhập tin nhắn ..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className="emoji">
                    <img
                        src="./emoji.png"
                        alt=""
                        onClick={() => {
                            if (!isCurrentUserBlocked && !isReceiverBlocked) {
                                setOpen((state) => !state);
                            }
                        }}
                        style={{
                            opacity: isCurrentUserBlocked || isReceiverBlocked ? 0.5 : 1,
                            pointerEvents: isCurrentUserBlocked || isReceiverBlocked ? 'none' : 'auto',
                        }}
                    />
                    {open && !isCurrentUserBlocked && !isReceiverBlocked && ( // Ensure the emoji picker is shown only when not blocked
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
