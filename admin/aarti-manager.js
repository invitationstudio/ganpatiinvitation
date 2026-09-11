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

const params =
new URLSearchParams(window.location.search);

const customerId =
params.get("customer");

const customerInfo =
document.getElementById("customerInfo");

const backBtn =
document.getElementById("backBtn");

/* ===========================
   Elements
=========================== */

const aartiName =
document.getElementById("aartiName");

const aartiFile =
document.getElementById("aartiFile");

const uploadAartiBtn =
document.getElementById("uploadAartiBtn");

const aartiList =
document.getElementById("aartiList");

const searchAarti =
document.getElementById("searchAarti");

/* ===========================
   Data
=========================== */

let aartiData = [];

let currentAudio = null;

/* ===========================
   Load Customer
=========================== */

async function loadAarti(){

    if(!customerId){

        alert("Customer ID Missing");

        return;

    }

    const ref =
    doc(db,"customers",customerId);

    const snap =
    await getDoc(ref);

    if(!snap.exists()){

        alert("Customer Not Found");

        return;

    }

    const data =
    snap.data();

    customerInfo.innerText =
    "Customer : " +
    (data.family || customerId);

    if(Array.isArray(data.aarti)){

        aartiData =
        data.aarti;

    }

    renderAarti();

}

/* ===========================
   Save Firestore
=========================== */

async function saveAarti(){

    await setDoc(

        doc(db,"customers",customerId),

        {

            aarti:aartiData

        },

        {

            merge:true

        }

    );

}

/* ===========================
   Upload
=========================== */

uploadAartiBtn.onclick =
async ()=>{

    if(
        !aartiName.value.trim()
    ){

        alert("Enter Aarti Name");

        return;

    }

    if(
        !aartiFile.files.length
    ){

        alert("Select MP3");

        return;

    }

    uploadAartiBtn.disabled=true;

    uploadAartiBtn.innerText=
    "Uploading...";

    try{

        const url =
        await uploadFile(
            aartiFile.files[0]
        );

        aartiData.push({

    name:
    aartiName.value.trim(),

    url:url,

    favorite:false

});

await saveAarti();

console.log("Saved Aarti :", aartiData);

renderAarti();

aartiName.value="";

        alert("Aarti Uploaded ✅");

    }

    catch(error){

        console.error(error);

        alert("Upload Failed");

    }

    uploadAartiBtn.disabled=false;

    uploadAartiBtn.innerText=
    "⬆ Upload Aarti";

};

/* ===========================
   Render List
=========================== */

function renderAarti(){

    aartiList.innerHTML="";

    const keyword =
    searchAarti.value
    .trim()
    .toLowerCase();

    const filtered =
    aartiData.filter(item=>
        item.name
        .toLowerCase()
        .includes(keyword)
    );

    if(aartiData.length===0){

        aartiList.innerHTML=
        "<p>No Aarti Uploaded</p>";

        return;

    }

    filtered.forEach((item)=>{

    const index =
    aartiData.indexOf(item);

        const card =
document.createElement("div");

card.className = "aartiCard";

        card.innerHTML=`

<div class="aartiCardTop">

<input
class="editName"
type="text"
value="${item.name}">

<button class="saveBtn">
💾 Save
</button>

</div>

<div class="aartiCardActions">

<button class="favoriteBtn">
${item.favorite ? "⭐ Pinned" : "☆ Pin"}
</button>

<button class="playBtn">
▶ Preview
</button>

<button class="deleteBtn">
🗑 Delete
</button>

</div>

`;

        const favoriteBtn =
card.querySelector(".favoriteBtn");

const playBtn =
card.querySelector(".playBtn");

const deleteBtn =
card.querySelector(".deleteBtn");

const saveBtn =
card.querySelector(".saveBtn");

const editName =
card.querySelector(".editName");


saveBtn.onclick = async()=>{

    const newName =
    editName.value.trim();

    if(!newName){

        alert("Enter Aarti Name");

        return;

    }

    saveBtn.disabled = true;

    saveBtn.innerText = "Saving...";

    try{

        item.name = newName;

        await saveAarti();

        alert("✅ Aarti Name Updated");

    }

    catch(error){

        console.error(error);

        alert("❌ Save Failed");

    }

    finally{

        saveBtn.disabled = false;

        saveBtn.innerHTML = "💾 Save";

    }

};

editName.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

        saveBtn.click();

    }

});


favoriteBtn.onclick = async()=>{

    if(item.favorite){

        item.favorite = false;

    }

    else{

        aartiData.forEach(a=>{

            a.favorite = false;

        });

        item.favorite = true;

    }

    aartiData.sort((a,b)=>

        Number(b.favorite) -
        Number(a.favorite)

    );

    await saveAarti();

    renderAarti();

};


        playBtn.onclick = ()=>{

            if(
    currentAudio &&
    !currentAudio.paused &&
    playBtn.innerHTML === "⏸ Stop"
){

    currentAudio.pause();

    currentAudio.currentTime = 0;

    currentAudio = null;

    card.classList.remove("playingCard");

    playBtn.innerHTML = "▶ Preview";

    return;

}

    if(currentAudio){

        currentAudio.pause();
        currentAudio.currentTime = 0;

    }

    document
    .querySelectorAll(".playingCard")
    .forEach(c=>{

        c.classList.remove("playingCard");

    });

    document
    .querySelectorAll(".playBtn")
    .forEach(btn=>{

        btn.innerHTML = "▶ Preview";

    });

    card.classList.add("playingCard");

    playBtn.innerHTML = "⏸ Stop";

    currentAudio = new Audio(item.url);

    currentAudio.play();

    currentAudio.onended = ()=>{

        card.classList.remove("playingCard");

        playBtn.innerHTML = "▶ Preview";

        currentAudio = null;

    };

};

        deleteBtn.onclick = async()=>{

    const confirmDelete = confirm(

        `Delete "${item.name}" ?`

    );

    if(!confirmDelete)
        return;

    deleteBtn.disabled = true;

    deleteBtn.innerText = "Deleting...";

    aartiData.splice(index,1);

    await saveAarti();

    renderAarti();

    alert("Aarti Deleted ✅");

};

aartiList.appendChild(card);

});

}

/* ===========================
   Back
=========================== */

backBtn.onclick=()=>{

    window.location.href=
    "customer-dashboard.html?customer="+
    customerId;

};

/* ===========================
   Start
=========================== */

searchAarti.oninput = ()=>{

    renderAarti();

};


loadAarti();
