// Liệt kê ứng viên khớp tên/số để NGƯỜI DÙNG CHỌN trước khi gửi (không gửi gì cả).
//   node find-target.mjs "tên hoặc số điện thoại"   # tìm người (bạn bè)
//   node find-target.mjs -g "tên nhóm"              # tìm nhóm
import fs from "node:fs";
import { Zalo } from "zca-js";

const args = process.argv.slice(2);
const isGroup = args[0] === "-g" || args[0] === "--group";
if (isGroup) args.shift();
const query = args.join(" ").trim();

if (!query) {
    console.error('Dùng: node find-target.mjs "tên|số"   |   node find-target.mjs -g "tên nhóm"');
    process.exit(1);
}

const norm = (s) =>
    (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .trim();

const creds = JSON.parse(fs.readFileSync(new URL("./credentials.json", import.meta.url), "utf-8"));
const api = await new Zalo({ logging: false }).login(creds);
const q = norm(query);

if (!isGroup && /^(0|84|\+84)\d{8,10}$/.test(query)) {
    // Số điện thoại: tra trực tiếp.
    const u = await api.findUser(query);
    if (!u || !u.uid) {
        console.log("Không tìm thấy ai với số", query, "(có thể chưa kết bạn / số sai).");
    } else {
        console.log("1 kết quả:");
        console.log(`  • ${u.display_name || u.zaloName || "(không tên)"}  | uid: ${u.uid}`);
    }
    process.exit(0);
}

if (isGroup) {
    const all = await api.getAllGroups();
    const ids = Object.keys(all.gridVerMap || all.gridInfoMap || all || {});
    const matches = [];
    // getGroupInfo nhận tối đa ~50 id/lần → chia lô.
    for (let i = 0; i < ids.length; i += 50) {
        const batch = ids.slice(i, i + 50);
        try {
            const info = await api.getGroupInfo(batch);
            const map = info.gridInfoMap || info;
            for (const gid of batch) {
                const g = map[gid];
                const name = g && (g.name || g.groupName);
                if (name && norm(name).includes(q)) matches.push({ name, id: gid });
            }
        } catch {
            /* lô lỗi thì bỏ qua, chạy tiếp */
        }
    }
    report(matches, `nhóm khớp "${query}"`);
} else {
    const friends = await api.getAllFriends();
    const list = Array.isArray(friends) ? friends : friends.friends || [];
    const matches = list
        .filter((f) => {
            const name = f.displayName || f.zaloName || f.username || "";
            return norm(name).includes(q);
        })
        .map((f) => ({ name: f.displayName || f.zaloName || f.username || "(không tên)", id: f.userId || f.uid }));
    report(matches, `người khớp "${query}"`);
}

function report(matches, label) {
    if (!matches.length) {
        console.log(`Không có ${label}. Thử từ khóa ngắn/khác đi.`);
        process.exit(0);
    }
    console.log(`${matches.length} ${label} — HỎI người dùng chọn trước khi gửi:`);
    for (const m of matches) console.log(`  • ${m.name}  | id: ${m.id}`);
    process.exit(0);
}
