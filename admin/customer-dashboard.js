console.log("CUSTOMER DASHBOARD JS VERSION = FIXED");

import {
    db,
    doc,
    getDoc,
    setDoc,
    deleteDoc
} from "../js/firebase.js";

"use strict";

/* ===========================
   Admin Session Check
=========================== */

const loggedIn =
localStorage.getItem("adminLoggedIn");

if(loggedIn !== "true"){

    window.location.replace("login.html");

    throw new Error("Login Required");

}

/* ===========================
   Customer ID
=========================== */

const params = new URLSearchParams(window.location.search);

const customerId = params.get("customer");

const deleteBtn =
document.getElementById("deleteBtn");

console.log(
    "CUSTOMER ID:",
    customerId
);

/* ===========================
   Validate Customer ID
=========================== */

if(!customerId){
    alert("Customer ID Missing");
    window.location.href = "dashboard.html";
    throw new Error("Customer ID Missing");
}

/* ===========================
   Safe Get Element Helper
=========================== */

function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn("Element not found:", id);
        return null;
    }
    return element;
}

function safeSetValue(id, value) {
    const element = safeGetElement(id);
    if (element) {
        element.value = value || "";
    }
}

function safeSetText(id, value) {
    const element = safeGetElement(id);
    if (element) {
        element.textContent = value || "";
    }
}

/* ===========================
   Invitation Button - Show Invitation Section
=========================== */

const invitationBtn = document.getElementById("invitationBtn");
const invitationSection = document.getElementById("invitationSection");
const pageTitle = document.getElementById("pageTitle");

function showInvitationSection() {
    if(invitationSection) invitationSection.style.display = "block";
    if(pageTitle) pageTitle.textContent = "Invitation Details";
    
    // Active button styling
    if(invitationBtn) invitationBtn.classList.add("active");
}

if(invitationBtn){
    invitationBtn.addEventListener("click", showInvitationSection);
}

/* ===========================
   Gallery Button - Direct Redirect to Gallery Manager
=========================== */

const galleryBtn = document.getElementById("galleryBtn");

if(galleryBtn){
    galleryBtn.addEventListener("click", () => {
        // Direct redirect to gallery-manager.html
        window.location.href = "gallery-manager.html?customer=" + encodeURIComponent(customerId);
    });
}

/* ===========================
   Visibility Settings
=========================== */

const visibilityFields = [

    // Invitation Fields
    "title",
    "family",
    "date",
    "time",
    "eventDate",
    "phone",
    "whatsapp",
    "address",
    "map",
    "locationName",
    "locationAddress",

    // Website Text Fields
    "openingHeading",
    "openingDescription",
    "openButtonText",
    "wishScreenHeading",
    "wishHeading",
    "wishNameLabel",
    "wishNamePlaceholder",
    "wishMessageLabel",
    "wishMessagePlaceholder",
    "wishWhatsappButton",
    "mainHeading",
    "mainDescription"

];

/* ===========================
   Load Visibility Settings
=========================== */

function loadVisibilitySettings(data) {

    const visibility =
        data.visibility || {};

    visibilityFields.forEach(field => {

        const checkbox =
            document.querySelector(
                `.visibility-checkbox[data-field="${field}"]`
            );

        if (!checkbox)
            return;

        /*
           Existing customers:
           If visibility setting does not exist,
           keep checkbox ON by default.
        */

        if (
            visibility[field] === undefined
        ) {

            checkbox.checked = true;

        } else {

            checkbox.checked =
                visibility[field] === true;

        }

    });

}

/* ===========================
   Get Visibility Settings
=========================== */

function getVisibilitySettings() {

    const visibility = {};

    visibilityFields.forEach(field => {

        const checkbox =
            document.querySelector(
                `.visibility-checkbox[data-field="${field}"]`
            );

        visibility[field] =
            checkbox ? checkbox.checked : true;

    });

    return visibility;

}

/* ===========================
   Load Customer
=========================== */

