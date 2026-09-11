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
   Admin Back System
=========================== */


function goBack(){

    window.history.back();

}


/* Desktop ESC Key */

document.addEventListener(
"keydown",
(e)=>{


    if(e.key === "Escape"){

        goBack();

    }


});



/* Mobile Browser Back */

window.addEventListener(
"popstate",
()=>{

    goBack();

});