import {
    getInvitation
} from "./firestore-customers.js";

import {
    db,
    doc,
    updateDoc,
    increment
} from "./firebase.js";

document.addEventListener("DOMContentLoaded", async () => {

"use strict";

/* ==========================================
   Premium Ganpati Invitation V3
   Firestore Only - Fixed Version
========================================== */

const invitation = {

    title: "",
    family: "",
    date: "",
    time: "",
    address: "",
    map: "",
    phone: "",
    whatsapp: "",
    eventDate: "",
    music: "",
    theme: "",
    gallery: [],
    texts: {},
    visibility: {}

};

/* ==========================================
   Customer
========================================== */

const params =
    new URLSearchParams(window.location.search);

const customerId =
    params.get("customer");

/* ==========================================
   Validate Customer ID
========================================== */

if(!customerId){
    alert("Customer ID Missing");
    window.location.href = "index.html";
    throw new Error("Customer ID Missing");
}

/* ==========================================
   Load Firestore Data
========================================== */

try {

    const data =
        await getInvitation(customerId);

    if (!data) {
        throw new Error("Customer Not Found");
    }

    Object.assign(invitation, data);

    /* ===========================
       Default Visibility
    =========================== */

    const defaultVisibility = {
        title: true,
        family: true,
        date: true,
        time: true,
        eventDate: true,
        phone: true,
        whatsapp: true,
        address: true,
        map: true,
        openingHeading: true,
        openingDescription: true,
        openButtonText: true,
        wishScreenHeading: true,
        wishHeading: true,
        wishNameLabel: true,
        wishNamePlaceholder: true,
        wishMessageLabel: true,
        wishMessagePlaceholder: true,
        wishWhatsappButton: true,
        mainHeading: true,
        mainDescription: true
    };

    invitation.visibility = {
        ...defaultVisibility,
        ...(data.visibility || {})
    };

    /* ===========================
       VIEW COUNTER
    =========================== */

    try {
        const customerRef = doc(db, "customers", customerId);
        await updateDoc(customerRef, { views: increment(1) });
        console.log("View Count Updated");
    }
    catch(error){
        console.error("View Counter Error:", error);
    }

    /* ===========================
       Guest Wishes WhatsApp Number
    =========================== */

    window.invitationWhatsapp = invitation.whatsapp;
    window.invitationTitle = invitation.title;
    window.invitationFamily = invitation.family;

    console.log("Invitation Loaded", invitation);

}

catch (error) {
    console.error(error);
    alert("Invitation Data Not Found");
    window.location.href = "index.html";
    return;
}

/* ==========================================
   Render
========================================== */

renderInvitation();
renderGallery(invitation.gallery);
renderAartiPopup();

/* ===========================
   Apply Visibility
=========================== */

applyVisibility(invitation.visibility);

/* ===========================
   Load Theme
=========================== */

const themeBackground = document.getElementById("themeBackground");

if(themeBackground && invitation.theme){
    themeBackground.style.backgroundImage = `url(${invitation.theme})`;
    themeBackground.style.backgroundSize = "cover";
    themeBackground.style.backgroundPosition = "center";
}

const mainCard = document.querySelector(".mainInvitation .card");

if(mainCard && invitation.theme){
    mainCard.style.backgroundImage = `url(${invitation.theme})`;
    mainCard.style.backgroundSize = "cover";
    mainCard.style.backgroundPosition = "center";
    mainCard.style.borderRadius = "25px";
    mainCard.style.border = "2px solid #d4af37";
    mainCard.style.boxShadow = "0 0 40px rgba(255,215,0,.3)";
}

/* ===========================
   Load All Music
=========================== */

const bgMusic = document.getElementById("bgMusic");
const bell = document.getElementById("bell");
const voiceOver = document.getElementById("voiceOver");

if(invitation.music){

    if(bgMusic && invitation.music.bgMusic){
        bgMusic.src = invitation.music.bgMusic;
        bgMusic.load();
    }

    if(bell && invitation.music.bellMusic){
        bell.src = invitation.music.bellMusic;
        bell.load();
    }

    if(voiceOver && invitation.music.voiceOver){
        voiceOver.src = invitation.music.voiceOver;
        voiceOver.load();
    }

}

startCountdown(invitation.eventDate);
galleryViewer();
musicControl();
shareSystem();

const enterBtn = document.getElementById("enterBtn");

if(enterBtn){
    enterBtn.onclick = () => {
        enterBtn.style.display = "none";
        doorAnimation();
    };
}

/* ==========================================
   Render Invitation
========================================== */

function renderInvitation() {

    const texts = invitation.texts || {};

    const openingHeading = document.getElementById("openingHeading");
    if(openingHeading && texts.openingHeading){
        openingHeading.textContent = texts.openingHeading;
    }

    const openingDescription = document.getElementById("openingDescription");
    if(openingDescription && texts.openingDescription){
        openingDescription.textContent = texts.openingDescription;
    }

    const openInvitation = document.getElementById("openInvitation");
    if(openInvitation && texts.openButtonText){
        openInvitation.textContent = texts.openButtonText;
    }

    const wishScreenHeading = document.getElementById("wishScreenHeading");
    if(wishScreenHeading && texts.wishScreenHeading){
        wishScreenHeading.textContent = texts.wishScreenHeading;
    }

    const wishPopupHeading = document.getElementById("wishHeading");
    if(wishPopupHeading && texts.wishHeading){
        wishPopupHeading.textContent = texts.wishHeading;
    }

    setText("wishNameLabel", texts.wishNameLabel);
    setText("wishMessageLabel", texts.wishMessageLabel);

    const wishName = document.getElementById("wishName");
    if(wishName && texts.wishNamePlaceholder){
        wishName.placeholder = texts.wishNamePlaceholder;
    }

    const wishMessage = document.getElementById("wishMessage");
    if(wishMessage && texts.wishMessagePlaceholder){
        wishMessage.placeholder = texts.wishMessagePlaceholder;
    }

    const sendWishBtn = document.getElementById("sendWishWhatsapp");
    if(sendWishBtn && texts.wishWhatsappButton){
        sendWishBtn.textContent = texts.wishWhatsappButton;
    }

    const mainHeading = document.getElementById("mainHeading");
    if(mainHeading && texts.mainHeading){
        mainHeading.textContent = texts.mainHeading;
    }

    const mainDescription = document.getElementById("mainDescription");
    if(mainDescription && texts.mainDescription){
        mainDescription.textContent = texts.mainDescription;
    }

    setText("title", invitation.title);
    setText("family", invitation.family);
    setText("date", invitation.date);
    setText("time", invitation.time);
    setText("address", invitation.address);

    if (invitation.title) {
        document.title = invitation.title + " | Ganpati Invitation";
    }

    const mapBtn = document.getElementById("mapBtn");
    if (mapBtn) {
        if (invitation.map) {
            mapBtn.href = invitation.map;
            mapBtn.target = "_blank";
        } else {
            mapBtn.style.display = "none";
        }
    }

    const callBtn = document.getElementById("callBtn");
    if (callBtn) {
        if (invitation.phone) {
            callBtn.href = "tel:" + invitation.phone;
        } else {
            callBtn.style.display = "none";
        }
    }

    const whatsappBtn = document.getElementById("whatsappBtn");
    if (whatsappBtn) {
        if (invitation.whatsapp) {
            const number = invitation.whatsapp.replace(/\D/g, "");
            const message = `🙏 ${invitation.title}\n\nआपणास व आपल्या संपूर्ण कुटुंबास\nश्री गणेश उत्सवाच्या मंगल प्रसंगी\nसहकुटुंब उपस्थित राहण्याचे\nआग्रहाचे निमंत्रण.\n\n📅 ${invitation.date}\n\n🕙 ${invitation.time}\n\n📍 ${invitation.address}\n\n🌐 ${window.location.href}`;
            whatsappBtn.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        } else {
            whatsappBtn.style.display = "none";
        }
    }

}

/* ==========================================
   Visibility System
========================================== */

function applyVisibility(visibility = {}) {

    setElementVisibility("title", visibility.title);
    setElementVisibility("family", visibility.family);
    setElementVisibility("date", visibility.date);
    setElementVisibility("time", visibility.time);
    setElementVisibility("address", visibility.address);
    setElementVisibility("callBtn", visibility.phone);
    setElementVisibility("whatsappBtn", visibility.whatsapp);
    setElementVisibility("mapBtn", visibility.map);

    applyEventDateVisibility(visibility.eventDate);

    setElementVisibility("openingHeading", visibility.openingHeading);
    setElementVisibility("openingDescription", visibility.openingDescription);
    setElementVisibility("openInvitation", visibility.openButtonText);
    setElementVisibility("wishScreenHeading", visibility.wishScreenHeading);
    setElementVisibility("wishHeading", visibility.wishHeading);
    setElementVisibility("wishNameLabel", visibility.wishNameLabel);
    setElementVisibility("wishName", visibility.wishNamePlaceholder);
    setElementVisibility("wishMessageLabel", visibility.wishMessageLabel);
    setElementVisibility("wishMessage", visibility.wishMessagePlaceholder);
    setElementVisibility("sendWishWhatsapp", visibility.wishWhatsappButton);
    setElementVisibility("mainHeading", visibility.mainHeading);
    setElementVisibility("mainDescription", visibility.mainDescription);

}

function setElementVisibility(id, visible){

    const element = document.getElementById(id);
    if(!element) return;

    const cardFields = ["date", "time", "address"];
    let target = element;

    if(cardFields.includes(id)){
        target = element.parentElement || element;
    }

    if(visible === false){
        target.style.display = "none";
    } else {
        target.style.display = "";
    }

}

function applyEventDateVisibility(visible){

    const days = document.getElementById("days");
    let countdownContainer = null;

    if(days){
        countdownContainer = days.closest(".countdown");
        if(!countdownContainer) countdownContainer = days.parentElement;
    }

    if(countdownContainer){
        countdownContainer.style.display = (visible === false) ? "none" : "";
    }

}

/* ==========================================
   Open Invitation Button
========================================== */

const openBtn = document.getElementById("openInvitation");
const mainInvitation = document.getElementById("mainInvitation");

if (openBtn) {

    openBtn.addEventListener("click", (e) => {

        e.preventDefault();

        if (mainInvitation) {

            mainInvitation.classList.add("show");

            const hero = document.getElementById("hero");
            const wish = document.getElementById("wishScreen");
            const door = document.getElementById("door");

            if (hero) hero.style.display = "none";
            if (wish) wish.classList.remove("show");
            if (door) door.style.display = "none";

            mainInvitation.scrollIntoView({ behavior: "smooth" });

        }

        const bgMusic = document.getElementById("bgMusic");
        const musicBtn = document.getElementById("musicBtn");
        const voiceOver = document.getElementById("voiceOver");

        if(voiceOver && invitation.music && invitation.music.voiceOver){

            voiceOver.src = invitation.music.voiceOver;
            voiceOver.currentTime = 0;
            voiceOver.play().catch(()=>{});

            voiceOver.onended = ()=>{
                if(bgMusic && invitation.music.bgMusic){
                    bgMusic.src = invitation.music.bgMusic;
                    bgMusic.play().catch(()=>{});
                }
            };

        } else {
            if(bgMusic && invitation.music && invitation.music.bgMusic){
                bgMusic.src = invitation.music.bgMusic;
                bgMusic.play().catch(()=>{});
            }
        }

        if (musicBtn) {
            musicBtn.textContent = "⏸️";
            musicBtn.classList.add("playing");
        }

    });

}

/* ==========================================
   Countdown
========================================== */

function startCountdown(date) {

    if (!date) return;

    const timer = setInterval(() => {

        const target = new Date(date).getTime();
        const now = Date.now();
        const distance = target - now;

        if (distance <= 0) {
            clearInterval(timer);
            return;
        }

        const days = document.getElementById("days");
        const hours = document.getElementById("hours");
        const minutes = document.getElementById("minutes");
        const seconds = document.getElementById("seconds");

        if(days) days.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
        if(hours) hours.textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if(minutes) minutes.textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        if(seconds) seconds.textContent = Math.floor((distance % (1000 * 60)) / 1000);

    }, 1000);

}

/* ==========================================
   Gallery
========================================== */

function renderGallery(gallery = []) {

    const galleryGrid = document.getElementById("galleryGrid");
    if (!galleryGrid) return;

    galleryGrid.innerHTML = "";

    if (gallery.length === 0) {
        galleryGrid.innerHTML = "<p>Gallery Coming Soon...</p>";
        return;
    }

    gallery.forEach(image => {

        const card = document.createElement("div");
        card.className = "gallery-card reveal";

        const img = document.createElement("img");
        img.src = image;
        img.className = "galleryImage";
        img.alt = "Gallery Image";
        img.loading = "lazy";

        card.appendChild(img);
        galleryGrid.appendChild(card);

    });

}

/* ==========================================
   Aarti Popup
========================================== */

function renderAartiPopup(){

    const list = document.getElementById("aartiListPopup");
    if(!list) return;

    list.innerHTML = "";

    if(!invitation.aarti || invitation.aarti.length === 0){
        list.innerHTML = "<p style='text-align:center'>No Aarti Available</p>";
        return;
    }

    const aartiList = [...(invitation.aarti || [])];
    aartiList.sort((a,b) => Number(b.favorite) - Number(a.favorite));

    aartiList.forEach(item=>{

        const btn = document.createElement("button");
        btn.className = "aartiItem";
        btn.innerHTML = (item.favorite ? "⭐🙏 " : "🙏 ") + escapeHtml(item.name);
        btn.onclick = ()=> playAarti(item.url);
        list.appendChild(btn);

    });

}

/* ==========================================
   Gallery Viewer
========================================== */

function galleryViewer() {

    const viewer = document.getElementById("viewer");
    const viewerImg = document.getElementById("viewerImg");
    const close = document.getElementById("closeViewer");

    document.addEventListener("click", (e) => {

        if (!e.target.classList.contains("galleryImage")) return;

        if(viewerImg) viewerImg.src = e.target.src;
        if(viewer) viewer.classList.add("show");

    });

    if (close) {
        close.onclick = () => {
            if(viewer) viewer.classList.remove("show");
        };
    }

    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape" && viewer){
            viewer.classList.remove("show");
        }
    });

    if(viewer){
        viewer.addEventListener("click", (e) => {
            if(e.target === viewer){
                viewer.classList.remove("show");
            }
        });
    }

}

