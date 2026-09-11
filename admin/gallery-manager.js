import {
    db,
    doc,
    getDoc,
    setDoc
} from "../js/firebase.js";

import {
    uploadFile
} from "../js/cloudinary.js";

"use strict";

/* ===========================
   Admin Session
=========================== */

const loggedIn =
localStorage.getItem("adminLoggedIn");

if(loggedIn !== "true"){

    window.location.href =
    "login.html";

    throw new Error("Admin Login Required");

}

/* ===========================
   Customer
=========================== */

const params = new URLSearchParams(window.location.search);

const customerId = params.get("customer");
console.log("Gallery Customer ID:", customerId);

/* ===========================
   Elements
=========================== */

const customerInfo =
    document.getElementById("customerInfo");

const galleryGrid =
    document.getElementById("galleryGrid");

const backBtn =
    document.getElementById("backBtn");

/* ===========================
   Load Gallery
=========================== */

async function loadGallery() {

    if (!customerId) {

        alert("Customer ID Missing");

        return;

    }

    try {

        const ref =
            doc(db, "customers", customerId);

        const snap =
            await getDoc(ref);

            console.log("Firestore Data:", snap.data());

        if (!snap.exists()) {

            alert("Customer Not Found");

            return;

        }

        const data = snap.data();

        customerInfo.innerText =
            "Customer : " +
            (data.family || customerId);

        renderGallery(
            data.gallery || []
        );

        /* ===========================
   Load Wish Screen Image
=========================== */

if (data.wishScreenImage) {

    wishScreenPreview.src =
        data.wishScreenImage;

    wishScreenPreview.style.display =
        "block";

}

/* ===========================
   Load Main Invitation Image
=========================== */

if (data.mainInvitationImage) {

    mainInvitationPreview.src =
        data.mainInvitationImage;

    mainInvitationPreview.style.display =
        "block";

}

/* ===========================
   Load Hero Page Image
=========================== */

if (data.heroImage) {

    heroImagePreview.src =
        data.heroImage;

    heroImagePreview.style.display =
        "block";

}

        console.log(
            "Gallery Loaded",
            data.gallery
        );

    }

    catch (error) {

        console.error(error);

    }

}

/* ===========================
   Render Gallery
=========================== */

function renderGallery(images) {

    galleryGrid.innerHTML = "";

    if (!images || images.length === 0) {

        galleryGrid.innerHTML =
            "<p>No Images Uploaded</p>";

        return;

    }

    images.forEach((url, index) => {

        const card =
            document.createElement("div");

        card.className = "galleryCard";

        card.innerHTML = `

<img
src="${url}"
class="galleryImage">

<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">

<button class="upBtn">
⬆
</button>

<button class="downBtn">
⬇
</button>

<button class="replaceImageBtn">
🔄 Replace
</button>

<button class="deleteImageBtn">
🗑 Delete
</button>

</div>

`;

card
.querySelector(".upBtn")
.addEventListener("click", () => {

    moveImage(index, index - 1);

});

card
.querySelector(".downBtn")
.addEventListener("click", () => {

    moveImage(index, index + 1);

});

card
.querySelector(".replaceImageBtn")
.addEventListener("click", () => {

    replaceImage(index);

});

        card
        .querySelector(".deleteImageBtn")
        .addEventListener("click", () => {

            deleteImage(index);

        });

        galleryGrid.appendChild(card);

    });

}

/* ===========================
   Delete Image
=========================== */

async function deleteImage(index) {

    if (!confirm("Delete this image?"))
        return;

    try {

        const ref =
            doc(db, "customers", customerId);

        const snap =
            await getDoc(ref);

        const data =
            snap.data();

        const gallery =
            data.gallery || [];

        gallery.splice(index, 1);

        await setDoc(

            ref,

            {
                gallery: gallery
            },

            { merge: true }

        );

        loadGallery();

    }

    catch (error) {

        console.error(error);

        alert("Delete Failed");

    }

}

