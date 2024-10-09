import "./adduser.css";

const AddUser = () => {
    return (
        <div className="addUser">
            <form>
                <input type="text" placeholder="Username" name="username" />
                <button className="btn btn-primary">Search</button>
            </form>
            <div className="user">
                <div className="detail">
                    <img src="./avatar.png" alt="" />
                    <span>Jane Doe</span>
                </div>
                <button className="btn btn-primary">Add User</button>
            </div>
        </div>
    )
}

export default AddUser;