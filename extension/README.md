# Zalo – Xuất khóa (extension Chrome)

Extension Chrome (Manifest V3) **chỉ làm một việc**: đọc cookie + imei + userAgent của tab
**chat.zalo.me** đang đăng nhập, gộp thành `credentials.json` cho
[zca-js](https://github.com/RFS-ADRENO/zca-js) — là **khóa** mà skill `zalo-care` dùng để gửi tin.

Nó **chỉ đọc** (không bọc WebSocket, không mở kết nối nào, không nghe tin, không webhook)
nên bạn vẫn dùng Zalo Web bình thường, **không bị đá tab**.

## Cài extension

1. Mở `chrome://extensions`, bật **Developer mode** (góc trên bên phải).
2. Bấm **Load unpacked**, chọn thư mục **`extension/`** này.
3. Mở (hoặc tải lại) tab **chat.zalo.me** và đăng nhập.
4. Badge **OK** xanh là đã đọc được khóa → mở popup → **Tải credentials.json**.

## Trạng thái badge

- **OK** (xanh): đã đọc được imei, sẵn sàng xuất khóa.
- **…** (vàng): chưa đọc được imei — mở/tải lại tab `chat.zalo.me` rồi mở lại popup.

## Sau khi có khóa → gửi tin

Phần **gửi tin** nằm ở skill [`zalo-care`](../zalo-care/) (thư mục `zalo-care/scripts/`),
gửi bằng **HTTP thuần, không listener** nên cũng không đá tab.

1. Đặt `credentials.json` vừa tải vào `zalo-care/scripts/`.
2. `cd zalo-care/scripts && npm i`
3. `node check-key.mjs` để kiểm tra khóa sống, rồi dùng `send.mjs`, `find-target.mjs`, `info.mjs`…

Mang `credentials.json` sang máy/server khác vẫn gửi được — **giữ nguyên cả file** (nhất là
`imei` + `userAgent`).

## Lưu ý

- `credentials.json` = **toàn quyền tài khoản Zalo**. Không chia sẻ, không commit lên git,
  không gửi qua chat/email. Chuyển bằng AirDrop/USB/scp. Hết hạn thì mở popup **Tải
  credentials.json** lại.
- Đây là client **không chính thức**, có rủi ro khóa tài khoản. Gửi chậm, tránh spam.
- **Nghe tin realtime**: extension không làm (Zalo mở socket tin trong Web Worker nên
  main-thread không đọc được) — và skill `zalo-care` cũng cố ý không nghe realtime để khỏi
  đá tab.
