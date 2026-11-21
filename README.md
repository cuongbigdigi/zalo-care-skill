<div align="center">

# 🤖💬 Zalo Care Skill

### Chăm sóc khách hàng qua Zalo bằng AI — an toàn, không đá tab, miễn phí

Biến Claude (hoặc AI Agent bất kỳ) thành trợ lý **nhắn tin & chăm sóc khách hàng trên Zalo**
bằng chính tài khoản của bạn. Gửi bằng HTTP nên **không đá tab Zalo Web** đang đăng nhập.

![type](https://img.shields.io/badge/Claude-Skill-6b5bd2)
![zalo](https://img.shields.io/badge/Zalo-CSKH-0068ff)
![safe](https://img.shields.io/badge/An%20to%C3%A0n-ch%E1%BB%89%20nh%E1%BA%AFn%20%26%20xem-22c55e)
![price](https://img.shields.io/badge/Gi%C3%A1-Mi%E1%BB%85n%20ph%C3%AD-f59e0b)

---

### 📢 Tham gia nhóm Zalo để nhận **skill mới nhất** từ tác giả

> 👉 **[Bấm vào đây để vào nhóm Zalo cập nhật skill »](https://zalo.me/g/37yoic8thaeho75yicnb)**
>
> Vào nhóm để nhận bản cập nhật, skill mới, mẹo dùng AI chăm sóc khách hàng và hỗ trợ trực tiếp.

</div>

---

## 📦 Tải về

- **File skill cài nhanh:** [`zalo-care.skill`](zalo-care.skill) — mở trong Claude → **Save skill**.
- **Mã nguồn skill:** thư mục [`zalo-care/`](zalo-care/) (SKILL.md + scripts + tài liệu).

---

## ✨ Làm được gì (chỉ các thao tác AN TOÀN)

| | Tính năng |
|---|---|
| ✅ | Gửi 1 tin cho **người** hoặc **nhóm** |
| ✅ | Gửi **chuỗi tin chăm sóc giãn giờ** — chào mừng, nhắc hẹn, cảm ơn sau mua, win-back |
| ✅ | **Tìm đúng** người/nhóm theo tên hoặc số điện thoại (chỉ đọc) |
| ✅ | **Xem thông tin** nhóm / người dùng (chỉ đọc) |
| ❌ | *Không* nghe tin realtime (tránh đá tab) · *không* thêm/xoá thành viên · *không* đổi cài đặt tài khoản |

Bản này **cố ý rút gọn** để an toàn tối đa cho tài khoản của bạn.

---

## 🔌 Cơ chế kết nối (2 bước)

```
┌──────────────────┐   xuất khóa   ┌──────────────────┐   gửi HTTP   ┌──────────┐
│  Extension       │ ────────────▶ │  credentials.json │ ───────────▶ │  ZALO    │
│ "Zalo – Xuất khóa"│  (cookie+imei)│  = quyền gửi      │  KHÔNG đá tab │          │
└──────────────────┘               └─────────┬─────────┘              └──────────┘
                                             │ đọc
                                   ┌─────────▼─────────┐
                                   │  AI Agent (Claude) │  soạn nội dung · chọn đích
                                   │  + skill zalo-care │  · gửi · xem thông tin
                                   └───────────────────┘
```

1. **Lấy khóa** — extension đọc cookie + imei + userAgent của tab `chat.zalo.me` đang
   đăng nhập, gộp thành `credentials.json`. *Chỉ đọc, không mở kết nối nào → không đá tab.*
2. **Agent dùng khóa** — skill `zalo-care` nạp `credentials.json`, gửi tin qua `zca-js`
   bằng **HTTP thuần (không listener)** → cũng không đá tab. Chạy được ở máy nào / server nào.

---

## 🚀 Cài nhanh

1. **Lấy khóa:** dùng extension Chrome **"Zalo – Xuất khóa"** trên tab `chat.zalo.me` đang
   đăng nhập → bấm **Tải credentials.json**.
2. Đặt `credentials.json` vào thư mục **`zalo-care/scripts/`**.
3. Trong `zalo-care/scripts/`:
   ```bash
   npm i
   node check-key.mjs      # kiểm tra khóa sống
   ```
4. **Cài vào Claude:** mở file **[`zalo-care.skill`](zalo-care.skill)** trong Claude → bấm
   **Save skill**. Sau đó nói *"nhắn Zalo cho…"* hoặc gõ `/zalo-care`.

> 🔐 `credentials.json` = **toàn quyền tài khoản Zalo** của bạn. Coi như mật khẩu:
> **không chia sẻ, không commit, không gửi qua chat/email.** Đã có sẵn trong `.gitignore`.

---

## 🧭 Hướng dẫn cho AI Agent

Nếu bạn là một AI Agent (Claude hoặc khác) đang dùng skill này, tuân thủ **đúng quy trình**:

1. **Xác thực trước:** chạy `node check-key.mjs`. Nếu khóa lỗi → yêu cầu người dùng xuất
   khóa lại, **không** đoán mò.
2. **Tìm rồi HỎI, mới gửi:** với đích theo tên, luôn `find-target.mjs "<tên/số>"` → **liệt kê
   ứng viên cho người dùng chọn** → chờ xác nhận uid/groupId → **mới** `send.mjs`.
   *Tuyệt đối không tự gửi khi chưa chắc đúng người.*
3. **Gửi chậm, không spam:** nhiều người/nhiều tin thì giãn nhịp (dùng `send-drip.mjs`).
4. **KHÔNG nghe realtime** (`listen()` / `api.listener`) — mở phiên thứ hai sẽ **đá tab Zalo
   Web** thật của người dùng. Skill này không có chức năng đó; đừng tự thêm.
5. **Giữ bí mật khóa:** không in nội dung `credentials.json` ra chat, không gửi đi đâu.
6. Chỉ gửi nội dung **đúng mực, hợp pháp**, phục vụ chăm sóc khách hàng.

Chi tiết các hàm an toàn của `zca-js`: xem [`zalo-care/references/zca-js-api.md`](zalo-care/references/zca-js-api.md).

---

## 🖥️ Chạy tay bằng Node (không cần Claude)

```bash
cd zalo-care/scripts
npm i
node check-key.mjs                               # kiểm tra khóa sống
node find-target.mjs "tên hoặc 09xxxxxxxx"       # tìm người (chỉ đọc)
node find-target.mjs -g "tên nhóm"               # tìm nhóm (chỉ đọc)
node info.mjs <uid>                              # xem thông tin người
node info.mjs -g <groupId>                       # xem thông tin nhóm
node send.mjs <uid|sốĐT> "nội dung"              # gửi 1 tin
node send.mjs -g <groupId> "nội dung"            # gửi vào nhóm
node send-drip.mjs <uid> 60 "tin 1" "tin 2"      # chuỗi tin cách 60s
```

---

## ⚠️ Miễn trừ trách nhiệm

Đây là **cách làm không chính thống**, dựa trên thư viện bên thứ ba
([zca-js](https://github.com/rfs-adreno/zca-js)) mô phỏng Zalo Web. **KHÔNG phải công cụ do
Zalo phát hành.** Dùng client không chính thức có thể **vi phạm điều khoản dịch vụ** của Zalo
và dẫn tới **hạn chế/khóa tài khoản**. Công cụ cung cấp **"nguyên trạng", không bảo hành, không
chịu trách nhiệm** cho bất kỳ thiệt hại nào; **người dùng tự chịu trách nhiệm** về nội dung gửi
đi và việc tuân thủ quy định của Zalo & pháp luật.

---

<div align="center">

**Tặng miễn phí cho cộng đồng.** Dùng đúng mục đích chăm sóc khách hàng nhé ❤️

👉 **[Vào nhóm Zalo nhận skill mới nhất »](https://zalo.me/g/37yoic8thaeho75yicnb)**

</div>
