import "./List.css";

import UserInfo from "./userInfo/userInfo";
import ChatList from "./chatList/chatLists";
import LogOut from "./logOut/logOut";

const List = () => {
    return (
        <div className="list">
            <UserInfo />
            <ChatList />
            <LogOut />
        </div>
    );
}

export default List;