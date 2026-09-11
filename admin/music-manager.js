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
   Customer ID
=========================== */

const params =
new URLSearchParams(window.location.search);

const customerId =
params.get("customer");

/* ===========================
   Validate Customer ID
=========================== */

if(!customerId){
    alert("Customer ID Missing");
    window.location.href = "dashboard.html";
    throw new Error("Customer ID Missing");
}

/* ===========================
   Elements
=========================== */

const customerInfo =
document.getElementById("customerInfo");

const backBtn =
document.getElementById("backBtn");

/* Files */

const bgMusicFile =
document.getElementById("bgMusicFile");

const bellMusicFile =
document.getElementById("bellMusicFile");

const voiceFile =
document.getElementById("voiceFile");

/* Buttons */

const uploadBgBtn =
document.getElementById("uploadBgBtn");

const uploadBellBtn =
document.getElementById("uploadBellBtn");

const uploadVoiceBtn =
document.getElementById("uploadVoiceBtn");

/* Preview */

const bgPreview =
document.getElementById("bgPreview");

const bellPreview =
document.getElementById("bellPreview");

const voicePreview =
document.getElementById("voicePreview");

/* Delete */

const deleteBgBtn =
document.getElementById("deleteBgBtn");

const deleteBellBtn =
document.getElementById("deleteBellBtn");

const deleteVoiceBtn =
document.getElementById("deleteVoiceBtn");

/* ===========================
   State Management
=========================== */

let musicData = {

    enabled:true,

    bgMusic:"",

    bellMusic:"",

    voiceOver:""

};

let isUploading = false;

/* ===========================
   Load Music
=========================== */

async function loadMusic(){

    if(!customerId){

        alert("Customer ID Missing");
        return;

    }

    try {

        const ref =
        doc(db,"customers",customerId);

        const snap =
        await getDoc(ref);

        if(!snap.exists()){

            alert("Customer Not Found");
            window.location.href = "dashboard.html";
            return;

        }

        const data =
        snap.data();

        customerInfo.innerText =
        "Customer : " +
        (data.family || customerId);

        if(data.music){

            musicData = {

                ...musicData,
                ...data.music

            };

        }

        showPreview();

        console.log("Music Loaded:", musicData);

    } catch(error) {

        console.error("Error loading music:", error);
        alert("Error loading music: " + error.message);

    }

}

/* ===========================
   Show Preview
=========================== */

function showPreview(){

    /* Background Music */
    if(musicData.bgMusic){

        bgPreview.src =
        musicData.bgMusic;

        bgPreview.style.display="block";

        deleteBgBtn.style.display="inline-block";

    } else {

        bgPreview.style.display="none";
        bgPreview.src = "";
        deleteBgBtn.style.display="none";

    }

    /* Bell Music */
    if(musicData.bellMusic){

        bellPreview.src =
        musicData.bellMusic;

        bellPreview.style.display="block";

        deleteBellBtn.style.display="inline-block";

    } else {

        bellPreview.style.display="none";
        bellPreview.src = "";
        deleteBellBtn.style.display="none";

    }

    /* Voice Over */
    if(musicData.voiceOver){

        voicePreview.src =
        musicData.voiceOver;

        voicePreview.style.display="block";

        deleteVoiceBtn.style.display="inline-block";

    } else {

        voicePreview.style.display="none";
        voicePreview.src = "";
        deleteVoiceBtn.style.display="none";

    }

}

/* ===========================
   Save Music
=========================== */

async function saveMusic(){

    try {

        await setDoc(

            doc(db,"customers",customerId),

            {
                music:musicData
            },

            {
                merge:true
            }

        );

        console.log(
            "Music Saved",
            musicData
        );

    } catch(error) {

        console.error("Save Music Error:", error);
        throw error;

    }

}

/* ===========================
   Upload Music
=========================== */

async function uploadMusic(type,file){

    if(!file){

        alert("Select Audio File");
        return;

    }

    // Validate file type
    if(!file.type.startsWith("audio/")){
        alert("Please select an audio file");
        return;
    }

    // Validate file size (max 10MB)
    if(file.size > 10 * 1024 * 1024){
        alert("Audio file size should be less than 10MB");
        return;
    }

    if(isUploading){
        alert("Upload already in progress. Please wait.");
        return;
    }

    let button = null;

    if(type==="bg"){

        button = uploadBgBtn;

    }

    if(type==="bell"){

        button = uploadBellBtn;

    }

    if(type==="voice"){

        button = uploadVoiceBtn;

    }

    if(!button) return;

    isUploading = true;

    const oldText = button.innerHTML;

    button.disabled = true;
    button.innerHTML = "Uploading...";

    try{

        const url = await uploadFile(file);

        if(type==="bg"){

            musicData.bgMusic = url;

        }

        if(type==="bell"){

            musicData.bellMusic = url;

        }

        if(type==="voice"){

            musicData.voiceOver = url;

        }

        musicData.enabled = true;

        await saveMusic();

        showPreview();

        // Clear file input
        if(type==="bg") bgMusicFile.value = "";
        if(type==="bell") bellMusicFile.value = "";
        if(type==="voice") voiceFile.value = "";

        alert("✅ Music Uploaded Successfully");

    }

    catch(error){

        console.error(error);

        alert("❌ Upload Failed: " + error.message);

    }

    finally{

        isUploading = false;

        button.disabled = false;
        button.innerHTML = oldText;

    }

}

