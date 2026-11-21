# Zalo Care — skill chăm sóc khách hàng qua Zalo (bản an toàn, miễn phí)

Một skill nhỏ cho Claude để **nhắn tin Zalo chăm sóc khách hàng** bằng tài khoản
cá nhân của bạn, gửi qua HTTP nên **không đá tab Zalo Web** đang đăng nhập.

Bản này **chỉ làm những việc an toàn**:

- ✅ Gửi 1 tin cho người / nhóm
- ✅ Gửi chuỗi tin chăm sóc giãn giờ (chào mừng, nhắc hẹn, cảm ơn, win-back)
- ✅ Tìm đúng người/nhóm theo tên hoặc số điện thoại (chỉ đọc)
- ✅ Xem thông tin nhóm / người dùng (chỉ đọc)
- ❌ **Không** nghe tin realtime (tránh đá tab), **không** thêm/xoá thành viên,
  **không** đổi cài đặt tài khoản.

## Cài nhanh

1. **Lấy khoá:** dùng extension Chrome "Zalo – Xuất khóa" trên tab chat.zalo.me
   đang đăng nhập → bấm **Tải credentials.json**.
2. Đặt `credentials.json` vào thư mục `scripts/`.
3. Trong `scripts/` chạy:
   ```bash
   npm i
   node check-key.mjs
   ```
4. **Cài vào Claude:** mở file `zalo-care.skill` trong Claude và bấm **Save skill**.
   Sau đó nói "nhắn Zalo cho…" hoặc gõ `/zalo-care`.

## Chạy tay bằng Node (không cần Claude)

```bash
cd scripts
npm i
node check-key.mjs                               # kiểm tra khoá sống
node find-target.mjs "tên hoặc 09xxxxxxxx"       # tìm người (chỉ đọc)
node find-target.mjs -g "tên nhóm"               # tìm nhóm (chỉ đọc)
node info.mjs <uid>                              # xem thông tin người
node info.mjs -g <groupId>                       # xem thông tin nhóm
node send.mjs <uid|sốĐT> "nội dung"              # gửi 1 tin
node send.mjs -g <groupId> "nội dung"            # gửi vào nhóm
node send-drip.mjs <uid> 60 "tin 1" "tin 2"      # chuỗi tin cách 60s
```

## An toàn & quy tắc

- `credentials.json` = **toàn quyền tài khoản Zalo** của bạn → coi như mật khẩu,
  **không chia sẻ, không commit** (đã có trong `.gitignore`).
- **Luôn tìm & hỏi trước khi gửi** theo tên — tránh gửi nhầm.
- **Gửi chậm, không spam** — client không chính thức, dồn dập dễ bị khoá.

## ⚠️ Miễn trừ trách nhiệm

Đây là **cách làm không chính thống**, dựa trên thư viện bên thứ ba
([zca-js](https://github.com/rfs-adreno/zca-js)) mô phỏng Zalo Web. **KHÔNG phải
công cụ do Zalo phát hành.** Dùng client không chính thức có thể vi phạm điều
khoản dịch vụ của Zalo và dẫn tới hạn chế/khoá tài khoản. Công cụ cung cấp
**"nguyên trạng", không bảo hành, không chịu trách nhiệm**; **người dùng tự chịu
trách nhiệm** về nội dung gửi đi và việc tuân thủ quy định của Zalo & pháp luật.

---

Tặng miễn phí cho cộng đồng. Dùng đúng mục đích chăm sóc khách hàng nhé.
