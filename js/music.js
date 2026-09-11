xdocument.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("bgMusic");
    const toggle = document.getElementById("musicToggle");

    if (!audio || !toggle) return;

    const STORAGE_KEY = "ganpati_music_enabled";

    function setButton(isPlaying) {
        toggle.classList.toggle("playing", isPlaying);
        toggle.setAttribute(
            "aria-label",
            isPlaying ? "Pause Music" : "Play Music"
        );
        toggle.innerHTML = isPlaying
            ? '<i class="fa-solid fa-pause"></i>'
            : '<i class="fa-solid fa-music"></i>';
    }

    async function playMusic() {
        try {
            await audio.play();
            localStorage.setItem(STORAGE_KEY, "true");
            setButton(true);
        } catch (e) {
            setButton(false);
        }
    }

    function pauseMusic() {
        audio.pause();
        localStorage.setItem(STORAGE_KEY, "false");
        setButton(false);
    }

    toggle.addEventListener("click", () => {
        if (audio.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    audio.addEventListener("play", () => setButton(true));
    audio.addEventListener("pause", () => setButton(false));
    audio.addEventListener("ended", () => {
        audio.currentTime = 0;
        playMusic();
    });

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== "false") {
        const startOnInteraction = () => {
            playMusic();

            document.removeEventListener("click", startOnInteraction);
            document.removeEventListener("touchstart", startOnInteraction);
            document.removeEventListener("keydown", startOnInteraction);
        };

        document.addEventListener("click", startOnInteraction, { once: true });
        document.addEventListener("touchstart", startOnInteraction, { once: true });
        document.addEventListener("keydown", startOnInteraction, { once: true });
    } else {
        setButton(false);
    }
});