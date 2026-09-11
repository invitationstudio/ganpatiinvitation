document.addEventListener("DOMContentLoaded", async () => {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        return;
    }

    let targetDate = null;

    try {
        const response = await fetch("data/invitation.json", {
            cache: "no-store"
        });

        if (response.ok) {
            const data = await response.json();

            const invitation = data.ganpati || data;

            if (invitation.countdown) {
                targetDate = new Date(invitation.countdown);
            } else if (invitation.date && invitation.time) {
                targetDate = new Date(`${invitation.date} ${invitation.time}`);
            }
        }
    } catch (error) {
        console.error("Countdown data load failed.", error);
    }

    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
        targetDate = new Date();
    }

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function updateCountdown() {
        const now = new Date();

        let difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {
            difference = 0;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    updateCountdown();

    setInterval(updateCountdown, 1000);
});