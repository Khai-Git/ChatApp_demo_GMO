import { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../lib/firebase";
import Upload from "../lib/upload";
import { doc, setDoc } from "firebase/firestore";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import "./signin.css";
import "./signup.css";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });
    const [isSignup, setIsSignup] = useState(true);

    const handleAvatar = e => {
        setAvatar({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
    }

    const handleLogin = async e => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);

        if (!email || !password) {
            toast.warn("Please fill in both email and password.");
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Đăng nhập thành công")
        } catch (err) {
            toast.warn(err.message)
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);

        const { email, username, password } = Object.fromEntries(formData);
        // console.log(username);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            let imgURL = './default-avatar.png'; // Default avatar URL if none is uploaded

            // Check if an avatar file is selected
            if (avatar.file) {
                imgURL = await Upload(avatar.file);
            }

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgURL,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });

            toast.success("Đăng ký thành công")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    const toggleSignup = () => {
        setIsSignup(!isSignup);
    };

    return (
        <div className="login">
            {
                isSignup ? (
                    <div className="signin">
                        <div className="header">
                            <img src="./favicon.png" alt="" />
                        </div>
                        <div className="main">
                            <div className="title">
                                <h2>Chào mừng</h2>
                            </div>
                            <form className="input" onSubmit={handleLogin}>
                                <input type="text" name="email" placeholder="Tên đăng nhập" required />
                                <input type="password" name="password" placeholder="Mật khẩu" required />
                                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Loading" : "Đăng nhập"}</button>
                            </form>
                        </div>
                        <div className="footer">
                            <div className="submit">
                                <hr />
                                <button className="btn btn-success" onClick={toggleSignup} disabled={loading}>{loading ? "Loading" : "Đăng ký"}</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="signup">
                        <div className="header">
                            <h1>Tạo tài khoản</h1>
                        </div>
                        <div className="main">
                            <form className="formSignup" onSubmit={handleRegister}>
                                <label>Tên đăng nhập</label>
                                <input type="text" name="username" placeholder="Nhập tên đăng nhập*" required />
                                <label>Email</label>
                                <input type="email" name="email" placeholder="Nhập email*" required />
                                <label>Mật khẩu</label>
                                <input type="password" name="password" placeholder="Nhập mật khẩu*" required />
                                <label>Xác nhận mật khẩu</label>
                                <input type="password" name="confirm_password" placeholder="Xác nhận lại mật khẩu" required />
                                <label className="uploadImg">
                                    <label htmlFor="file">
                                        <img src={avatar.url || "./avatar.png"} alt="" />
                                    </label>
                                    <label htmlFor="file">
                                        <p>Chọn ảnh</p>
                                    </label>
                                </label>
                                <input type="file" id="file" onChange={handleAvatar} style={{ display: "none" }} />
                                <button type="submit" className="btn btn-success" disabled={loading}>{loading ? "Loading" : "Đăng ký"}</button>
                            </form>
                        </div>
                        <div className="footer">
                            <p>Đã có tài khoản ?  <a onClick={toggleSignup} disabled={loading}>{loading ? "Loading" : "Đăng nhập"}</a></p>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Login;