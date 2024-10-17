## Review

### Luồng chính đăng nhập/đăng xuất, chat giữa các account => OK

### Còn 1 số chổ sửa lại cho hoàn thiện:
1. Sửa format các file `Indent Using Spaces` thành 2
![Alt text](reviewImage/BugFormat.png)

2. Xóa các space dư thừa trong các file
![Alt text](reviewImage/TrimWhitespace.png)

<!-- Login.jsx -->
3. Đăng ký thành công => chưa xóa data form

4. Bug đăng ký tài khoản trùng email hiện hết lỗi từ firebase lên web là chết rồi
![Alt text](reviewImage/BugDangKyTrungEmail.png)

5. Đoạn code này có tác dụng gì?
![Alt text](reviewImage/BugLogin_1.png)

6. Xác nhận mật khẩu trong code không có xử lý => Không cần hiện lên UI làm gì
![Alt text](reviewImage/BugLogin_2.png)

7. Thêm accept chỉ được chọn đuôi file ảnh
![Alt text](reviewImage/BugLogin_3.png)

8. 
- Dời vị trí hiện toast lên trên đầu màn hình, để dưới cuối màn hình hơi khó thấy
- Bắt đúng sự kiện để hiện lỗi lên màn hình => Không hiện lỗi của firebase lên web
Ví dụ như trong ảnh lỗi `INVALID_EMAIL`
=> Tên đăng nhập hoặc mật khẩu không đúng
![Alt text](reviewImage/BugLogin_4.png)

9. Cải thiện mấy cái text để tránh nhầm lẫn giữa tài khoản đăng nhập và tên user hiển thị
- 1. Chổ đăng nhập để text `Email`
- 2. Chổ đăng ký để text `Tên tài khoản`
![Alt text](reviewImage/BugLogin_5.png)

<!-- UserInfo.jsx -->
10. Viết hoa chữ cái đầu, sửa tương tự cho logOut (sửa tên hàm + tên file)
![Alt text](reviewImage/BugCodeConvention_1.png)

<!-- ChatLists.jsx -->
11. 
- Thêm label vào "Danh sách hội thoại" chẳng hạn
- Dấu `+`, `-` này có tác dụng gì (không có label thì cũng phải gắn tooltip giải thích ý nghĩa vô)
![Alt text](reviewImage/BugChatList_1.png)

<!-- AddUser.jsx -->
12. Đặt câu hỏi, xong tự trả lời cho các chức năng mình làm
**Gợi ý:**
- Dialog này có tác dụng gì?
  - Thêm title (giải thích ý nghĩa của dialog) vào header của dialog
  - Thêm nút đóng dialog
- Nút Search có tác dụng gì?
  - Thêm 1 dòng text nhập username để thêm mới cuộc trò chuyện chẳng hạn
  - Khi search không có data => hiển thị không tìm thấy username này
  - Trên UI click vào mà không mở payload thì không biết nó có hoạt động luôn ấy => Gắn màn hình Loading vô khi có thao tác call api

![Alt text](reviewImage/BugChatList_2.png)

13. 
- UI bị lệch giữa 2 button
- Khi thêm thành công => hiện toast thành công, tắt luôn dialog
![Alt text](reviewImage/BugAddUser_1.png)

<!-- Detail.jsx -->
14. Nút `Xóa cuộc trò chuyện` bổ sung thêm dialog `Xác nhận xóa cuộc trò chuyện`, khi click Xóa thì mới call api xóa

15. Vừa đăng nhập vào, không có cuộc hội thoại nào => cục bên phải này ẩn luôn
![Alt text](reviewImage/BugUI_1.png)

16. Bug khi đăng xuất => đăng nhập lại bằng tài khoản khác
[BugLoadDetailChat.webm](reviewImage/BugLoadDetailChat.webm)
[BugLoadDetailChat_2.webm](reviewImage/BugLoadDetailChat_2.webm)