async function loadCustomer() {

    if (!customerId) {

        alert("Customer ID Missing");

        return;

    }

    try {

        const ref = doc(
            db,
            "customers",
            customerId
        );

        const snap = await getDoc(ref);

        if (!snap.exists()) {

            alert("Customer Not Found");

            window.location.href = "dashboard.html";
            return;

        }

        const data = snap.data();

        safeSetText("customerFamily", data.family || data.name || customerId);

        safeSetText("customerId", "Customer ID : " + customerId);

        /* ===========================
           Auto Fill - Invitation Fields
        =========================== */

        safeSetValue("title", data.title);
        safeSetValue("family", data.family);
        safeSetValue("eventDate", data.eventDate);
        safeSetValue("phone", data.phone);
        safeSetValue("address", data.address);
        safeSetValue("whatsapp", data.whatsapp);
        safeSetValue("map", data.map);
        safeSetValue("theme", data.theme);
        safeSetValue("date", data.date);
        safeSetValue("time", data.time);
        
        // Location Settings
        safeSetValue("locationName", data.locationName);
        safeSetValue("locationAddress", data.locationAddress);

        /* ===========================
           Load Visibility
        =========================== */

        loadVisibilitySettings(data);

        /* ===========================
           Website Texts Load
        =========================== */

        const texts = data.texts || {};

        safeSetValue("openingHeading", texts.openingHeading || "॥ श्री गणेशाय नमः ॥");
        safeSetValue("openingDescription", texts.openingDescription || "आमच्या घरी आयोजित श्री गणेश उत्सवाच्या मंगल प्रसंगी आपण सहकुटुंब उपस्थित राहावे ही नम्र विनंती.");
        safeSetValue("openButtonText", texts.openButtonText || "Open Main Invitation");
        safeSetValue("wishScreenHeading", texts.wishScreenHeading || "गणेश चतुर्थीच्या हार्दिक शुभेच्छा");
        safeSetValue("wishHeading", texts.wishHeading || "💌 शुभेच्छा पाठवा");
        safeSetValue("wishNameLabel", texts.wishNameLabel || "तुमचे नाव");
        safeSetValue("wishNamePlaceholder", texts.wishNamePlaceholder || "तुमचे नाव");
        safeSetValue("wishMessageLabel", texts.wishMessageLabel || "शुभेच्छा संदेश");
        safeSetValue("wishMessagePlaceholder", texts.wishMessagePlaceholder || "तुमचा संदेश लिहा");
        safeSetValue("wishWhatsappButton", texts.wishWhatsappButton || "💚 WhatsApp वर पाठवा");
        safeSetValue("mainHeading", texts.mainHeading || "श्री गणेशाय नमः");
        safeSetValue("mainDescription", texts.mainDescription || "आपणास व आपल्या संपूर्ण कुटुंबास श्री गणेश उत्सवाच्या मंगल प्रसंगी सहकुटुंब उपस्थित राहण्याचे आग्रहाचे निमंत्रण.");

        console.log(
            "Customer Loaded :",
            data
        );

    }

    catch (error) {

        console.error(error);

        alert("Error loading customer: " + error.message);

    }

}

/* ===========================
   Back Button
=========================== */

document
.getElementById("backBtn")
.addEventListener("click", () => {

    window.location.href =
        "dashboard.html";

});

/* ===========================
   Start
=========================== */

loadCustomer();

/* ===========================
   Delete Customer
=========================== */

if(deleteBtn){

    deleteBtn.addEventListener("click", async()=>{

        if(!confirm("Delete this customer?"))
            return;

        try{

            await deleteDoc(
                doc(db,"customers",customerId)
            );

            alert("Customer Deleted ✅");

            window.location.href =
                "dashboard.html";

        }

        catch(error){

            console.error(error);

            alert("Delete Failed: " + error.message);

        }

    });

}

/* ===========================
   Save Invitation - ONLY on Button Click
=========================== */

document
.getElementById("saveBtn")
.addEventListener("click", saveCustomer);

async function saveCustomer() {

    const saveBtn =
        document.getElementById("saveBtn");

    const oldText =
        saveBtn.innerHTML;

    saveBtn.disabled = true;

    saveBtn.innerHTML =
        "Saving...";

    try {

        await setDoc(

            doc(
                db,
                "customers",
                customerId
            ),

            {

                title: safeGetElement("title")?.value || "",
                family: safeGetElement("family")?.value || "",
                eventDate: safeGetElement("eventDate")?.value || "",
                phone: safeGetElement("phone")?.value || "",
                address: safeGetElement("address")?.value || "",
                whatsapp: safeGetElement("whatsapp")?.value || "",
                map: safeGetElement("map")?.value || "",
                theme: safeGetElement("theme")?.value || "",
                date: safeGetElement("date")?.value || "",
                time: safeGetElement("time")?.value || "",
                
                /* ===========================
                   Location Settings
                =========================== */
                
                locationName: safeGetElement("locationName")?.value || "",
                locationAddress: safeGetElement("locationAddress")?.value || "",

                /* ===========================
                   Visibility Settings
                =========================== */

                visibility:
                    getVisibilitySettings(),

                /* ===========================
                   Website Texts
                =========================== */

                texts:{

                    openingHeading: safeGetElement("openingHeading")?.value || "",
                    openingDescription: safeGetElement("openingDescription")?.value || "",
                    openButtonText: safeGetElement("openButtonText")?.value || "",
                    wishScreenHeading: safeGetElement("wishScreenHeading")?.value || "",
                    wishHeading: safeGetElement("wishHeading")?.value || "",
                    wishNameLabel: safeGetElement("wishNameLabel")?.value || "",
                    wishNamePlaceholder: safeGetElement("wishNamePlaceholder")?.value || "",
                    wishMessageLabel: safeGetElement("wishMessageLabel")?.value || "",
                    wishMessagePlaceholder: safeGetElement("wishMessagePlaceholder")?.value || "",
                    wishWhatsappButton: safeGetElement("wishWhatsappButton")?.value || "",
                    mainHeading: safeGetElement("mainHeading")?.value || "",
                    mainDescription: safeGetElement("mainDescription")?.value || ""

                }

            },

            {
                merge: true
            }

        );

        alert(
            "✅ Invitation Saved Successfully"
        );

    }

    catch(error){

        console.error(error);

        alert(
            "❌ Save Failed: " + error.message
        );

    }

    finally{

        saveBtn.disabled = false;

        saveBtn.innerHTML =
            oldText;

    }

}

