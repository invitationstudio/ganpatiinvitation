document.addEventListener("DOMContentLoaded", () => {
    const shareButton = document.getElementById("shareButton");

    if (!shareButton) return;

    shareButton.addEventListener("click", shareInvitation);
});

async function shareInvitation() {
    const title =
        document.getElementById("title")?.textContent.trim() ||
        "Ganpati Invitation";

    const family =
        document.getElementById("family")?.textContent.trim() || "";

    const date =
        document.getElementById("date")?.textContent.trim() || "";

    const time =
        document.getElementById("time")?.textContent.trim() || "";

    const venue =
        document.getElementById("venue")?.textContent.trim() || "";

    const url = window.location.href;

    const text = [
        `🙏 ${title}`,
        "",
        family,
        "",
        `📅 Date : ${date}`,
        `🕒 Time : ${time}`,
        `📍 Venue : ${venue}`,
        "",
        "आपण सहकुटुंब उपस्थित राहून श्री गणरायाचे दर्शन घ्यावे ही नम्र विनंती.",
        "",
        url
    ].join("\n");

    if (navigator.share) {
        try {
            await navigator.share({
                title,
                text,
                url
            });
            return;
        } catch (error) {
            if (error.name === "AbortError") {
                return;
            }
        }
    }

    try {
        await navigator.clipboard.writeText(text);
        showShareToast("Invitation link copied.");
    } catch (error) {
        prompt("Copy this invitation:", text);
    }
}

function showShareToast(message) {
    let toast = document.getElementById("shareToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "shareToast";
        toast.className = "share-toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showShareToast.timer);

    showShareToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