/* ==========================================
   Play Aarti
========================================== */

function playAarti(url){

    const popup = document.getElementById("aartiPopup");
    const player = document.getElementById("aartiPlayer");
    const bgMusic = document.getElementById("bgMusic");

    if(!player) return;

    if(bgMusic) bgMusic.pause();

    player.src = url;
    player.currentTime = 0;
    player.play().catch(()=>{});

    const aartiBtn = document.getElementById("aartiBtn");
    if(aartiBtn) aartiBtn.classList.add("playing");

    if(popup) popup.classList.remove("show");

}

/* ==========================================
   Share System
========================================== */

function shareSystem(){

    const shareBtn = document.getElementById("shareBtn");
    if(!shareBtn) return;

    shareBtn.onclick = async ()=>{

        try{
            const customerRef = doc(db, "customers", customerId);
            await updateDoc(customerRef, { shares: increment(1) });
        } catch(error){
            console.error("Share Counter Error", error);
        }

        const message = `🙏 ${invitation.title}\n\nआपणास व आपल्या संपूर्ण कुटुंबास\nश्री गणेश उत्सवाच्या मंगल प्रसंगी\nसहकुटुंब उपस्थित राहण्याचे आग्रहाचे निमंत्रण.\n\n📅 ${invitation.date}\n\n🕙 ${invitation.time}\n\n📍 ${invitation.address}\n\n🌐 ${window.location.href}`;

        if(navigator.share){
            try{
                await navigator.share({
                    title: invitation.title,
                    text: message,
                    url: window.location.href
                });
            } catch(e){}
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = window.location.href;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
            alert("Invitation Link Copied ✅");
        }

    };

}

