// Kiểm tra credentials.json còn sống không (không gửi gì).
//   node check-key.mjs
import fs from "node:fs";
import { Zalo } from "zca-js";

let creds;
try {
    creds = JSON.parse(fs.readFileSync(new URL("./credentials.json", import.meta.url), "utf-8"));
} catch {
    console.error("❌ Chưa có credentials.json cạnh script. Tải từ popup extension và đặt vào thư mục này.");
    process.exit(1);
}

try {
    const api = await new Zalo({ logging: false }).login(creds);
    const uid = await api.getOwnId();
    console.log("✅ Khóa còn sống. uid chủ tài khoản:", uid);
    process.exit(0);
} catch (err) {
    console.error("❌ Khóa lỗi/hết hạn:", String(err && err.message ? err.message : err));
    console.error("   → Mở popup extension 'Zalo – Xuất khóa' bấm Tải credentials.json lại.");
    process.exit(1);
}
