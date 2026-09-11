document.addEventListener("DOMContentLoaded", async () => {
    const galleryContainer = document.getElementById("gallery");

    if (!galleryContainer) return;

    try {
        const response = await fetch("data/gallery.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Unable to load gallery.");
        }

        const data = await response.json();

        const images = Array.isArray(data)
            ? data
            : Array.isArray(data.images)
                ? data.images
                : [];

        if (!images.length) {
            galleryContainer.style.display = "none";
            return;
        }

        galleryContainer.innerHTML = "";

        images.forEach((image, index) => {
            const item = document.createElement("div");
            item.className = "gallery-item reveal";

            const img = document.createElement("img");
            img.loading = "lazy";
            img.decoding = "async";
            img.alt = image.alt || `Gallery Image ${index + 1}`;
            img.src = image.src;

            img.addEventListener("click", () => {
                openLightbox(image.src, img.alt);
            });

            item.appendChild(img);
            galleryContainer.appendChild(item);
        });

        observeGalleryItems();

    } catch (error) {
        console.error(error);
        galleryContainer.style.display = "none";
    }
});

function observeGalleryItems() {
    const items = document.querySelectorAll(".gallery-item");

    if (!items.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    items.forEach(item => observer.observe(item));
}

function openLightbox(src, alt) {
    let lightbox = document.getElementById("galleryLightbox");

    if (!lightbox) {
        lightbox = document.createElement("div");
        lightbox.id = "galleryLightbox";
        lightbox.className = "gallery-lightbox";

        lightbox.innerHTML = `
            <span class="gallery-close">&times;</span>
            <img class="gallery-preview" alt="">
        `;

        document.body.appendChild(lightbox);

        lightbox.addEventListener("click", (e) => {
            if (
                e.target === lightbox ||
                e.target.classList.contains("gallery-close")
            ) {
                lightbox.classList.remove("show");
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                lightbox.classList.remove("show");
            }
        });
    }

    const preview = lightbox.querySelector(".gallery-preview");

    preview.src = src;
    preview.alt = alt;

    lightbox.classList.add("show");
}