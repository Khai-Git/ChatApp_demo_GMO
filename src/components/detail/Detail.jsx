import "./Detail.css";

import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { arrayRemove } from "firebase/firestore";
import { db } from "../lib/firebase";
import useChatStore from "../lib/chatStore";
import useUserStore from "../lib/userStore";
import upload from "../lib/upload";

const Detail = () => {
    const [showPhotos, setShowPhotos] = useState(false);
    const [media, setMedia] = useState([]);

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();

    useEffect(() => {
        if (!chatId) return;

        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            const chatData = res.data();
            setMedia(chatData?.media || []); // Set media from Firestore
        });

        return () => unSub();
    }, [chatId]);

    const handleTogglePhotos = () => {
        setShowPhotos((prevState) => !prevState);
    }

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {

            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });

            changeBlock();

        } catch (err) {
            console.log(err);
            toast.warn(err.message)

        }
    }

    const handleDeleteConversation = async () => {
        if (!chatId || !currentUser || !user) return;

        const userChatsRef = doc(db, "userchats", currentUser.id);
        const receiverChatsRef = doc(db, "userchats", user.id);

        try {
            // Remove chat from the current user's chat list
            await updateDoc(userChatsRef, {
                chats: arrayRemove({ chatID: chatId })
            });

            // Remove chat from the receiver's chat list
            await updateDoc(receiverChatsRef, {
                chats: arrayRemove({ chatID: chatId })
            });

            // Optionally delete the entire chat document from the chats collection
            await deleteDoc(doc(db, "chats", chatId));

            toast.success("Conversation deleted successfully!");

        } catch (err) {
            console.log("Error deleting conversation:", err);
            toast.warn("Failed to delete conversation.");
        }
    }

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar} alt="" />
                <h4>{user?.username}</h4>
            </div>
            <div className="info">
                <div className="quick-option">
                    <div className="title">
                        <i className="bi bi-bell"></i>
                        <span>Thông báo</span>
                    </div>
                    <div className="title">
                        <i className="bi bi-pin-angle"></i>
                        <span>Ghim hội thoại</span>
                    </div>
                    <div className="title">
                        <i className="bi bi-person-fill-add"></i>
                        <span>Thêm người vào hội thoại</span>
                    </div>
                </div>

                <div className="option">
                    <div className="title" onClick={handleTogglePhotos}>
                        <span>Ảnh/ Video</span>
                        <i className={`bi bi-caret-right ${showPhotos ? 'rotate' : ''}`}></i>
                    </div>

                    {showPhotos && (
                        <div className="photos">
                            {media.map((photoUrl, index) => (
                                <div className="photoItem" key={index}>
                                    <img src={photoUrl} alt={`media-${index}`} />
                                </div>
                            ))}
                        </div>
                    )}
                    {/* <div className={`photos ${showPhotos ? 'show' : ''}`}>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                            </div>
                        </div>
                    </div> */}
                </div>
                <button type="button" className="btn btn-outline-danger block-User" onClick={handleBlock}>
                    {
                        isCurrentUserBlocked ? "Bạn đã bị chặn" : isReceiverBlocked ? "Người dùng đã bị chặn " : "Chặn người dùng"
                    }
                </button>
                <button type="button" className="btn btn-outline-danger delete-User" onClick={handleDeleteConversation}>
                    Xóa cuộc trò chuyện
                </button>
            </div>
        </div>
    );
}

export default Detail;
