// Content script (isolated world) trên chat.zalo.me.
// Chỉ đọc imei (z_uuid) + userAgent của trang rồi gửi cho service worker để gộp credentials.
// KHÔNG bọc WebSocket, KHÔNG mở kết nối nào → không ảnh hưởng phiên đăng nhập của bạn.
function readDevice() {
    let imei = null;
    try {
        imei = localStorage.getItem("z_uuid") || localStorage.getItem("sh_z_uuid");
        if (imei && imei.startsWith('"')) imei = JSON.parse(imei);
    } catch {
        /* bỏ qua */
    }
    chrome.runtime
        .sendMessage({ from: "page", type: "device", payload: { imei, userAgent: navigator.userAgent } })
        .catch(() => {});
}

// Đọc ngay khi trang đã tải, và đọc lại mỗi khi popup yêu cầu (nút Tải/Copy).
readDevice();
chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.to === "page" && msg.type === "requestDevice") readDevice();
});
