# test_mini_trello
## Giới thiệu
Project mini Trello sử dụng Firebase và gửi email qua SMTP. Đây là project demo, bạn cần cấu hình các biến môi trường để chạy được.

## Cài đặt

1. Clone repo:
   git clone https://github.com/lebaotrang/test_mini_trello.git
   cd test_mini_trello

2. Tạo file .env trong thư mục gốc (root folder), dựa theo cấu trúc sau
NEXT_PUBLIC_API_BASE_URL=''

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=""

3. npm install
4. npm run dev

## Demo project

Xem video demo tại link Google Drive bên dưới:

Part 1
https://drive.google.com/file/d/12ER-iboSq1Sp25p9kTOFkLcVJhIgpz1n/view?usp=sharing

Part 2 (chưa xử lý realtime khi add members)
https://drive.google.com/file/d/1WwHU1O3YgMvbAG7Cek2sXzysg9cPBUxR/view?usp=sharing
