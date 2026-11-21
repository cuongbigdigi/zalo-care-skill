const $ = (id) => document.getElementById(id);
const send = (type, extra = {}) => chrome.runtime.sendMessage({ from: "popup", type, ...extra });

function toast(text) {
    $("toast").textContent = text;
    setTimeout(() => ($("toast").textContent = ""), 2500);
}

function setStatus(device) {
    $("status").innerHTML = "";
    const dot = document.createElement("span");
    const ok = device && device.imei;
    dot.className = "dot " + (ok ? "ready" : "open");
    $("status").append(dot, ok ? "Sẵn sàng xuất khóa" : "Mở tab chat.zalo.me");
}

async function refresh() {
    const s = await send("getState");
    setStatus(s.device);
    $("device").textContent =
        s.device && s.device.imei
            ? `imei: ${s.device.imei.slice(0, 12)}… · UA: ${(s.device.userAgent || "").slice(0, 40)}…`
            : "Chưa đọc được imei — mở hoặc tải lại tab chat.zalo.me rồi mở lại popup.";
}

async function getCreds() {
    await send("refreshDevice");
    await new Promise((r) => setTimeout(r, 300));
    const creds = await send("getCredentials");
    if (!creds.cookie || !creds.cookie.length) toast("Chưa đọc được cookie — đăng nhập chat.zalo.me trước");
    else if (!creds.imei) toast("Chưa đọc được imei — mở/tải lại tab chat.zalo.me");
    return JSON.stringify(creds, null, 2);
}

$("copy").onclick = async () => {
    await navigator.clipboard.writeText(await getCreds());
    toast("Đã copy credentials");
    refresh();
};

$("download").onclick = async () => {
    const blob = new Blob([await getCreds()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "credentials.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Đã tải credentials.json");
    refresh();
};

refresh();
