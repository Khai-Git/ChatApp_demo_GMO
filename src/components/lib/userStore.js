import { toast } from "react-toastify";
import { create } from "zustand";
import { doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }

    try {
      const docRef = doc(db, "users", uid); // Correct usage of doc
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      toast.warn(err.message);
      set({ currentUser: null, isLoading: false }); // Ensure isLoading is set to false
    }
  },
}));

export default useUserStore;