/* ==========================================
   Music
========================================== */

function musicControl() {

    const music = document.getElementById("bgMusic");
    const btn = document.getElementById("musicBtn");

    if (!music || !btn) return;

    function update() {
        if (music.paused) {
            btn.textContent = "▶️";
            btn.classList.remove("playing");
        } else {
            btn.textContent = "⏸️";
            btn.classList.add("playing");
        }
    }

    update();

    btn.addEventListener("click", async () => {
        if (music.paused) {
            try { await music.play(); } catch (e) {}
        } else {
            music.pause();
        }
        update();
    });

    music.addEventListener("play", update);
    music.addEventListener("pause", update);

}

/* ==========================================
   Door Animation
========================================== */

function doorAnimation(){

    const door = document.getElementById("door");
    if(!door) return;

    door.classList.add("open");

    const bell = document.getElementById("bell");

    if(bell && invitation.music && invitation.music.bellMusic){
        bell.src = invitation.music.bellMusic;
        bell.currentTime = 0;
        bell.play().catch(()=>{});
    }

    setTimeout(()=>{
        door.style.display = "none";
        wishScreen();
    },2500);

}

/* ==========================================
   Wish Screen
========================================== */

function wishScreen(){

    const wish = document.getElementById("wishScreen");
    const hero = document.getElementById("hero");

    if(!wish) return;

    wish.classList.add("show");

    setTimeout(()=>{
        wish.classList.remove("show");
        if(hero) hero.classList.add("show");
    },4000);

}

