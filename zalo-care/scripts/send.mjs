// Gửi 1 tin Zalo bằng credentials.json (HTTP thuần, KHÔNG listener → không đá tab Chrome).
//   node send.mjs <uid> "nội dung"           # gửi 1-1 theo uid
//   node send.mjs 0987654321 "nội dung"      # gửi 1-1 theo số điện thoại (tự tìm uid)
//   node send.mjs -g <groupId> "nội dung"    # gửi vào nhóm
import fs from "node:fs";
import { Zalo, ThreadType } from "zca-js";

const args = process.argv.slice(2);
const isGroup = args[0] === "-g" || args[0] === "--group";
if (isGroup) args.shift();
const target = args.shift();
const message = args.join(" ");

if (!target || !message) {
    console.error('Dùng: node send.mjs <uid|sốĐT> "nội dung"');
    console.error('Nhóm: node send.mjs -g <groupId> "nội dung"');
    process.exit(1);
}

const creds = JSON.parse(fs.readFileSync(new URL("./credentials.json", import.meta.url), "utf-8"));
const api = await new Zalo({ logging: false }).login(creds);

let uid = target;
let type = ThreadType.User;

if (isGroup) {
    type = ThreadType.Group;
} else if (/^(0|84|\+84)\d{8,10}$/.test(target)) {
    const user = await api.findUser(target);
    if (!user || !user.uid) {
        console.error("❌ Không tìm thấy ai với số", target, "(có thể chưa kết bạn / số sai)");
        process.exit(1);
    }
    uid = user.uid;
    console.log("Tìm thấy:", user.display_name || user.zaloName || "(không tên)", "| uid:", uid);
}

const res = await api.sendMessage(message, uid, type);
console.log("✅ Đã gửi tới", uid, "| msgId:", JSON.stringify(res));
process.exit(0);
