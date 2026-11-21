---
name: zalo-care
description: >-
  Chăm sóc khách hàng qua Zalo bằng tài khoản cá nhân của bạn — AN TOÀN, chỉ
  NHẮN TIN và XEM THÔNG TIN (nhóm, người dùng). Dùng khi người dùng muốn: gửi
  tin Zalo cho một người/nhóm, gửi chuỗi tin chăm sóc giãn giờ (chào mừng, nhắc
  hẹn, cảm ơn sau mua, win-back), tìm đúng người/nhóm theo tên hoặc số điện
  thoại, hoặc xem thông tin một nhóm/người. Gửi bằng HTTP nên KHÔNG đá tab Zalo
  Web đang đăng nhập. KHÔNG nghe tin realtime, KHÔNG thêm/xoá thành viên, KHÔNG
  đổi cài đặt tài khoản. Cần file credentials.json xuất từ extension "Zalo – Xuất
  khóa".
---

# Zalo Care — nhắn tin & xem thông tin (an toàn)

Skill gửi tin Zalo chăm sóc khách hàng bằng **tài khoản cá nhân của bạn**, qua
thư viện không chính thống [zca-js]. Bản này **cố ý rút gọn chỉ các thao tác an
toàn**: nhắn tin, xem thông tin nhóm/người, tìm đúng đích. Không làm gì có thể
gây khoá tài khoản ngoài việc gửi tin.

## Cần gì trước khi chạy

1. **Node.js 18+** (khuyến nghị 20/22).
2. File **`credentials.json`** — khoá đăng nhập Zalo của bạn, lấy bằng extension
   Chrome "Zalo – Xuất khóa" (đọc cookie + imei + userAgent của tab chat.zalo.me
   đang đăng nhập). Đặt file này **ngay trong thư mục `scripts/`**.
3. Cài thư viện: trong `scripts/` chạy `npm i` (cài `zca-js`).

> `credentials.json` = **toàn quyền tài khoản Zalo** của bạn. Coi như mật khẩu:
> KHÔNG commit lên git, KHÔNG gửi qua chat/email. Đã có sẵn trong `.gitignore`.

## Các việc skill làm được

| Việc | Lệnh |
|------|------|
| Kiểm tra khoá còn sống | `node check-key.mjs` |
| Tìm người theo tên/số (chỉ đọc) | `node find-target.mjs "tên hoặc 09xxxxxxxx"` |
| Tìm nhóm theo tên (chỉ đọc) | `node find-target.mjs -g "tên nhóm"` |
| Xem thông tin nhóm | `node info.mjs -g <groupId>` |
| Xem thông tin người | `node info.mjs <uid>` |
| Gửi 1 tin | `node send.mjs <uid\|sốĐT> "nội dung"` |
| Gửi 1 tin vào nhóm | `node send.mjs -g <groupId> "nội dung"` |
| Gửi chuỗi tin giãn giờ (chăm sóc) | `node send-drip.mjs <uid> 60 "tin 1" "tin 2" ...` |

Tham chiếu thêm hàm an toàn của zca-js: `references/zca-js-api.md`.

## QUY TẮC BẮT BUỘC khi dùng skill

1. **KHÔNG BAO GIỜ nghe tin realtime** (`listen()` / `api.listener`). Mở phiên
   thứ hai sẽ **đá tab Zalo Web** thật của người dùng. Skill này không có chức
   năng đó — đừng tự thêm vào.
2. **Luôn tìm & liệt kê gần đúng, rồi HỎI người dùng chọn** trước khi gửi theo
   tên. Chạy `find-target.mjs` → đọc danh sách cho người dùng → chờ họ chọn đúng
   uid/groupId → mới `send.mjs`. Tránh gửi nhầm người.
3. **Gửi chậm, tránh spam.** Đây là client không chính thức; nhắn dồn dập dễ bị
   khoá tài khoản. Chăm sóc nhiều người thì giãn nhịp (vài giây–vài chục giây).
4. **Chỉ gửi nội dung đúng mực, hợp pháp**, phục vụ chăm sóc khách hàng. Không
   spam, không quấy rối, không nội dung vi phạm.
5. **Giữ bí mật `credentials.json`.** Không in nội dung file ra chat, không chia
   sẻ, không commit.

## Quy trình gợi ý (chăm sóc khách)

1. `check-key.mjs` — xác nhận khoá sống.
2. `find-target.mjs "<tên/số>"` — tìm đúng khách → **hỏi người dùng chọn**.
3. (tuỳ chọn) `info.mjs <uid>` / `info.mjs -g <groupId>` — xem lại cho chắc.
4. Soạn nội dung → `send.mjs` (1 tin) hoặc `send-drip.mjs` (chuỗi chăm sóc).
5. Báo lại kết quả (msgId) cho người dùng.

## ⚠️ Miễn trừ trách nhiệm

- Đây là **cách làm không chính thống**, dựa trên thư viện bên thứ ba mô phỏng
  Zalo Web. **KHÔNG phải công cụ do Zalo phát hành**, không được Zalo hỗ trợ.
- Zalo có thể thay đổi hệ thống bất cứ lúc nào khiến công cụ ngừng chạy; dùng
  client không chính thức có thể **vi phạm điều khoản dịch vụ** và dẫn tới
  **hạn chế/khoá tài khoản**.
- Cung cấp **"nguyên trạng" (as-is), không bảo hành, không chịu trách nhiệm** cho
  bất kỳ thiệt hại nào. **Người dùng tự chịu trách nhiệm** về nội dung gửi đi và
  việc tuân thủ quy định của Zalo & pháp luật.

## 📢 Cập nhật skill mới

Nhận bản cập nhật & skill mới nhất từ tác giả qua nhóm Zalo:
<https://zalo.me/g/37yoic8thaeho75yicnb>

[zca-js]: https://github.com/rfs-adreno/zca-js