/* ===========================
   Preview
=========================== */

document
.getElementById("previewBtn")
.addEventListener("click", () => {

    window.open(

        "../invitation.html?customer=" +
        encodeURIComponent(customerId),

        "_blank"

    );

});

/* ===========================
   Copy Invitation Link
=========================== */

document
.getElementById("copyLinkBtn")
.addEventListener("click", () => {

    // ✅ तुमचा खरा GitHub Pages Link
    const link =
    "https://invitationstudio.github.io/ganpatiinvitation/invitation.html?customer=" +
    encodeURIComponent(customerId);

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard.writeText(link)
        .then(() => {

            alert(
                "✅ Invitation Link Copied"
            );

        })
        .catch((err) => {

            console.error(err);

            fallbackCopy(link);

        });

    } else {

        fallbackCopy(link);

    }

});

/* ===========================
   Analytics Button
=========================== */

document
.getElementById("analyticsBtn")
.addEventListener("click", async () => {

    const card =
        document.getElementById("analyticsCard");

    if(card.style.display === "none"){

        card.style.display =
            "block";

        try {

            const ref =
                doc(
                    db,
                    "customers",
                    customerId
                );

            const snap =
                await getDoc(ref);

            if(snap.exists()){

                const data =
                    snap.data();

                safeSetText("totalViews", data.views || 0);
                safeSetText("totalShares", data.shares || 0);
                safeSetText("wishesReceived", data.wishes || 0);

                console.log(
                    "Total Views:",
                    data.views || 0
                );

                console.log(
                    "Total Shares:",
                    data.shares || 0
                );

                console.log(
                    "Wishes Received:",
                    data.wishes || 0
                );

            }

        }

        catch(error){

            console.error(
                "Analytics Error:",
                error
            );

            alert("Error loading analytics: " + error.message);

        }

    }

    else{

        card.style.display =
            "none";

    }

});

/* ===========================
   Copy Link Fallback
=========================== */

function fallbackCopy(text){

    const input =
        document.createElement("textarea");

    input.value = text;

    input.style.position = "fixed";
    input.style.opacity = "0";

    document.body.appendChild(input);

    input.select();

    try{
        document.execCommand("copy");
        alert("✅ Invitation Link Copied");
    }
    catch(err){
        console.error("Copy failed:", err);
        prompt("Copy this link:", text);
    }

    document.body.removeChild(input);

}

/* ===========================
   Music Manager Button
=========================== */

document
.getElementById("musicBtn")
.addEventListener("click", () => {

    window.location.href =
        "music-manager.html?customer=" +
        encodeURIComponent(customerId);

});

/* ===========================
   Aarti Manager Button
=========================== */

document
.getElementById("aartiManagerBtn")
.addEventListener("click", () => {

    window.location.href =
        "aarti-manager.html?customer=" +
        encodeURIComponent(customerId);

});

/* ===========================
   Delete Invitation
=========================== */

document
.getElementById("deleteBtn")
.addEventListener(
    "click",
    deleteInvitation
);

async function deleteInvitation(){

    const confirmDelete =
        confirm(
            "Delete Invitation Data?"
        );

    if(!confirmDelete)
        return;

    try{

        await setDoc(

            doc(
                db,
                "customers",
                customerId
            ),

            {

                title:"",
                family:"",
                date:"",
                time:"",
                eventDate:"",
                phone:"",
                whatsapp:"",
                address:"",
                map:"",
                locationName:"",
                locationAddress:""

            },

            {
                merge:true
            }

        );

        alert(
            "Invitation Deleted ✅"
        );

        location.reload();

    }

    catch(error){

        console.error(error);

        alert(
            "Delete Failed: " + error.message
        );

    }

}

/* ===========================
   Theme Manager Button
=========================== */

document
.getElementById("themeBtn")
.addEventListener("click", () => {

    window.location.href =
        "theme-manager.html?customer=" +
        encodeURIComponent(customerId);

});

/* ===========================
   XSS Protection Helper
=========================== */

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

/* ===========================
   Global Error Handler
=========================== */

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    alert('An unexpected error occurred. Please try again.');
});