/* ===========================
   Replace Image
=========================== */

async function replaceImage(index) {

    if(!customerId){

        alert("Customer ID Missing");

        return;

    }

    const input = document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.onchange = async () => {

        const file = input.files[0];

        if (!file) return;

        try {

            const newUrl =
    await uploadFile(file);

            const ref =
                doc(db, "customers", customerId);

            const snap =
                await getDoc(ref);

            const data =
                snap.data();

            const gallery =
                data.gallery || [];

            gallery[index] = newUrl;

            await setDoc(

                ref,

                {
                    gallery: gallery
                },

                { merge: true }

            );

            loadGallery();

            alert("Image Replaced ✅");

        }

        catch (error) {

            console.error(error);

            alert("Replace Failed");

        }

    };

    input.click();

}

/* ===========================
   Move Image
=========================== */

async function moveImage(fromIndex, toIndex) {

    try {

        const ref =
            doc(db, "customers", customerId);

        const snap =
            await getDoc(ref);

        const data =
            snap.data();

        const gallery =
            data.gallery || [];

        if (
            toIndex < 0 ||
            toIndex >= gallery.length
        ) return;

        [gallery[fromIndex], gallery[toIndex]] =
        [gallery[toIndex], gallery[fromIndex]];

        await setDoc(

            ref,

            {
                gallery: gallery
            },

            { merge: true }

        );

        loadGallery();

    }

    catch (error) {

        console.error(error);

        alert("Reorder Failed");

    }

}

/* ===========================
   Back
=========================== */

if(backBtn){

    backBtn.addEventListener("click", () => {

        window.location.href =
        "customer-dashboard.html?customer=" + customerId;

    });

}

/* ===========================
   Start
=========================== */

loadGallery();

/* ===========================
   Upload Images
=========================== */

const uploadBtn =
    document.getElementById("uploadBtn");

const galleryFile =
    document.getElementById("galleryFile");

    const wishScreenImage =
    document.getElementById("wishScreenImage");

const uploadWishScreenBtn =
    document.getElementById("uploadWishScreenBtn");

const wishScreenPreview =
    document.getElementById("wishScreenPreview");

    /* ===========================
   Main Invitation Image
=========================== */

const mainInvitationImage =
    document.getElementById(
        "mainInvitationImage"
    );

const uploadMainInvitationBtn =
    document.getElementById(
        "uploadMainInvitationBtn"
    );

const mainInvitationPreview =
    document.getElementById(
        "mainInvitationPreview"
    );

/* ===========================
   Hero Page Image
=========================== */

const heroImage =
    document.getElementById(
        "heroImage"
    );

const uploadHeroImageBtn =
    document.getElementById(
        "uploadHeroImageBtn"
    );

const heroImagePreview =
    document.getElementById(
        "heroImagePreview"
    );

uploadBtn.addEventListener("click", uploadImages);

async function uploadImages() {

    if(!customerId){

        alert("Customer ID Missing");

        return;

    }

    const files = galleryFile.files;

    if (!files.length) {

        alert("Select Images");

        return;

    }

    uploadBtn.disabled = true;

    uploadBtn.innerText = "Uploading...";

    try {

        const ref =
            doc(db, "customers", customerId);

        const snap =
            await getDoc(ref);

        const data =
            snap.data();

        const gallery =
            data.gallery || [];

        for (const file of files) {

            const url =
    await uploadFile(file);

            gallery.push(url);

        }

        await setDoc(

            ref,

            {
                gallery: gallery
            },

            { merge: true }

        );

        alert("Gallery Updated ✅");

        galleryFile.value = "";

        loadGallery();

    }

    catch (error) {

        console.error(error);

        alert("Upload Failed");

    }

    uploadBtn.disabled = false;

    uploadBtn.innerText =
        "☁ Upload Images";

}

/* ===========================
   Wish Screen Image Upload
=========================== */

