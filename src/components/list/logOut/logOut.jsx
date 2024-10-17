import { auth } from "../../lib/firebase";
import "./logout.css";

const LogOut = () => {
    return (
        <div className="logOut">
            <button className="btn btn-outline-danger" onClick={() => auth.signOut()}>Đăng xuất</button>
        </div>
    );
}

export default LogOut;