/* ==========================================
   Text Helper
========================================== */

function setText(id, value) {

    const element = document.getElementById(id);
    if(!element) return;

    if(value !== undefined && value !== null && value !== ""){
        element.textContent = value;
    }

}

/* ==========================================
   XSS Protection Helper
========================================== */

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

/* ==========================================
   Falling Flowers
========================================== */

const FLOWER_IMAGES = [
    "assets/images/flowers/flower1.png",
    "assets/images/flowers/flower2.png",
    "assets/images/flowers/flower3.png",
    "assets/images/flowers/flower4.png",
    "assets/images/flowers/flower5.png",
    "assets/images/flowers/flower6.png",
    "assets/images/flowers/flower7.png",
    "assets/images/flowers/petal.png"
];

function preloadFlowerImages() {
    FLOWER_IMAGES.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function createFlower() {

    const container = document.getElementById("flowerContainer");
    if (!container) return;

    const flower = document.createElement("img");
    const randomIndex = Math.floor(Math.random() * FLOWER_IMAGES.length);
    flower.src = FLOWER_IMAGES[randomIndex];
    flower.className = "flower";

    flower.style.left = Math.random() * 100 + "vw";

    const size = 15 + Math.random() * 15;
    flower.style.width = size + "px";
    flower.style.height = "auto";

    flower.style.animationDuration = (5 + Math.random() * 4) + "s";
    flower.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(flower);

    flower.addEventListener("animationend", () => {
        flower.remove();
    });

}

function startFlowerAnimation() {
    preloadFlowerImages();
    setInterval(createFlower, 300);
}

startFlowerAnimation();

/* ==========================================
   Aarti Popup Buttons
========================================== */

const aartiBtn = document.getElementById("aartiBtn");
const aartiPopup = document.getElementById("aartiPopup");
const closeAarti = document.getElementById("closeAarti");
const aartiPlayer = document.getElementById("aartiPlayer");
const stopAartiBtn = document.getElementById("stopAartiBtn");

if(aartiBtn){
    aartiBtn.onclick = () => {
        if(!aartiPopup) return;
        aartiPopup.classList.add("show");
    };
}

if(closeAarti){
    closeAarti.onclick = () => {
        if(aartiPopup) aartiPopup.classList.remove("show");
    };
}

if(stopAartiBtn){
    stopAartiBtn.onclick = () => {

        if(aartiPlayer){
            aartiPlayer.pause();
            aartiPlayer.currentTime = 0;
        }

        if(aartiBtn) aartiBtn.classList.remove("playing");

        const bgMusic = document.getElementById("bgMusic");
        if(bgMusic){
            bgMusic.pause();
            const musicBtn = document.getElementById("musicBtn");
            if(musicBtn){
                musicBtn.textContent = "▶️";
                musicBtn.classList.remove("playing");
            }
            bgMusic.currentTime = 0;
        }

        if(aartiPopup) aartiPopup.classList.remove("show");

    };
}

if(aartiPopup){
    aartiPopup.addEventListener("click", (e) => {
        if(e.target === aartiPopup){
            aartiPopup.classList.remove("show");
        }
    });
}

/* ==========================================
   Invitator Slider
========================================== */

const cards = [...document.querySelectorAll(".invitor-card")];
const dotsWrap = document.getElementById("sliderDots");
let activeIndex = 0;

if(dotsWrap){
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Invitor ${i + 1}`);
      dot.addEventListener("click", () => showInvitor(i));
      dotsWrap.appendChild(dot);
    });
}

function showInvitor(index) {
  activeIndex = (index + cards.length) % cards.length;
  cards.forEach((card, i) => card.classList.toggle("active", i === activeIndex));
  if(dotsWrap){
    [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === activeIndex));
  }
}

const prevInvitor = document.getElementById("prevInvitor");
const nextInvitor = document.getElementById("nextInvitor");

if(prevInvitor) prevInvitor.addEventListener("click", () => showInvitor(activeIndex - 1));
if(nextInvitor) nextInvitor.addEventListener("click", () => showInvitor(activeIndex + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") showInvitor(activeIndex - 1);
  if (e.key === "ArrowRight") showInvitor(activeIndex + 1);
});

/* ==========================================
   Location Section - Satellite Map Load
========================================== */

const mapIframe = document.getElementById("mapIframe");
if(mapIframe && invitation.address){
    mapIframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(invitation.address) + "&t=k&z=16&output=embed";
}

const mapCard = document.getElementById("mapCard");
const mapLinkText = document.getElementById("mapLinkText");

if(mapCard && invitation.map){
    mapCard.style.cursor = "pointer";
    mapCard.addEventListener("click", () => {
        window.open(invitation.map, "_blank");
    });
}

const locationName = document.getElementById("locationName");
if(locationName){
    locationName.textContent = invitation.locationName || "स्थळाचे नाव";
}

const locationAddress = document.getElementById("locationAddress");
if(locationAddress){
    locationAddress.textContent = invitation.locationAddress || "संपूर्ण पत्ता येथे लिहा";
}

if(mapLinkText){
    mapLinkText.textContent = "Google Map उघडण्यासाठी क्लिक करा ↗";
}

});


/* =========================================================
   SHUBHECHHA ENVELOPE — GLOBAL FUNCTIONS (बाहेर ठेवा)
========================================================= */

let letterOpenedGanpati = false;

window.openLetterGanpati = function() {

    console.log("Open Letter Clicked!");

    var letterEnvelope = document.getElementById("letterEnvelope");
    var letterCard = document.getElementById("letterCard");

    if (!letterEnvelope || !letterCard) {
        console.error("Envelope or Letter Card not found!");
        return;
    }

    if (letterOpenedGanpati) return;
    letterOpenedGanpati = true;

    // Background music बंद करा
    var bgMusic = document.getElementById("bgMusic");
    if (bgMusic) bgMusic.pause();

    // Envelope opening animation
    letterEnvelope.classList.add("envelopeOpeningGanpati");

    // Envelope नंतर letter दाखवा
    setTimeout(function() {

        letterEnvelope.style.display = "none";

        letterCard.style.display = "block";
        letterCard.classList.remove("hidden");

        // Voiceover सुरू करा
        var voiceOver = document.getElementById("voiceOverShubhechha");
        if (voiceOver) {
            voiceOver.currentTime = 0;
            voiceOver.play().catch(function() {});
        }

    }, 1300);

};


window.closeLetterGanpati = function() {

    console.log("Close Letter Clicked!");

    var letterEnvelope = document.getElementById("letterEnvelope");
    var letterCard = document.getElementById("letterCard");

    letterOpenedGanpati = false;

    // Voiceover बंद करा
    var voiceOver = document.getElementById("voiceOverShubhechha");
    if (voiceOver) {
        voiceOver.pause();
        voiceOver.currentTime = 0;
    }

    // Letter लपवा
    if (letterCard) {
        letterCard.style.display = "none";
    }

    // Envelope पुन्हा दाखवा
    if (letterEnvelope) {
        letterEnvelope.style.display = "flex";
        letterEnvelope.classList.remove("envelopeOpeningGanpati");
    }

    // Background music सुरू करा
    var bgMusic = document.getElementById("bgMusic");
    if (bgMusic) bgMusic.play().catch(function() {});

};


/* =========================================================
   VOICEOVER SETUP
========================================================= */

window.addEventListener("load", function() {

    var voiceOver = document.getElementById("voiceOverShubhechha");

    if (voiceOver) {

        voiceOver.src = "assets/voice/shubhechha.mp3";
        voiceOver.preload = "auto";
        voiceOver.volume = 1;

        voiceOver.addEventListener("play", function() {
            var bgMusic = document.getElementById("bgMusic");
            if (bgMusic) bgMusic.pause();
        });

        voiceOver.addEventListener("ended", function() {
            var bgMusic = document.getElementById("bgMusic");
            if (bgMusic) bgMusic.play().catch(function() {});
        });

    }

});