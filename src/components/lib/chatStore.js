import { toast } from "react-toastify";
import { create } from "zustand";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "./firebase";
import useUserStore from "./userStore";

const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    //Check is CurrentUserBlocked
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    //Check is ReceiverBlocked
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },
  // changeBlock: () => {
  //   set((state) => ({
  //     ...state,
  //     isReceiverBlocked: !state.isReceiverBlocked,
  //   }));
  // },
  changeBlock: async () => {
    const currentUser = useUserStore.getState().currentUser;

    set(async (state) => {
        const newBlockedStatus = !state.isReceiverBlocked;

        if (newBlockedStatus) {
            // Add receiver to current user’s blocked list
            await updateDoc(doc(db, "users", currentUser.id), {
                blocked: arrayUnion(state.user.id), // Assuming user.id is the blocked user's ID
            });
            toast.warn("User blocked.");
        } else {
            // Remove receiver from current user’s blocked list
            await updateDoc(doc(db, "users", currentUser.id), {
                blocked: arrayRemove(state.user.id),
            });
            toast.success("User unblocked.");
        }

        return {
            ...state,
            isReceiverBlocked: newBlockedStatus,
        };
    });
},

}));

export default useChatStore;
