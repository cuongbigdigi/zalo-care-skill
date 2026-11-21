// Service worker: gộp credentials.json cho zca-js từ cookie (chrome.cookies)
// + imei/userAgent (đọc từ tab chat.zalo.me). KHÔNG nghe tin, KHÔNG webhook — chỉ xuất khóa.

async function setDevice(payload) {
    await chrome.storage.session.set({ device: payload });
    const ok = payload && payload.imei;
    chrome.action.setBadgeText({ text: ok ? "OK" : "…" });
    chrome.action.setBadgeBackgroundColor({ color: ok ? "#1a7f37" : "#9a6700" });
}

async function getDevice() {
    const { device } = await chrome.storage.session.get("device");
    return device || null;
}

// Cookie từ chrome.cookies có đủ các trường mà zca-js (type Cookie) cần.
async function buildCredentials() {
    const cookie = await chrome.cookies.getAll({ domain: "zalo.me" });
    const device = await getDevice();
    return {
        cookie,
        imei: device?.imei || null,
        userAgent: device?.userAgent || null,
    };
}

async function requestDeviceFromTabs() {
    const tabs = await chrome.tabs.query({ url: "https://chat.zalo.me/*" });
    for (const t of tabs) chrome.tabs.sendMessage(t.id, { to: "page", type: "requestDevice" }).catch(() => {});
    return tabs.length;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.from === "page" && msg.type === "device") {
        setDevice(msg.payload);
        return false;
    }
    if (msg?.from !== "popup") return false;

    (async () => {
        switch (msg.type) {
            case "getState":
                return { device: await getDevice() };
            case "refreshDevice":
                return { tabs: await requestDeviceFromTabs() };
            case "getCredentials":
                return await buildCredentials();
        }
    })()
        .then(sendResponse)
        .catch((err) => sendResponse({ error: String(err.message || err) }));
    return true;
});
