import "./adduser.css";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"; // Use getDocs instead of getDoc
import { db } from "../../../lib/firebase";
import { useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "../../../lib/userStore";

const AddUser = ({ setAddMode }) => {
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false); // New state for tracking when a user is not found
  const [loading, setLoading] = useState(false);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
        setNotFound(false); // Reset not found if user is found
      } else {
        setUser(null);
        setNotFound(true); // Set not found if no user is returned
        toast.warn(`Không thể tìm kiếm bạn bè ${username} hoặc bạn bè không tồn tại`);
      }
    } catch (err) {
      setNotFound(true); // Handle error case as not found
      toast.warn("Đã xảy ra lỗi tìm kiếm")
    } finally {
      setLoading(false)
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatID: newChatRef.id,
          lastMessage: "",
          receiveId: currentUser.id,
          updateAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatID: newChatRef.id,
          lastMessage: "",
          receiveId: user.id,
          updateAt: Date.now(),
        }),
      });

      setAddMode(false);
      toast.success("Thêm bạn bè thành công");
    } catch (err) {
      toast.warn("Lỗi không thể thêm bạn bè");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <div className="search">
          <div className="search-header">
            <img src="./avatar-user.png" alt="" />
            <h4>Thêm bạn bè</h4>
            <button className="btn btn-danger close" onClick={() => setAddMode(false)}>X</button>
          </div>
          <div className="search-adduser">
            <input type="text" placeholder="Tìm kiếm bạn bè..." name="username" required />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>
        {loading && <p>Đang tải...</p>}
        {user && (
          <div className="user">
            <div className="detail">
              <img src={user.avatar || "./avatar.png"} alt="" />
              <span>{user.username}</span>
            </div>
            <button className="btn btn-primary" onClick={handleAdd}>Thêm bạn</button>
          </div>
        )}
        {notFound && !loading && (
          <div className="not-found">
            <p>Không tìm thấy bạn bè.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddUser;
