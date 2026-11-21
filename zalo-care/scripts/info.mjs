// Xem THÔNG TIN (chỉ đọc, KHÔNG gửi, KHÔNG thay đổi gì).
//   node info.mjs -g <groupId>   # thông tin nhóm: tên, số thành viên, mô tả
//   node info.mjs <uid>          # thông tin người dùng
//   node info.mjs me             # thông tin tài khoản của bạn (uid)
import fs from "node:fs";
import { Zalo } from "zca-js";

const args = process.argv.slice(2);
const isGroup = args[0] === "-g" || args[0] === "--group";
if (isGroup) args.shift();
const target = (args[0] || "").trim();

if (!target) {
    console.error('Dùng: node info.mjs <uid> | node info.mjs -g <groupId> | node info.mjs me');
    process.exit(1);
}

let creds;
try {
    creds = JSON.parse(fs.readFileSync(new URL("./credentials.json", import.meta.url), "utf-8"));
} catch {
    console.error("❌ Chưa có credentials.json cạnh script. Tải từ popup extension và đặt vào đây.");
    process.exit(1);
}

const api = await new Zalo({ logging: false }).login(creds);

const pick = (obj, keys) => {
    for (const k of keys) if (obj && obj[k] != null && obj[k] !== "") return obj[k];
    return undefined;
};

if (target === "me") {
    const uid = await api.getOwnId();
    console.log("Tài khoản của bạn — uid:", uid);
    process.exit(0);
}

if (isGroup) {
    const info = await api.getGroupInfo(target);
    const map = info.gridInfoMap || info;
    const g = map[target] || map;
    if (!g) {
        console.log("Không lấy được thông tin nhóm", target, "(sai id hoặc không ở trong nhóm).");
        process.exit(0);
    }
    const members = g.memberIds || g.currentMems || g.memVerList || [];
    console.log("=== THÔNG TIN NHÓM ===");
    console.log("Tên:         ", pick(g, ["name", "groupName"]) || "(không tên)");
    console.log("Group ID:    ", target);
    console.log("Số thành viên:", g.totalMember || g.total || (Array.isArray(members) ? members.length : "?"));
    console.log("Mô tả:       ", pick(g, ["desc", "description"]) || "(trống)");
    const admins = g.adminIds || g.admins;
    if (Array.isArray(admins)) console.log("Quản trị:    ", admins.length, "người");
    console.log("Người tạo:   ", pick(g, ["creatorId", "owner"]) || "?");
    process.exit(0);
}

// Người dùng
let u;
try {
    const info = await api.getUserInfo(target);
    u = info.changed_profiles ? Object.values(info.changed_profiles)[0] : info.unchanged_profiles ? Object.values(info.unchanged_profiles)[0] : info;
} catch (e) {
    console.error("❌ Không lấy được thông tin:", String(e && e.message ? e.message : e));
    process.exit(1);
}
console.log("=== THÔNG TIN NGƯỜI DÙNG ===");
console.log("Tên:   ", pick(u, ["displayName", "zaloName", "username"]) || "(không tên)");
console.log("uid:   ", pick(u, ["userId", "uid"]) || target);
console.log("Trạng thái:", pick(u, ["status"]) || "(trống)");
console.log("Là bạn bè:", u && (u.isFr === 1 || u.isFriend) ? "có" : "không/không rõ");
process.exit(0);