if (uploadWishScreenBtn) {

    uploadWishScreenBtn.addEventListener(
        "click",
        async () => {

            if (!customerId) {

                alert("Customer ID Missing");
                return;

            }

            const file =
                wishScreenImage.files[0];

            if (!file) {

                alert("Select Wish Screen PNG");
                return;

            }

            uploadWishScreenBtn.disabled =
                true;

            uploadWishScreenBtn.innerText =
                "Uploading...";

            try {

                const url =
                    await uploadFile(file);

                const ref =
                    doc(
                        db,
                        "customers",
                        customerId
                    );

                await setDoc(

                    ref,

                    {
                        wishScreenImage: url
                    },

                    {
                        merge: true
                    }

                );

                wishScreenPreview.src =
                    url;

                wishScreenPreview.style.display =
                    "block";

                wishScreenImage.value =
                    "";

                alert(
                    "Wish Screen Image Uploaded ✅"
                );

            }

            catch (error) {

                console.error(error);

                alert(
                    "Wish Screen Upload Failed"
                );

            }

            uploadWishScreenBtn.disabled =
                false;

            uploadWishScreenBtn.innerText =
                "☁ Upload Wish Screen PNG";

        }
    );

}

/* ===========================
   Main Invitation Image Upload
=========================== */

if (uploadMainInvitationBtn) {

    uploadMainInvitationBtn.addEventListener(
        "click",
        async () => {

            if (!customerId) {

                alert("Customer ID Missing");
                return;

            }

            const file =
                mainInvitationImage.files[0];

            if (!file) {

                alert(
                    "Select Main Invitation PNG"
                );

                return;

            }

            uploadMainInvitationBtn.disabled =
                true;

            uploadMainInvitationBtn.innerText =
                "Uploading...";

            try {

                const url =
                    await uploadFile(file);

                const ref =
                    doc(
                        db,
                        "customers",
                        customerId
                    );

                await setDoc(

                    ref,

                    {
                        mainInvitationImage: url
                    },

                    {
                        merge: true
                    }

                );

                mainInvitationPreview.src =
                    url;

                mainInvitationPreview.style.display =
                    "block";

                mainInvitationImage.value =
                    "";

                alert(
                    "Main Invitation Image Uploaded ✅"
                );

            }

            catch (error) {

                console.error(error);

                alert(
                    "Main Invitation Upload Failed"
                );

            }

            uploadMainInvitationBtn.disabled =
                false;

            uploadMainInvitationBtn.innerText =
                "☁ Upload Main Invitation PNG";

        }
    );

}

/* ===========================
   Hero Page Image Upload
=========================== */

if (uploadHeroImageBtn) {

    uploadHeroImageBtn.addEventListener(
        "click",
        async () => {

            if (!customerId) {

                alert("Customer ID Missing");
                return;

            }

            const file =
                heroImage.files[0];

            if (!file) {

                alert(
                    "Select Hero PNG"
                );

                return;

            }

            uploadHeroImageBtn.disabled =
                true;

            uploadHeroImageBtn.innerText =
                "Uploading...";

            try {

                const url =
                    await uploadFile(file);

                const ref =
                    doc(
                        db,
                        "customers",
                        customerId
                    );

                await setDoc(
                    ref,
                    {
                        heroImage: url
                    },
                    {
                        merge: true
                    }
                );

                heroImagePreview.src =
                    url;

                heroImagePreview.style.display =
                    "block";

                heroImage.value =
                    "";

                alert(
                    "Hero Image Uploaded ✅"
                );

            }

            catch (error) {

                console.error(error);

                alert(
                    "Hero Image Upload Failed"
                );

            }

            uploadHeroImageBtn.disabled =
                false;

            uploadHeroImageBtn.innerText =
                "☁ Upload Hero PNG";

        }
    );

}

/* ===========================
   Gallery Manager
=========================== */

document
.getElementById("galleryBtn")
.addEventListener("click", () => {

    window.location.href =
    "gallery-manager.html?customer=" + customerId;

});

