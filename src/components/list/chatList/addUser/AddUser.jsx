import "./adduser.css";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"; // Use getDocs instead of getDoc
import { db } from "../../../lib/firebase";
import { useState } from "react";
import { toast } from "react-toastify";
import useUserStore from "../../../lib/userStore";

const AddUser = () => {
    const [user, setUser] = useState(null);

    const { currentUser } = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username)); // Create a query
            const querySnapShot = await getDocs(q); // Use getDocs to fetch the results

            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data()); // Set the user data
            } else {
                setUser(null); // Handle the case where no user is found
            }
        } catch (err) {
            // console.log(err.message);
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

            // console.log(newChatRef.id);
            
        } catch (err) {
            toast.warn(err.message)
        }
    }

    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <div className="search">
                    <input type="text" placeholder="Username" name="username" required />
                    <button className="btn btn-primary">Search</button>
                </div>
                {user && (
                    <div className="user">
                        <div className="detail">
                            <img src={user.avatar || "./avatar.png"} alt="" />
                            <span>{user.username}</span>
                        </div>
                        <button className="btn btn-primary" onClick={handleAdd}>Add User</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddUser;
