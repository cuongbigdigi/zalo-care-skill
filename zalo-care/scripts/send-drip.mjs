// Gửi nhiều tin giãn giờ tới 1 người/nhóm (chăm sóc khách). HTTP thuần, không listener.
//   node send-drip.mjs <uid> <giây> "tin 1" "tin 2" ...
//   node send-drip.mjs -g <groupId> <giây> "tin 1" "tin 2" ...
// Chạy lâu (chờ giữa các tin) → nên chạy ở background.
import fs from "node:fs";
import { Zalo, ThreadType } from "zca-js";

const args = process.argv.slice(2);
const isGroup = args[0] === "-g" || args[0] === "--group";
if (isGroup) args.shift();
const target = args.shift();
const gap = Number(args.shift());
const messages = args;

if (!target || !Number.isFinite(gap) || messages.length === 0) {
    console.error('Dùng: node send-drip.mjs <uid> <giây> "tin 1" "tin 2" ...');
    console.error('Nhóm: node send-drip.mjs -g <groupId> <giây> "tin 1" "tin 2" ...');
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
        console.error("❌ Không tìm thấy số", target);
        process.exit(1);
    }
    uid = user.uid;
}

const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
for (let i = 0; i < messages.length; i++) {
    if (i > 0) await sleep(gap);
    const res = await api.sendMessage(messages[i], uid, type);
    const t = new Date().toLocaleTimeString();
    console.log(`${t} ✅ Tin ${i + 1}/${messages.length} đã gửi | msgId: ${JSON.stringify(res)}`);
}
console.log(`Xong ${messages.length} tin.`);
process.exit(0);
