import "./Detail.css";
import { useState } from 'react';

const Detail = () => {
    const [showPhotos, setShowPhotos] = useState(false);

    const handleTogglePhotos = () => {
        setShowPhotos(prevState => !prevState);
    }

    return (
        <div className="detail">
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h4>Kelvin</h4>
            </div>
            <div className="info">
                <div className="quick-option">
                    <div className="title">
                        <i className="bi bi-bell"></i>
                        <span>Thông báo</span>
                    </div>
                    <div className="title">
                        <i className="bi bi-pin-angle"></i>
                        <span>Ghim hội thoại</span>
                    </div>
                    <div className="title">
                        <i className="bi bi-person-fill-add"></i>
                        <span>Thêm người vào hội thoại</span>
                    </div>
                </div>
                
                <div className="option">
                    <div className="title" onClick={handleTogglePhotos}>
                        <span>Ảnh/ Video</span>
                        <i className={`bi bi-caret-right ${showPhotos ? 'rotate' : ''}`}></i>
                    </div>

                    <div className={`photos ${showPhotos ? 'show' : ''}`}>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                                <img src="./bg.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>File</span>
                        <i className="bi bi-caret-right"></i>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Link</span>
                        <i className="bi bi-caret-right"></i>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Thiết lập bảo mật</span>
                        <i className="bi bi-caret-right"></i>
                    </div>
                </div>
                <button type="button" className="btn btn-outline-danger block-User">Chặn người dùng</button>
            </div>
        </div>
    );
}

export default Detail;