/* ===========================
   Delete Music
=========================== */

async function deleteMusic(type){

    if(!confirm(`Delete ${type === 'bg' ? 'Background' : type === 'bell' ? 'Bell' : 'Voice Over'} music?`)){
        return;
    }

    try {

        if(type==="bg"){

            musicData.bgMusic="";

        }

        if(type==="bell"){

            musicData.bellMusic="";

        }

        if(type==="voice"){

            musicData.voiceOver="";

        }

        await saveMusic();

        showPreview();

        alert("Music Deleted ✅");

    } catch(error) {

        console.error("Delete Music Error:", error);
        alert("Delete Failed: " + error.message);

    }

}

/* ===========================
   Event Listeners
=========================== */

/* Upload Buttons */

if(uploadBgBtn){
    uploadBgBtn.onclick = ()=>{
        uploadMusic("bg", bgMusicFile.files[0]);
    };
}

if(uploadBellBtn){
    uploadBellBtn.onclick = ()=>{
        uploadMusic("bell", bellMusicFile.files[0]);
    };
}

if(uploadVoiceBtn){
    uploadVoiceBtn.onclick = ()=>{
        uploadMusic("voice", voiceFile.files[0]);
    };
}

/* Delete Buttons */

if(deleteBgBtn){
    deleteBgBtn.onclick = ()=>deleteMusic("bg");
}

if(deleteBellBtn){
    deleteBellBtn.onclick = ()=>deleteMusic("bell");
}

if(deleteVoiceBtn){
    deleteVoiceBtn.onclick = ()=>deleteMusic("voice");
}

/* File Input Change Events */

if(bgMusicFile){
    bgMusicFile.addEventListener("change", () => {
        if(bgMusicFile.files.length > 0){
            uploadBgBtn.innerHTML = "☁ Upload " + bgMusicFile.files[0].name;
        } else {
            uploadBgBtn.innerHTML = "☁ Upload Background Music";
        }
    });
}

if(bellMusicFile){
    bellMusicFile.addEventListener("change", () => {
        if(bellMusicFile.files.length > 0){
            uploadBellBtn.innerHTML = "☁ Upload " + bellMusicFile.files[0].name;
        } else {
            uploadBellBtn.innerHTML = "☁ Upload Bell Music";
        }
    });
}

if(voiceFile){
    voiceFile.addEventListener("change", () => {
        if(voiceFile.files.length > 0){
            uploadVoiceBtn.innerHTML = "☁ Upload " + voiceFile.files[0].name;
        } else {
            uploadVoiceBtn.innerHTML = "☁ Upload Voice Over";
        }
    });
}

/* Preview Events */

if(bgPreview){
    bgPreview.addEventListener("play", () => {
        // Pause other previews
        if(bellPreview && !bellPreview.paused) bellPreview.pause();
        if(voicePreview && !voicePreview.paused) voicePreview.pause();
    });
}

if(bellPreview){
    bellPreview.addEventListener("play", () => {
        // Pause other previews
        if(bgPreview && !bgPreview.paused) bgPreview.pause();
        if(voicePreview && !voicePreview.paused) voicePreview.pause();
    });
}

if(voicePreview){
    voicePreview.addEventListener("play", () => {
        // Pause other previews
        if(bgPreview && !bgPreview.paused) bgPreview.pause();
        if(bellPreview && !bellPreview.paused) bellPreview.pause();
    });
}

/* ===========================
   Back Button
=========================== */

if(backBtn){
    backBtn.onclick = ()=>{
        window.location.href =
        "customer-dashboard.html?customer=" +
        encodeURIComponent(customerId);
    };
}

/* ===========================
   Keyboard Shortcuts
=========================== */

document.addEventListener("keydown", (e) => {
    // ESC key to go back
    if(e.key === "Escape"){
        window.location.href =
        "customer-dashboard.html?customer=" +
        encodeURIComponent(customerId);
    }
});

/* ===========================
   Start
=========================== */

loadMusic();