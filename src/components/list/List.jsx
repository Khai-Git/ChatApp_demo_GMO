import "./List.css";

import UserInfo from "./userInfo/userInfo";
import ChatList from "./chatList/chatLists";

const List = () => {
    return (
        <div className="list">
            <UserInfo />
            <ChatList />
        </div>
    );
}

export default List;