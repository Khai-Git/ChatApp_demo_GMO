import "./List.css";

import UserInfo from "./userInfo/UserInfo";
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