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


const params =
new URLSearchParams(window.location.search);


const customerId =
params.get("customer");



const customerInfo =
document.getElementById("customerInfo");


const themeImage =
document.getElementById("themeImage");


const uploadThemeBtn =
document.getElementById("uploadThemeBtn");


const themePreview =
document.getElementById("themePreview");


const backBtn =
document.getElementById("backBtn");



async function loadTheme(){


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



    if(data.theme){

        themePreview.src =
        data.theme;

        themePreview.style.display =
        "block";

    }


}



uploadThemeBtn.onclick =
async()=>{


    const file =
    themeImage.files[0];


    if(!file){

        alert("Select Image");
        return;

    }



    uploadThemeBtn.innerText =
    "Uploading...";



    try{


        const url =
        await uploadFile(file);



        await setDoc(

            doc(db,"customers",customerId),

            {

                theme:url

            },

            {
                merge:true
            }

        );



        themePreview.src =
        url;


        themePreview.style.display =
        "block";


        alert("Theme Uploaded ✅");


    }

    catch(error){


        console.error(error);

        alert("Upload Failed");


    }



    uploadThemeBtn.innerText =
    "☁ Upload Theme";


};



if(backBtn){

backBtn.onclick = ()=>{


    window.location.href =
    "customer-dashboard.html?customer=" + customerId;


};

}



loadTheme();