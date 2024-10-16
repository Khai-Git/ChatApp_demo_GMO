import "./List.css";

import UserInfo from "./userInfo/userInfo";
import ChatList from "./chatList/ChatLists";
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