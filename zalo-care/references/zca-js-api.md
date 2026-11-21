# zca-js — các hàm AN TOÀN dùng trong skill này

Chỉ liệt kê các hàm **gửi tin** và **đọc thông tin**. Các hàm thay đổi nhóm,
thêm/xoá thành viên, nghe realtime… **cố ý không dùng** trong bản chăm sóc này.

## Đăng nhập (HTTP, không listener → không đá tab)

```js
import { Zalo, ThreadType } from "zca-js";
const api = await new Zalo({ logging: false }).login(creds); // creds = credentials.json
```

> KHÔNG gọi `api.listener.start()` / `api.listen()`. Đó là WebSocket = phiên thứ
> hai → **đá tab Zalo Web** của người dùng.

## Đọc thông tin (an toàn, chỉ đọc)

| Hàm | Dùng để |
|-----|---------|
| `api.getOwnId()` | lấy uid tài khoản đang đăng nhập |
| `api.getAllFriends()` | danh sách bạn bè (tìm người theo tên) |
| `api.getAllGroups()` | danh sách id nhóm của bạn |
| `api.getGroupInfo(groupId \| [ids])` | tên nhóm, số thành viên, mô tả (≤ ~50 id/lần) |
| `api.getUserInfo(uid)` | thông tin một người dùng |
| `api.findUser("09xxxxxxxx")` | tra uid theo số điện thoại (phải đã kết bạn) |

## Gửi tin

```js
// Text 1-1 theo uid
await api.sendMessage("Xin chào", uid, ThreadType.User);

// Text vào nhóm
await api.sendMessage("Thông báo", groupId, ThreadType.Group);
```

`ThreadType.User` = chat 1-1, `ThreadType.Group` = nhóm.

## Gửi ảnh / file (nâng cao, vẫn an toàn)

zca-js có `api.sendMessage` nhận object kèm `attachments` (đường dẫn ảnh/file)
để gửi báo cáo dạng ảnh/Excel. Xem README chính thức của zca-js nếu cần:
<https://github.com/rfs-adreno/zca-js>. Nguyên tắc vẫn là **gửi chậm, đúng mực**.

## KHÔNG dùng (ngoài phạm vi "an toàn")

- `api.listener` / nghe tin realtime — đá tab.
- Thêm/xoá/mời thành viên, đổi tên/ảnh nhóm, giải tán nhóm.
- Đổi cài đặt tài khoản, kết bạn hàng loạt.

→ Những thao tác này dễ gây khoá tài khoản hoặc phiền khách; bản chăm sóc này
không hỗ trợ.
