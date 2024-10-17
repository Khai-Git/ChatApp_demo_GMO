import "./Detail.css";
import ConfirmDialog from "./ConfirmDialog/ConfirmDialog";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { arrayUnion, doc, onSnapshot, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { arrayRemove } from "firebase/firestore";
import { db } from "../lib/firebase";
import useChatStore from "../lib/chatStore";
import useUserStore from "../lib/userStore";

const Detail = ({ handleConversationDeleted }) => {
  const [showPhotos, setShowPhotos] = useState(false);
  const [media, setMedia] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State to control dialog visibility

  const { chatId, setChatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const chatData = res.data();
      setMedia(chatData?.media || []);
    });

    return () => unSub();
  }, [chatId]);

  useEffect(() => {
    setIsBlocked(isReceiverBlocked);
  }, [isReceiverBlocked]);

  const handleTogglePhotos = () => {
    setShowPhotos((prevState) => !prevState);
  };

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      if (isBlocked) {
        // Unblock user
        await updateDoc(userDocRef, {
          blocked: arrayRemove(user.id),
        });
        toast.success("Người dùng đã được bỏ chặn!");
        setIsBlocked(false);
      } else {
        // Block user
        await updateDoc(userDocRef, {
          blocked: arrayUnion(user.id),
        });
        toast.success("Người dùng đã bị chặn!");
        setIsBlocked(true);
      }

      await changeBlock();

    } catch (err) {
      console.log(err);
      toast.warn(err.message);
    }
  };

  const handleDeleteConversation = async () => {
    if (!chatId || !currentUser || !user) return;

    const currentUserChatsRef = doc(db, "userchats", currentUser.id);
    const receiverChatsRef = doc(db, "userchats", user.id);

    const currentUserSnapshot = await getDoc(currentUserChatsRef);
    const receiverUserSnapshot = await getDoc(receiverChatsRef);

    if (currentUserSnapshot.exists()) {
      const updatedChats = currentUserSnapshot.data().chats.filter(chat => chat.chatID !== chatId);
      await updateDoc(currentUserChatsRef, { chats: updatedChats });
    }

    if (receiverUserSnapshot.exists()) {
      const updatedChats = receiverUserSnapshot.data().chats.filter(chat => chat.chatID !== chatId);
      await updateDoc(receiverChatsRef, { chats: updatedChats });
    }

    await deleteDoc(doc(db, "chats", chatId));

    toast.success("Cuộc trò chuyện đã được xóa thành công!");
    setChatId(null);
    handleConversationDeleted(chatId);

  };

  const openDeleteConfirmDialog = () => {
    setShowConfirmDialog(true);
  };

  const closeDeleteConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const confirmDeleteConversation = () => {
    handleDeleteConversation();
    closeDeleteConfirmDialog();
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar-user.png"} alt="" />
        <h4>{user?.username || "Unknown User"}</h4>
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

          <div className={`photos ${showPhotos ? 'show' : ''}`}>
            {media.map((photoUrl, index) => (
              <div className="photoItem" key={index}>
                <img src={photoUrl} alt={`media-${index}`} />
              </div>
            ))}
          </div>
        </div>

        {!isCurrentUserBlocked && (
          <button
            type="button"
            className="btn btn-outline-danger block-User"
            onClick={handleBlock}
          >
            {isBlocked ? "Bỏ chặn người dùng" : "Chặn người dùng"}
          </button>
        )}

        <button
          type="button"
          className="btn btn-outline-danger delete-User"
          onClick={openDeleteConfirmDialog}
        >
          Xóa cuộc trò chuyện
        </button>
      </div>

      {showConfirmDialog && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?"
          onConfirm={confirmDeleteConversation}
          onCancel={closeDeleteConfirmDialog}
        />
      )}
    </div>
  );
};

export default Detail;
