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
        user,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    //Check is ReceiverBlocked
    else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
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
  changeBlock: async () => {
    const currentUser = useUserStore.getState().currentUser;

    set(async (state) => {
      const newBlockedStatus = !state.isReceiverBlocked;

      try {
        if (newBlockedStatus) {
          // Add receiver to current user’s blocked list
          await updateDoc(doc(db, "users", currentUser.id), {
            blocked: arrayUnion(state.user.id), // Assuming user.id is the blocked user's ID
          });
          toast.warn("Người dùng đã bị chặn.");
        } else {
          // Remove receiver from current user’s blocked list
          await updateDoc(doc(db, "users", currentUser.id), {
            blocked: arrayRemove(state.user.id),
          });
          toast.success("Người dùng đã tháo chặn.");
        }

        return {
          ...state,
          isReceiverBlocked: newBlockedStatus,
        };
      } catch (error) {
        console.error(err);
        toast.error("Có lỗi xảy ra khi thay đổi trạng thái chặn.");
        return state;
      }
    });
  },
  setChatId: (chatId) => set({ chatId }),
}));

export default useChatStore;
